import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/arkiv-simple';

export async function GET() {
  try {
    console.log('🔌 Testing Arkiv connection...');
    console.log('Private key available:', !!process.env.ARKIV_PRIVATE_KEY);

    const connected = await testConnection();

    if (!connected) {
      console.error('❌ Arkiv connection failed');
      return NextResponse.json(
        { success: false, error: 'Failed to connect to Arkiv Mendoza' },
        { status: 500 }
      );
    }

    console.log('✅ Arkiv connection successful');

    return NextResponse.json({
      success: true,
      message: 'Connected to Arkiv Mendoza',
      networkId: 60138453056
    });
  } catch (error: any) {
    console.error('❌ Arkiv connection error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
