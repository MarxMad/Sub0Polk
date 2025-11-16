import { NextResponse } from 'next/server';
import { queryProjects } from '@/lib/arkiv-simple';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, filters } = body;

    console.log('🔍 Querying Arkiv:', action, filters);

    if (action === 'queryEvents') {
      const result = await queryProjects(filters);
      console.log('✅ Query successful, results:', result.length);
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'getAnalytics') {
      // For demo, return mock analytics
      return NextResponse.json({
        success: true,
        data: {
          totalProjects: 0,
          totalUnlocks: 0,
          totalReviews: 0,
          averageRating: 0,
          projectsByChain: { polkadot: 0 },
          skillDistribution: {}
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('❌ Arkiv query error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
