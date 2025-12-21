import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Public API endpoint - no authentication required
export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId;

        // Get user without select to avoid TypeScript errors
        const user = await (db.user.findUnique({
            where: { id: userId }
        }) as any);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Don't expose sensitive data
        const publicUser = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            ecoScore: user.ecoScore || 0,
            carbonEmitted: user.carbonEmitted || 0,
            carbonAvoided: user.carbonAvoided || 0,
            streakCurrent: user.streakCurrent || 0,
            streakLongest: user.streakLongest || 0,
            createdAt: user.createdAt,
        };

        // Get completed challenges count
        const completedChallenges = await db.challengeParticipant.count({
            where: {
                userId: userId,
                completed: true
            }
        });

        // Get recent activities (last 10)
        const recentActivities = await db.activity.findMany({
            where: { userId: userId },
            select: {
                id: true,
                type: true,
                action: true,
                carbonImpact: true,
                date: true,
                points: true
            },
            orderBy: { date: 'desc' },
            take: 10
        });

        return NextResponse.json({
            user: {
                ...publicUser,
                completedChallenges
            },
            recentActivities
        });
    } catch (error) {
        console.error("Public profile error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

