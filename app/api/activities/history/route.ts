import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    const session = await getSession();

    if (!session || !session.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get activities from last 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const activities = await db.activity.findMany({
            where: {
                userId: session.id as string,
                date: {
                    gte: ninetyDaysAgo
                }
            },
            select: {
                id: true,
                date: true,
                carbonImpact: true,
                type: true,
                action: true
            },
            orderBy: {
                date: 'desc'
            }
        });

        return NextResponse.json(activities);
    } catch (error) {
        console.error("Activity history error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
