import { NextRequest, NextResponse } from 'next/server';
import { RelationalRepository } from '@/db/relationalDb';
import { ApiResponse, ApiErrorResponse } from '@/lib/types';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const timestamp = new Date().toISOString();

  try {
    const data = await RelationalRepository.getSupermarket(id);
    if (!data) {
      const notFound: ApiErrorResponse = {
        success: false,
        status: 404,
        error: 'NOT_FOUND',
        message: `Supermarket with ID or slug '${id}' was not found`,
        timestamp,
        path: `/api/v1/supermarkets/${id}`,
      };
      return NextResponse.json(notFound, { status: 404 });
    }

    const response: ApiResponse<typeof data> = {
      success: true,
      message: `Retrieved supermarket profile for '${data.supermarket.name}'`,
      data,
      timestamp,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: 500,
        error: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to retrieve supermarket',
        timestamp,
        path: `/api/v1/supermarkets/${id}`,
      },
      { status: 500 }
    );
  }
}
