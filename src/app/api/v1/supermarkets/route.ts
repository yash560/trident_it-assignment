import { NextResponse } from 'next/server';
import { RelationalRepository } from '@/db/relationalDb';
import { ApiResponse } from '@/lib/types';

export async function GET() {
  const timestamp = new Date().toISOString();
  try {
    const supermarkets = await RelationalRepository.listSupermarkets();
    const response: ApiResponse<typeof supermarkets> = {
      success: true,
      message: `Retrieved ${supermarkets.length} registered supermarkets`,
      data: supermarkets,
      timestamp,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: 500,
        error: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to list supermarkets',
        timestamp,
        path: '/api/v1/supermarkets',
      },
      { status: 500 }
    );
  }
}
