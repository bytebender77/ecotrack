import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    const session = await getSession();
    // Return empty list if not logged in, to avoid 401 errors on dashboard
    if (!session) return NextResponse.json([], { status: 200 });

    try {
        const activities = await db.activity.findMany({
            where: { userId: session.id as string },
            orderBy: { date: 'desc' },
            take: 10
        });
        return NextResponse.json(activities);
    } catch (error) {
        console.error("Failed to fetch activities:", error);
        return NextResponse.json({ message: 'Error fetching activities' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // Kept for reference but actual logging is in /log/route.ts
    // We can redirect or deprecate this later. 
    return NextResponse.json({ message: 'Use /api/activities/log for creating entries' }, { status: 400 });
}
