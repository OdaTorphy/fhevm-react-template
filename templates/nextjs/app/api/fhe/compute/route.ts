import { NextRequest, NextResponse } from 'next/server';

/**
 * Homomorphic Computation API Route
 * Handles FHE computation operations
 */
export async function POST(request: NextRequest) {
  try {
    const { operation, operands } = await request.json();

    if (!operation || !operands || !Array.isArray(operands)) {
      return NextResponse.json(
        { error: 'Missing required fields: operation and operands array' },
        { status: 400 }
      );
    }

    // Validate operation type
    const validOperations = ['add', 'sub', 'mul', 'div', 'eq', 'ne', 'lt', 'lte', 'gt', 'gte', 'min', 'max'];
    if (!validOperations.includes(operation)) {
      return NextResponse.json(
        { error: `Invalid operation. Must be one of: ${validOperations.join(', ')}` },
        { status: 400 }
      );
    }

    if (operands.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 operands are required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would perform homomorphic computation
    // For now, return a mock computed response
    return NextResponse.json({
      success: true,
      result: {
        operation,
        operandCount: operands.length,
        timestamp: Date.now()
      },
      message: `Homomorphic ${operation} operation completed successfully`
    });
  } catch (error) {
    console.error('Computation error:', error);
    return NextResponse.json(
      { error: 'Computation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoint: '/api/fhe/compute',
    method: 'POST',
    description: 'Perform homomorphic computations on encrypted data',
    parameters: {
      operation: 'string - Operation type (add, sub, mul, div, eq, ne, lt, lte, gt, gte, min, max)',
      operands: 'array - Encrypted operands for the computation'
    },
    example: {
      operation: 'add',
      operands: ['0x...', '0x...']
    }
  });
}
