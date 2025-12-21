import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Public API - get all users for community page
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const search = searchParams.get('search') || '';
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');

        const users = await (db.user.findMany({
            where: search ? {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            } : undefined,
            orderBy: { ecoScore: 'desc' },
            skip: (page - 1) * limit,
            take: limit
        }) as any);

        // Don't expose sensitive data
        const publicUsers = users.map((user: any) => ({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            ecoScore: user.ecoScore || 0,
            carbonAvoided: user.carbonAvoided || 0,
            streakCurrent: user.streakCurrent || 0,
            country: user.country,
            createdAt: user.createdAt
        }));

        const total = await db.user.count({
            where: search ? {
                name: {
                    contains: search,
                    mode: 'insensitive'
                }
            } : undefined
        });

        return NextResponse.json({
            users: publicUsers,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Community users error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
