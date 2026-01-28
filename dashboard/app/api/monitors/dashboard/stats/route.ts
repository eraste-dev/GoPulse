import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../auth/[...nextauth]/auth-options';

const BACKEND_URL = 'http://api:3000';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    try {
        const res = await fetch(`${BACKEND_URL}/monitors/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${session?.user?.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch dashboard stats' },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
