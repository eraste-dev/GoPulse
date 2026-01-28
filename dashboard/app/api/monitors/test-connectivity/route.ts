import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../auth/[...nextauth]/auth-options';

// Internal Docker URL for backend
const BACKEND_URL = 'http://api:3000';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    try {
        const res = await fetch(`${BACKEND_URL}/monitors/test-connectivity`, {
            method: 'POST',
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
