import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const session = await getSession();

    console.log('Join Challenge - Session:', session); // Debug log

    if (!session || !session.id) {
        console.log('No session or id found'); // Debug log
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id as string;

    try {
        const body = await req.json();
        const challengeId = body.challengeId as string;

        if (!challengeId || typeof challengeId !== 'string') {
            return NextResponse.json({ message: 'Challenge ID required' }, { status: 400 });
        }

        // Check if already joined
        const existing = await db.challengeParticipant.findUnique({
            where: {
                userId_challengeId: {
                    userId: userId,
                    challengeId: challengeId
                }
            }
        });

        if (existing) {
            return NextResponse.json({ message: 'Already joined this challenge' }, { status: 400 });
        }

        // Create participant entry
        await db.challengeParticipant.create({
            data: {
                userId: userId,
                challengeId: challengeId,
                progress: 0,
                completed: false
            }
        });

        return NextResponse.json({ message: 'Successfully joined challenge' });
    } catch (error) {
        console.error("Join challenge error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
