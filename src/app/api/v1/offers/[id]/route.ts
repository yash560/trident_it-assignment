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
    const offer = await RelationalRepository.getOffer(id);
    if (!offer) {
      const error: ApiErrorResponse = {
        success: false,
        status: 404,
        error: 'NOT_FOUND',
        message: `Offer with ID '${id}' was not found`,
        timestamp,
        path: `/api/v1/offers/${id}`,
      };
      return NextResponse.json(error, { status: 404 });
    }

    const response: ApiResponse<typeof offer> = {
      success: true,
      message: `Retrieved details for offer '${offer.title}'`,
      data: offer,
      timestamp,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: 500,
        error: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to retrieve offer details',
        timestamp,
        path: `/api/v1/offers/${id}`,
      },
      { status: 500 }
    );
  }
}
