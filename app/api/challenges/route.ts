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

        // If user is logged in, get their participation data with progress
        let participationData: Record<string, { progress: number; completed: boolean }> = {};
        if (session?.id) {
            const participations = await db.challengeParticipant.findMany({
                where: { userId: session.id as string },
                select: { challengeId: true, progress: true, completed: true }
            });
            participations.forEach((p: any) => {
                participationData[p.challengeId] = {
                    progress: p.progress || 0,
                    completed: p.completed || false
                };
            });
        }

        return NextResponse.json({
            challenges,
            participationData
        });
    } catch (error) {
        console.error("Challenges fetch error:", error);
        return NextResponse.json({ message: 'Error fetching challenges' }, { status: 500 });
    }
}
