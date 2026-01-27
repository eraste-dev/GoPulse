import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { target_url, status, status_code, response_time_ms, error_message, agent_id } = body;

        // Validation basique
        if (!target_url || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Enregistrement dans la base de données
        const report = await prisma.pingReport.create({
            data: {
                targetUrl: target_url,
                status: status,
                statusCode: status_code || 0,
                responseTime: response_time_ms || 0,
                errorMessage: error_message,
                agentId: agent_id,
            },
        });

        return NextResponse.json({ success: true, id: report.id }, { status: 201 });
    } catch (error) {
        console.error('Error saving ping report:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
