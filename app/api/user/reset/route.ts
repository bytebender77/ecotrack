import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
    const session = await getSession();

    if (!session || !session.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = session.id as string;

        // Delete all user activities
        await db.activity.deleteMany({
            where: { userId }
        });

        // Reset user stats
        await (db.user.update as any)({
            where: { id: userId },
            data: {
                ecoScore: 0,
                carbonEmitted: 0,
                carbonAvoided: 0,
                streakCurrent: 0,
            }
        });

        return NextResponse.json({
            message: 'All stats have been reset successfully!',
            success: true
        });
    } catch (error) {
        console.error("Reset stats error:", error);
        return NextResponse.json({ message: 'Failed to reset stats' }, { status: 500 });
    }
}
