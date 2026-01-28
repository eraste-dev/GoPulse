import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../auth/[...nextauth]/auth-options';

// Internal Docker URL for backend
const BACKEND_URL = 'http://api:3000';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    try {
        const res = await fetch(`${BACKEND_URL}/monitors/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${session?.user?.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    try {
        const res = await fetch(`${BACKEND_URL}/monitors/${params.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${session?.user?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    try {
        const res = await fetch(`${BACKEND_URL}/monitors/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${session?.user?.accessToken}`,
            },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
