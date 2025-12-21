import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const challenges = await db.challenge.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(challenges);
    } catch (error) {
        console.error("Challenges fetch error:", error);
        return NextResponse.json({ message: 'Error fetching challenges' }, { status: 500 });
    }
}
