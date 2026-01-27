import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'europe';

    try {
        const monitors = await prisma.monitor.findMany({
            where: {
                isActive: true,
                regions: {
                    has: region
                }
            },
            select: {
                id: true,
                url: true,
                method: true,
                interval: true,
                timeout: true,
                threshold: true,
                headers: true,
                userAgent: true,
                expectedStatus: true
            }
        });

        return NextResponse.json(monitors);
    } catch (error) {
        console.error('Error fetching monitors for agent:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
