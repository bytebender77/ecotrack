import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Ensure real-time fetching

export async function GET() {
    try {
        // Fetch top 50 users by Eco Score
        const users = await db.user.findMany({
            orderBy: { ecoScore: 'desc' },
            take: 50,
            select: {
                id: true,
                name: true,
                avatar: true,
                ecoScore: true,
                country: true,
                totalSaved: true,
                streakCurrent: true,
            }
        });

        // Transform and add rank
        const leaderboard = users.map((user, index) => ({
            ...user,
            rank: index + 1,
            // Fallback for avatar if null (though DB default handles this, purely safe-guard)
            avatar: user.avatar || '/images/default-avatar.png'
        }));

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        return NextResponse.json({ message: 'Error fetching leaderboard' }, { status: 500 });
    }
}
