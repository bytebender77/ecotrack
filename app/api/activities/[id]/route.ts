import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    return NextResponse.json({ message: `Getting activity ${params.id}` });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    return NextResponse.json({ message: `Updating activity ${params.id}` });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return NextResponse.json({ message: `Deleting activity ${params.id}` });
}
