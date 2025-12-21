import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    const session = await getSession();

    if (!session || !session.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get today's start (midnight) and end
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const activities = await db.activity.findMany({
            where: {
                userId: session.id as string,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            },
            select: {
                id: true,
                type: true,
                action: true,
                carbonImpact: true,
                date: true
            },
            orderBy: {
                date: 'desc'
            }
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error("Today's activities error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
