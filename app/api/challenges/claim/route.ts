import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
    const session = await getSession();

    if (!session || !session.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { challengeId } = await req.json();
        const userId = session.id as string;

        // Find the participation record
        const participation = await db.challengeParticipant.findFirst({
            where: {
                userId,
                challengeId
            },
            include: {
                challenge: true
            }
        });

        if (!participation) {
            return NextResponse.json({ message: 'Not participating in this challenge' }, { status: 400 });
        }

        if (participation.completed) {
            return NextResponse.json({ message: 'Reward already claimed' }, { status: 400 });
        }

        if (participation.progress < 100) {
            return NextResponse.json({ message: 'Challenge not completed yet' }, { status: 400 });
        }

        const reward = participation.challenge.reward;

        // Mark as completed and award points
        await db.challengeParticipant.update({
            where: { id: participation.id },
            data: { completed: true }
        });

        // Add reward points to user
        await (db.user.update as any)({
            where: { id: userId },
            data: {
                ecoScore: { increment: reward }
            }
        });

        return NextResponse.json({
            message: 'Reward claimed successfully!',
            reward,
            success: true
        });
    } catch (error) {
        console.error("Claim reward error:", error);
        return NextResponse.json({ message: 'Failed to claim reward' }, { status: 500 });
    }
}
