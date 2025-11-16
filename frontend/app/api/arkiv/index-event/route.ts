import { NextResponse } from 'next/server';
import { indexProject } from '@/lib/arkiv-simple';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, eventData } = body;

    console.log('📝 Indexing event:', eventType, eventData);

    if (eventType === 'ProjectCreated') {
      const result = await indexProject({
        projectId: eventData.projectId,
        student: eventData.student,
        title: eventData.title,
        skills: eventData.skills || [],
        timestamp: eventData.timestamp || Date.now(),
      });

      console.log('✅ Event indexed successfully');
      return NextResponse.json({ success: true, result });
    }

    // For other event types, just return success for demo
    console.log('ℹ️ Event type not implemented, returning success for demo');
    return NextResponse.json({ success: true, result: { demo: true } });

  } catch (error: any) {
    console.error('❌ Arkiv indexing error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
