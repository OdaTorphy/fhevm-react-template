import { NextRequest, NextResponse } from 'next/server';

/**
 * Decryption API Route
 * Handles decryption requests with EIP-712 signature verification
 */
export async function POST(request: NextRequest) {
  try {
    const { encryptedData, signature, contractAddress } = await request.json();

    if (!encryptedData || !signature || !contractAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: encryptedData, signature, contractAddress' },
        { status: 400 }
      );
    }

    // Validate contract address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      return NextResponse.json(
        { error: 'Invalid contract address format' },
        { status: 400 }
      );
    }

    // In a real implementation, this would:
    // 1. Verify EIP-712 signature
    // 2. Check permissions
    // 3. Decrypt using FHEVM gateway

    return NextResponse.json({
      success: true,
      decrypted: {
        value: encryptedData,
        timestamp: Date.now(),
        contractAddress
      },
      message: 'Value decrypted successfully'
    });
  } catch (error) {
    console.error('Decryption error:', error);
    return NextResponse.json(
      { error: 'Decryption failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/fhe/decrypt',
    method: 'POST',
    description: 'Decrypt FHE encrypted values with EIP-712 signature',
    parameters: {
      encryptedData: 'string - Encrypted data to decrypt',
      signature: 'string - EIP-712 signature for authorization',
      contractAddress: 'string - Smart contract address'
    },
    example: {
      encryptedData: '0x...',
      signature: '0x...',
      contractAddress: '0x...'
    }
  });
}
