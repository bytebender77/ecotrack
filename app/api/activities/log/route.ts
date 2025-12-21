import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { type, action, carbonImpact, points, description } = body;

        // validation
        if (!type || !action || carbonImpact === undefined) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Get current user data for streak calculation
        const user = await db.user.findUnique({
            where: { id: session.id as string },
            select: {
                streakCurrent: true,
                streakLongest: true,
                lastActivity: true,
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Calculate streak based on consecutive days
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        const lastActivityDate = user.lastActivity ? new Date(user.lastActivity) : null;
        if (lastActivityDate) {
            lastActivityDate.setHours(0, 0, 0, 0);
        }

        const daysSinceLastActivity = lastActivityDate
            ? Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))
            : Infinity;

        let newStreak: number;

        if (daysSinceLastActivity === 0) {
            // Same day - no change to streak
            newStreak = user.streakCurrent || 1;
        } else if (daysSinceLastActivity === 1) {
            // Consecutive day - increment
            newStreak = (user.streakCurrent || 0) + 1;
        } else {
            // Gap in days - reset to 1
            newStreak = 1;
        }

        const newLongest = Math.max(newStreak, user.streakLongest || 0);

        // Calculate dynamic points based on environmental impact
        // Simple Formula: 1 kg CO₂e = 2 EcoPoints
        // Avoided carbon (negative) → POSITIVE points (reward)
        // Emitted carbon (positive) → NEGATIVE points (penalty)
        // We negate because: avoiding -20kg carbon = +40 pts reward
        const calculatedPoints = Math.round(-parseFloat(carbonImpact) * 2);

        // Create Activity with calculated points
        const activity = await db.activity.create({
            data: {
                userId: session.id as string,
                type,
                action,
                description: description || '',
                carbonImpact: parseFloat(carbonImpact),
                points: calculatedPoints,  // Use calculated points instead of fallback
                date: new Date(),
            }
        });

        // Update User Stats with proper streak calculation
        // Categorize as emission or avoided based on activity type
        const absImpact = Math.abs(parseFloat(carbonImpact));

        // Determine if this is an emission or avoided carbon
        const isEmission = (
            (type === 'transport' && !['bicycle', 'walk', 'public_transport', 'bus', 'train'].includes(action)) ||
            (type === 'food' && (action.includes('chicken') || action.includes('beef') || action.includes('pork') || action.includes('meat'))) ||
            (type === 'energy' && (action.includes('grid') || action.includes('gas')))
        );

        const isAvoided = (
            (type === 'food' && (action.includes('vegetarian') || action.includes('vegan'))) ||
            (type === 'transport' && ['bicycle', 'walk', 'public_transport', 'bus', 'train'].includes(action)) ||
            (type === 'energy' && (action.includes('solar') || action.includes('wind') || action.includes('renewable')))
        );

        await db.user.update({
            where: { id: session.id as string },
            data: {
                totalSaved: { increment: parseFloat(carbonImpact) },
                ...(isEmission && { carbonEmitted: { increment: absImpact } }),
                ...(isAvoided && { carbonAvoided: { increment: absImpact } }),
                ecoScore: { increment: calculatedPoints },
                streakCurrent: newStreak,
                streakLongest: newLongest,
                lastActivity: new Date(),
            }
        });

        // Update challenge progress for matching challenges
        try {
            // Find user's active challenge participations
            const participations = await db.challengeParticipant.findMany({
                where: {
                    userId: session.id as string,
                    completed: false
                },
                include: {
                    challenge: true
                }
            });

            for (const participation of participations) {
                const challenge = participation.challenge as any;
                const target = challenge.target as any;

                // Check if this activity matches the challenge
                const matchesCategory = challenge.category === type;
                const matchesAction = target?.action && action.toLowerCase().includes(target.action.toLowerCase());

                if (matchesCategory || matchesAction) {
                    // Increment progress
                    const newProgress = Math.min(100, (participation.progress || 0) + 20); // 20% per matching activity
                    const isCompleted = newProgress >= 100;

                    await db.challengeParticipant.update({
                        where: {
                            userId_challengeId: {
                                userId: session.id as string,
                                challengeId: challenge.id
                            }
                        },
                        data: {
                            progress: newProgress,
                            completed: isCompleted,
                            ...(isCompleted && { completedAt: new Date() })
                        }
                    });

                    // Award bonus points if challenge completed
                    if (isCompleted) {
                        await db.user.update({
                            where: { id: session.id as string },
                            data: {
                                ecoScore: { increment: challenge.reward || 0 }
                            }
                        });
                    }
                }
            }
        } catch (challengeError) {
            console.error("Challenge progress update error:", challengeError);
            // Don't fail the activity logging if challenge update fails
        }

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error("Activity Log Error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
