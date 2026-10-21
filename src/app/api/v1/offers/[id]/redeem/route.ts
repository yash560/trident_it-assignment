import { NextRequest, NextResponse } from 'next/server';
import { RelationalRepository } from '@/db/relationalDb';
import { ApiResponse, ApiErrorResponse } from '@/lib/types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const timestamp = new Date().toISOString();

  try {
    let userIdentifier = 'shopper_anon';
    try {
      const body = await req.json();
      if (body?.userIdentifier) {
        userIdentifier = body.userIdentifier;
      }
    } catch {
      // Body is optional
    }

    const result = await RelationalRepository.redeemOffer(id, userIdentifier);

    const response: ApiResponse<typeof result> = {
      success: true,
      message: result.message,
      data: result,
      timestamp,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      status: 400,
      error: 'REDEMPTION_FAILED',
      message: error.message || 'Failed to redeem offer',
      timestamp,
      path: `/api/v1/offers/${id}/redeem`,
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
