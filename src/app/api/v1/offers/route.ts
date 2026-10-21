import { NextRequest, NextResponse } from 'next/server';
import { RelationalRepository } from '@/db/relationalDb';
import { CreateOfferInput, BrowseOffersFilter, OfferCategory, DiscountType, ApiResponse, ApiErrorResponse } from '@/lib/types';

// 1. Browse Available Offers
export async function GET(req: NextRequest) {
  const timestamp = new Date().toISOString();
  try {
    const { searchParams } = new URL(req.url);

    const filter: BrowseOffersFilter = {
      search: searchParams.get('search') || undefined,
      category: (searchParams.get('category') as OfferCategory) || undefined,
      supermarketId: searchParams.get('supermarketId') || undefined,
      discountType: (searchParams.get('discountType') as DiscountType) || undefined,
      city: searchParams.get('city') || undefined,
      availableNow: searchParams.get('availableNow') === 'false' ? false : true,
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 9,
    };

    const { offers, pagination } = await RelationalRepository.browseOffers(filter);

    const response: ApiResponse<typeof offers> = {
      success: true,
      message: `Retrieved ${offers.length} offers (Total matching: ${pagination.total})`,
      data: offers,
      pagination,
      timestamp,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      status: 500,
      error: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Failed to browse promotional offers',
      timestamp,
      path: '/api/v1/offers',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// 2. Create Offer for Supermarket
export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();
  try {
    const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
    let authenticatedSm = null;
    if (apiKey) {
      authenticatedSm = await RelationalRepository.authenticateApiKey(apiKey);
    }

    const body = (await req.json()) as CreateOfferInput;
    const targetSupermarketId = authenticatedSm?.id || body.supermarketId;

    if (!targetSupermarketId) {
      return NextResponse.json(
        {
          success: false,
          status: 400,
          error: 'MISSING_SUPERMARKET_ID',
          message: 'supermarketId is required in JSON body or via authenticated X-API-Key header',
          timestamp,
          path: '/api/v1/offers',
        },
        { status: 400 }
      );
    }

    const offer = await RelationalRepository.createOffer(body, targetSupermarketId);

    const response: ApiResponse<typeof offer> = {
      success: true,
      message: `Promotional offer '${offer.title}' successfully created for '${offer.supermarket.name}'!`,
      data: offer,
      timestamp,
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      status: 400,
      error: 'BAD_REQUEST',
      message: error.message || 'Failed to create offer',
      timestamp,
      path: '/api/v1/offers',
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
