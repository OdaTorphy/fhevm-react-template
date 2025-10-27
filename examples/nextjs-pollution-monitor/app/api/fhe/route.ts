import { NextRequest, NextResponse } from 'next/server';

/**
 * FHE Operations Main Route
 * Handles general FHE operations and status checks
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'ok',
      message: 'FHE API is operational',
      endpoints: {
        encrypt: '/api/fhe/encrypt',
        decrypt: '/api/fhe/decrypt',
        compute: '/api/fhe/compute'
      },
      version: '1.0.0'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      status: 'received',
      data: body
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
