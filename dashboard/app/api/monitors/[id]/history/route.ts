import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../auth/[...nextauth]/auth-options';

const BACKEND_URL = 'http://api:3000';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '24h';

    try {
        const res = await fetch(
            `${BACKEND_URL}/monitors/${id}/history?period=${period}`,
            {
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch monitor history' },
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
