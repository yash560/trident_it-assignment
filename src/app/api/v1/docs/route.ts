import { NextResponse } from 'next/server';

export async function GET() {
  const openApiSpec = {
    openapi: '3.1.0',
    info: {
      title: 'Trident IT — Promotional Offers & Supermarket Management REST API',
      version: '1.0.0',
      description:
        'Production REST API enabling supermarket businesses to register, authenticate with cryptographic API keys, publish targeted promotional offers, and enabling users to search, filter, and browse live discounts.',
      contact: {
        name: 'Yash Jain',
        email: 'yaashjainn@gmail.com',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Primary Production API Server',
      },
    ],
    paths: {
      '/supermarkets/register': {
        post: {
          summary: 'Register a new supermarket',
          description:
            'Registers a business merchant organization, enforces unique email and slug constraints, generates a SHA-256 hashed secret API key, and returns the merchant profile with the plaintext API key (minted once).',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'phone', 'address', 'city', 'state', 'postalCode'],
                  properties: {
                    name: { type: 'string', example: 'Trident HyperMart Express' },
                    email: { type: 'string', format: 'email', example: 'manager@tridentexpress.com' },
                    phone: { type: 'string', example: '+1 (415) 890-3412' },
                    address: { type: 'string', example: '742 Market Street, Financial District' },
                    city: { type: 'string', example: 'San Francisco' },
                    state: { type: 'string', example: 'CA' },
                    postalCode: { type: 'string', example: '94103' },
                    logoUrl: { type: 'string', format: 'uri', example: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Supermarket successfully registered',
            },
            400: {
              description: 'Validation Error or duplicate email/slug constraint violation',
            },
          },
        },
      },
      '/supermarkets': {
        get: {
          summary: 'List all registered supermarkets',
          responses: {
            200: { description: 'Array of registered supermarkets with live offer counts' },
          },
        },
      },
      '/offers': {
        get: {
          summary: 'Browse available offers',
          description:
            'Browse active promotional offers across supermarkets with relational joins, multi-category filtering, discount types, full-text search, and pagination.',
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Free-text search across title, description, and store name' },
            { name: 'category', in: 'query', schema: { type: 'string', enum: ['GROCERIES', 'PRODUCE', 'DAIRY', 'BAKERY', 'BEVERAGES', 'MEAT_SEAFOOD', 'HOUSEHOLD', 'SNACKS'] } },
            { name: 'discountType', in: 'query', schema: { type: 'string', enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'BOGO', 'BUNDLE'] } },
            { name: 'supermarketId', in: 'query', schema: { type: 'string' } },
            { name: 'city', in: 'query', schema: { type: 'string' } },
            { name: 'availableNow', in: 'query', schema: { type: 'boolean', default: true } },
            { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['discountValue', 'endDate', 'createdAt', 'title'] } },
            { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 9 } },
          ],
          responses: {
            200: { description: 'Paginated list of available promotional offers' },
          },
        },
        post: {
          summary: 'Create offer for supermarket',
          description:
            'Publishes a promotional discount offer. Can be authenticated via X-API-Key header or supermarketId payload.',
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description', 'category', 'discountType', 'discountValue', 'startDate', 'endDate'],
                  properties: {
                    supermarketId: { type: 'string', example: 'sm_trident_01' },
                    title: { type: 'string', example: '25% Off Fresh Organic Strawberries' },
                    description: { type: 'string', example: 'Locally grown sweet Watsonville organic strawberries 1lb clamshell.' },
                    category: { type: 'string', example: 'PRODUCE' },
                    discountType: { type: 'string', example: 'PERCENTAGE' },
                    discountValue: { type: 'number', example: 25 },
                    originalPrice: { type: 'number', example: 5.99 },
                    couponCode: { type: 'string', example: 'BERRY25' },
                    startDate: { type: 'string', format: 'date-time', example: '2026-10-21T00:00:00Z' },
                    endDate: { type: 'string', format: 'date-time', example: '2026-11-04T23:59:59Z' },
                    maxRedemptions: { type: 'integer', example: 200 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Promotional offer successfully created' },
            400: { description: 'Validation or business logic error' },
            403: { description: 'Forbidden: Invalid API key' },
          },
        },
      },
      '/offers/{id}': {
        get: {
          summary: 'Get single offer details',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Offer details with nested supermarket object' },
            404: { description: 'Offer not found' },
          },
        },
      },
      '/offers/{id}/redeem': {
        post: {
          summary: 'Redeem promotional offer',
          description: 'Atomically increments redemption counter and validates remaining capacity and date validity.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Offer successfully redeemed' },
            400: { description: 'Expired, inactive, or capacity exhausted' },
          },
        },
      },
      '/health': {
        get: {
          summary: 'System and database health check',
          responses: {
            200: { description: 'System health, uptime, and database metrics' },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'Cryptographically secure supermarket API key minted during registration.',
        },
      },
    },
  };

  return NextResponse.json(openApiSpec, { status: 200 });
}
