import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json(null, { status: 200 });
    }

    try {
        const user = await db.user.findUnique({
            where: { id: session.id as string },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const session = await getSession();

    if (!session || !session.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, email, avatar, notifications, publicProfile } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (notifications !== undefined) updateData.notifications = notifications;
        if (publicProfile !== undefined) updateData.publicProfile = publicProfile;

        const updatedUser = await db.user.update({
            where: { id: session.id as string },
            data: updateData
        });

        return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error("Update user error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
