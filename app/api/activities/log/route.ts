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

        // Create Activity
        const activity = await db.activity.create({
            data: {
                userId: session.id as string,
                type,
                action,
                description: description || '',
                carbonImpact: parseFloat(carbonImpact),
                points: points || 10,
                date: new Date(),
            }
        });

        // Update User Stats (Atomic increment)
        await db.user.update({
            where: { id: session.id as string },
            data: {
                totalSaved: { increment: parseFloat(carbonImpact) },
                ecoScore: { increment: points || 10 },
                streakCurrent: { increment: 1 } // Simplified streak logic for now
            }
        });

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error("Activity Log Error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
