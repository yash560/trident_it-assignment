import { NextRequest, NextResponse } from 'next/server';
import { RelationalRepository } from '@/db/relationalDb';
import { CreateOfferInput, ApiResponse, ApiErrorResponse } from '@/lib/types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const timestamp = new Date().toISOString();

  try {
    const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
    let authenticatedSm = null;
    if (apiKey) {
      authenticatedSm = await RelationalRepository.authenticateApiKey(apiKey);
      if (authenticatedSm && authenticatedSm.id !== id) {
        return NextResponse.json(
          {
            success: false,
            status: 403,
            error: 'FORBIDDEN',
            message: `Supplied API Key does not match target supermarket '${id}'`,
            timestamp,
            path: `/api/v1/supermarkets/${id}/offers`,
          },
          { status: 403 }
        );
      }
    }

    const body = (await req.json()) as CreateOfferInput;
    const offer = await RelationalRepository.createOffer(
      { ...body, supermarketId: id },
      authenticatedSm?.id || id
    );

    const response: ApiResponse<typeof offer> = {
      success: true,
      message: `Offer '${offer.title}' successfully published for supermarket '${offer.supermarket.name}'`,
      data: offer,
      timestamp,
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      status: 400,
      error: 'BAD_REQUEST',
      message: error.message || 'Failed to create promotional offer',
      timestamp,
      path: `/api/v1/supermarkets/${id}/offers`,
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
