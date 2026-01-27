import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { monitor_id, status, status_code, response_time_ms, error_message, region } = body;

        if (!monitor_id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Vérifier que le moniteur existe
        const monitor = await prisma.monitor.findUnique({
            where: { id: monitor_id }
        });

        if (!monitor) {
            return NextResponse.json({ error: 'Monitor not found' }, { status: 404 });
        }

        // Enregistrement dans la base de données
        const report = await prisma.pingReport.create({
            data: {
                monitorId: monitor_id,
                status: status,
                statusCode: status_code || 0,
                responseTime: response_time_ms || 0,
                errorMessage: error_message,
                region: region || 'unknown',
            },
        });

        return NextResponse.json({ success: true, id: report.id }, { status: 201 });
    } catch (error) {
        console.error('Error saving ping report:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
