import { NextResponse } from 'next/server';
import { RelationalRepository } from '@/db/relationalDb';

export async function GET() {
  const timestamp = new Date().toISOString();
  try {
    const supermarkets = await RelationalRepository.listSupermarkets();
    const { pagination } = await RelationalRepository.browseOffers({ limit: 1 });

    return NextResponse.json({
      status: 'HEALTHY',
      service: 'Trident IT Promotional Offers REST API',
      version: '1.0.0',
      database: {
        engine: 'SQLite Relational Database (ANSI SQL & Prisma Relational Model)',
        status: 'CONNECTED',
        tables: ['supermarkets', 'offers', 'redemptions'],
        totalSupermarkets: supermarkets.length,
        totalActiveOffers: pagination.total,
      },
      endpoints: {
        registerSupermarket: 'POST /api/v1/supermarkets/register',
        createOffer: 'POST /api/v1/supermarkets/:id/offers (or POST /api/v1/offers)',
        browseOffers: 'GET /api/v1/offers?category=&search=&discountType=&city=&page=&limit=',
        health: 'GET /api/v1/health',
        openApi: 'GET /api/v1/docs',
      },
      timestamp,
      uptimeSeconds: process.uptime(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'UNHEALTHY',
        error: error.message,
        timestamp,
      },
      { status: 500 }
    );
  }
}
