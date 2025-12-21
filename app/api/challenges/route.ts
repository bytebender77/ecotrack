import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getSession();

        const challenges = await db.challenge.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        // If user is logged in, get their joined challenge IDs
        let joinedChallengeIds: string[] = [];
        if (session?.id) {
            const participations = await db.challengeParticipant.findMany({
                where: { userId: session.id as string },
                select: { challengeId: true, progress: true, completed: true }
            });
            joinedChallengeIds = participations.map((p: any) => p.challengeId);
        }

        return NextResponse.json({
            challenges,
            joinedChallengeIds
        });
    } catch (error) {
        console.error("Challenges fetch error:", error);
        return NextResponse.json({ message: 'Error fetching challenges' }, { status: 500 });
    }
}
