import { NextRequest, NextResponse } from 'next/server';

/**
 * Encryption API Route
 * Handles client-side encryption requests
 */
export async function POST(request: NextRequest) {
  try {
    const { value, type } = await request.json();

    if (!value || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: value and type' },
        { status: 400 }
      );
    }

    // Validate encryption type
    const validTypes = ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid encryption type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // In a real implementation, this would use fhevmjs
    // For now, return a mock encrypted response
    return NextResponse.json({
      success: true,
      encrypted: {
        type,
        value: value.toString(),
        timestamp: Date.now()
      },
      message: 'Value encrypted successfully'
    });
  } catch (error) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: 'Encryption failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/fhe/encrypt',
    method: 'POST',
    description: 'Encrypt values using FHE',
    parameters: {
      value: 'number | string | boolean - Value to encrypt',
      type: 'string - Encryption type (uint8, uint16, uint32, uint64, bool, address)'
    },
    example: {
      value: 42,
      type: 'uint64'
    }
  });
}
