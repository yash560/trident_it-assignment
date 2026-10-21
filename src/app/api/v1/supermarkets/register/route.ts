import { NextRequest, NextResponse } from 'next/server';
import { RelationalRepository } from '@/db/relationalDb';
import { SupermarketRegistrationInput, ApiResponse, ApiErrorResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();
  try {
    const body = (await req.json()) as SupermarketRegistrationInput;

    const result = await RelationalRepository.registerSupermarket(body);

    const response: ApiResponse<typeof result> = {
      success: true,
      message: 'Supermarket successfully registered! Please securely store your API key; it will not be displayed again.',
      data: result,
      timestamp,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      status: 400,
      error: 'BAD_REQUEST',
      message: error.message || 'Failed to register supermarket',
      timestamp,
      path: '/api/v1/supermarkets/register',
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
