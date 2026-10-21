// =====================================================================
// Trident IT — Relational Database Store & Service Layer
// Enforces Foreign Key Integrity, Unique Constraints & Relational Joins
// =====================================================================

import crypto from 'crypto';
import {
  Supermarket,
  SupermarketRegistrationInput,
  SupermarketRegistrationResponse,
  Offer,
  OfferWithSupermarket,
  CreateOfferInput,
  BrowseOffersFilter,
  PaginationMetadata,
} from '@/lib/types';

// In-Memory Relational Tables with Cross-Process Hot State
interface RelationalDatabaseState {
  supermarkets: Map<string, Supermarket>;
  offers: Map<string, Offer>;
  redemptions: Array<{ id: string; offerId: string; userIdentifier: string; timestamp: string }>;
}

declare global {
  // eslint-disable-next-line no-var
  var __TRIDENT_RELATIONAL_DB__: RelationalDatabaseState | undefined;
}

function getDatabase(): RelationalDatabaseState {
  if (!global.__TRIDENT_RELATIONAL_DB__) {
    global.__TRIDENT_RELATIONAL_DB__ = {
      supermarkets: new Map(),
      offers: new Map(),
      redemptions: [],
    };
    seedInitialData(global.__TRIDENT_RELATIONAL_DB__);
  }
  return global.__TRIDENT_RELATIONAL_DB__;
}

// ---------------------------------------------------------------------
// Crypto & Security Utilities
// ---------------------------------------------------------------------
export function generateApiKey(): { apiKey: string; hash: string; prefix: string } {
  const secret = crypto.randomBytes(24).toString('hex');
  const apiKey = `trsk_live_${secret}`;
  const prefix = apiKey.substring(0, 14);
  const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
  return { apiKey, hash, prefix };
}

export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey.trim()).digest('hex');
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---------------------------------------------------------------------
// Initial Seed Data (Realistic Relational Records)
// ---------------------------------------------------------------------
function seedInitialData(db: RelationalDatabaseState) {
  const sm1Id = 'sm_trident_01';
  const sm2Id = 'sm_metro_02';
  const sm3Id = 'sm_greenvale_03';
  const sm4Id = 'sm_apex_04';

  const defaultKeys = {
    sm1: generateApiKey(),
    sm2: generateApiKey(),
    sm3: generateApiKey(),
    sm4: generateApiKey(),
  };

  const supermarkets: Supermarket[] = [
    {
      id: sm1Id,
      name: 'Trident HyperMart Flagship',
      slug: 'trident-hypermart-flagship',
      email: 'store.sf@tridentit-retail.com',
      phone: '+1 (415) 890-3412',
      address: '742 Market Street, Financial District',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
      logoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&auto=format&fit=crop',
      apiKeyHash: defaultKeys.sm1.hash,
      apiKeyPrefix: defaultKeys.sm1.prefix,
      status: 'ACTIVE',
      createdAt: '2026-10-01T08:00:00Z',
      updatedAt: '2026-10-01T08:00:00Z',
    },
    {
      id: sm2Id,
      name: 'Metro Wholesale Club',
      slug: 'metro-wholesale-club',
      email: 'operations@metrowholesale.org',
      phone: '+1 (206) 555-0199',
      address: '1201 4th Avenue, Downtown',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop',
      apiKeyHash: defaultKeys.sm2.hash,
      apiKeyPrefix: defaultKeys.sm2.prefix,
      status: 'ACTIVE',
      createdAt: '2026-10-05T09:30:00Z',
      updatedAt: '2026-10-05T09:30:00Z',
    },
    {
      id: sm3Id,
      name: 'GreenVale Organic Grocers',
      slug: 'greenvale-organic-grocers',
      email: 'hello@greenvalegrocers.com',
      phone: '+1 (512) 440-8821',
      address: '450 South Congress Ave',
      city: 'Austin',
      state: 'TX',
      postalCode: '78704',
      logoUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=300&auto=format&fit=crop',
      apiKeyHash: defaultKeys.sm3.hash,
      apiKeyPrefix: defaultKeys.sm3.prefix,
      status: 'ACTIVE',
      createdAt: '2026-10-10T11:00:00Z',
      updatedAt: '2026-10-10T11:00:00Z',
    },
    {
      id: sm4Id,
      name: 'Apex Super Center',
      slug: 'apex-super-center',
      email: 'partners@apexsupercenter.com',
      phone: '+1 (312) 800-4321',
      address: '600 N Michigan Avenue',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60611',
      logoUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=300&auto=format&fit=crop',
      apiKeyHash: defaultKeys.sm4.hash,
      apiKeyPrefix: defaultKeys.sm4.prefix,
      status: 'ACTIVE',
      createdAt: '2026-10-12T14:15:00Z',
      updatedAt: '2026-10-12T14:15:00Z',
    },
  ];

  for (const sm of supermarkets) {
    db.supermarkets.set(sm.id, sm);
  }

  // Pre-seed Offers across supermarkets and categories
  const offers: Offer[] = [
    {
      id: 'off_001',
      supermarketId: sm1Id,
      title: '30% Off Farm Fresh California Hass Avocados',
      description: 'Hand-picked organic Haas avocados straight from Ventura County groves. Perfect for guacamole or keto toasts.',
      category: 'PRODUCE',
      discountType: 'PERCENTAGE',
      discountValue: 30,
      originalPrice: 7.99,
      discountedPrice: 5.59,
      couponCode: 'AVO30',
      imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop',
      termsAndConditions: 'Valid while stocks last. Max 4 bags per customer.',
      startDate: '2026-10-15T00:00:00Z',
      endDate: '2026-10-28T23:59:59Z',
      status: 'ACTIVE',
      maxRedemptions: 500,
      currentRedemptions: 142,
      isFeatured: true,
      createdAt: '2026-10-15T08:00:00Z',
      updatedAt: '2026-10-15T08:00:00Z',
    },
    {
      id: 'off_002',
      supermarketId: sm1Id,
      title: 'Buy 1 Get 1 Free: Artisanal Sourdough Batards',
      description: 'Slow-fermented wild yeast French sourdough baked fresh every morning at 5:00 AM.',
      category: 'BAKERY',
      discountType: 'BOGO',
      discountValue: 100,
      originalPrice: 8.50,
      discountedPrice: 4.25,
      couponCode: 'SOURDOUGHBOGO',
      imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop',
      termsAndConditions: 'Limit one per loyalty account daily.',
      startDate: '2026-10-18T00:00:00Z',
      endDate: '2026-10-31T23:59:59Z',
      status: 'ACTIVE',
      maxRedemptions: 250,
      currentRedemptions: 89,
      isFeatured: true,
      createdAt: '2026-10-18T09:00:00Z',
      updatedAt: '2026-10-18T09:00:00Z',
    },
    {
      id: 'off_003',
      supermarketId: sm2Id,
      title: '$5.00 Instant Rebate on Grass-Fed Irish Butter (4-Pack)',
      description: 'Cultured golden Kerrygold-grade grass-fed salted butter sticks. Rich beta-carotene and omega-3 profile.',
      category: 'DAIRY',
      discountType: 'FIXED_AMOUNT',
      discountValue: 5.0,
      originalPrice: 16.99,
      discountedPrice: 11.99,
      couponCode: 'BUTTER5',
      imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop',
      termsAndConditions: 'Applies to 4-pack cartons only.',
      startDate: '2026-10-19T00:00:00Z',
      endDate: '2026-11-05T23:59:59Z',
      status: 'ACTIVE',
      maxRedemptions: 400,
      currentRedemptions: 64,
      isFeatured: false,
      createdAt: '2026-10-19T10:15:00Z',
      updatedAt: '2026-10-19T10:15:00Z',
    },
    {
      id: 'off_004',
      supermarketId: sm3Id,
      title: '25% Off Organic Cold-Pressed Juice Cleanse Bundles',
      description: 'Raw, unpasteurized cold-pressed greens, turmeric ginger, and beet pomegranate elixirs in glass bottles.',
      category: 'BEVERAGES',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      originalPrice: 28.00,
      discountedPrice: 21.00,
      couponCode: 'GREENJUICE25',
      imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&auto=format&fit=crop',
      termsAndConditions: 'Must purchase minimum 4 bottles.',
      startDate: '2026-10-16T00:00:00Z',
      endDate: '2026-10-30T23:59:59Z',
      status: 'ACTIVE',
      maxRedemptions: 300,
      currentRedemptions: 112,
      isFeatured: true,
      createdAt: '2026-10-16T12:00:00Z',
      updatedAt: '2026-10-16T12:00:00Z',
    },
    {
      id: 'off_005',
      supermarketId: sm4Id,
      title: '$8.00 Off Wild Caught Pacific Sockeye Salmon Fillets',
      description: 'Sustainably harvest-certified salmon from Bristol Bay, Alaska. High in natural astaxanthin and protein.',
      category: 'MEAT_SEAFOOD',
      discountType: 'FIXED_AMOUNT',
      discountValue: 8.0,
      originalPrice: 24.99,
      discountedPrice: 16.99,
      couponCode: 'WILD8SALMON',
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop',
      termsAndConditions: 'Per lb pricing. Fresh seafood counter.',
      startDate: '2026-10-20T00:00:00Z',
      endDate: '2026-11-02T23:59:59Z',
      status: 'ACTIVE',
      maxRedemptions: 200,
      currentRedemptions: 38,
      isFeatured: false,
      createdAt: '2026-10-20T09:00:00Z',
      updatedAt: '2026-10-20T09:00:00Z',
    },
    {
      id: 'off_006',
      supermarketId: sm2Id,
      title: '40% Off Seventh Generation Eco-Friendly Laundry Detergent',
      description: 'Plant-based enzyme cleaning formula, zero synthetic fragrances or dyes, USDA Certified 97% Biobased.',
      category: 'HOUSEHOLD',
      discountType: 'PERCENTAGE',
      discountValue: 40,
      originalPrice: 19.99,
      discountedPrice: 11.99,
      couponCode: 'CLEAN40',
      imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop',
      termsAndConditions: 'Valid on 100 fl oz bottles.',
      startDate: '2026-10-14T00:00:00Z',
      endDate: '2026-11-10T23:59:59Z',
      status: 'ACTIVE',
      maxRedemptions: 600,
      currentRedemptions: 215,
      isFeatured: false,
      createdAt: '2026-10-14T15:30:00Z',
      updatedAt: '2026-10-14T15:30:00Z',
    },
    {
      id: 'off_007',
      supermarketId: sm3Id,
      title: 'Buy 2 Get 1 Free: Organic Medjool Dates & Almond Clusters',
      description: 'California sun-ripened Medjool dates stuffed with raw sprouted Marcona almonds and cinnamon.',
      category: 'SNACKS',
      discountType: 'BOGO',
      discountValue: 33.3,
      originalPrice: 12.00,
      discountedPrice: 8.00,
      couponCode: 'MEDJOOLB2G1',
      imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop',
      termsAndConditions: 'Mix and match eligible items.',
      startDate: '2026-10-17T00:00:00Z',
      endDate: '2026-10-29T23:59:59Z',
      status: 'ACTIVE',
      maxRedemptions: 150,
      currentRedemptions: 43,
      isFeatured: false,
      createdAt: '2026-10-17T11:00:00Z',
      updatedAt: '2026-10-17T11:00:00Z',
    },
    {
      id: 'off_008',
      supermarketId: sm4Id,
      title: '20% Off Extra Virgin Olive Oil (Single Origin Crete)',
      description: 'Cold-extracted Koroneiki olive oil with ultra-low acidity (<0.2%) and peppery polyphenol finish.',
      category: 'GROCERIES',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      originalPrice: 22.50,
      discountedPrice: 18.00,
      couponCode: 'EVOO20',
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop',
      termsAndConditions: '750ml glass bottles.',
      startDate: '2026-10-19T00:00:00Z',
      endDate: '2026-11-15T23:59:59Z',
      status: 'ACTIVE',
      maxRedemptions: 350,
      currentRedemptions: 71,
      isFeatured: true,
      createdAt: '2026-10-19T14:00:00Z',
      updatedAt: '2026-10-19T14:00:00Z',
    },
  ];

  for (const off of offers) {
    db.offers.set(off.id, off);
  }
}

// ---------------------------------------------------------------------
// Relational Repository Implementation
// ---------------------------------------------------------------------
export class RelationalRepository {
  // 1. Supermarket Registration
  static async registerSupermarket(
    input: SupermarketRegistrationInput
  ): Promise<SupermarketRegistrationResponse> {
    const db = getDatabase();

    // Data Validation
    if (!input.name || input.name.trim().length < 2) {
      throw new Error('Supermarket name is required (min 2 characters)');
    }
    if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      throw new Error('Valid business email address is required');
    }
    if (!input.phone || input.phone.trim().length < 7) {
      throw new Error('Valid contact phone number is required');
    }
    if (!input.address || !input.city || !input.state || !input.postalCode) {
      throw new Error('Full physical address (address, city, state, postalCode) is required');
    }

    // Unique Constraint Verification (Email & Slug)
    const emailNorm = input.email.toLowerCase().trim();
    for (const sm of db.supermarkets.values()) {
      if (sm.email.toLowerCase() === emailNorm) {
        throw new Error(`Supermarket with email '${input.email}' is already registered (Unique Constraint Violated)`);
      }
    }

    const baseSlug = generateSlug(input.name);
    let slug = baseSlug;
    let counter = 1;
    while (Array.from(db.supermarkets.values()).some((s) => s.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const id = `sm_${crypto.randomBytes(6).toString('hex')}`;
    const { apiKey, hash, prefix } = generateApiKey();
    const now = new Date().toISOString();

    const supermarket: Supermarket = {
      id,
      name: input.name.trim(),
      slug,
      email: emailNorm,
      phone: input.phone.trim(),
      address: input.address.trim(),
      city: input.city.trim(),
      state: input.state.trim().toUpperCase(),
      postalCode: input.postalCode.trim(),
      logoUrl: input.logoUrl || `https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&auto=format&fit=crop`,
      apiKeyHash: hash,
      apiKeyPrefix: prefix,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    // Relational Insert
    db.supermarkets.set(id, supermarket);

    const { apiKeyHash: _, ...safeSupermarket } = supermarket;
    return {
      supermarket: safeSupermarket,
      apiKey,
    };
  }

  // 2. Validate API Key / Authenticate Supermarket
  static async authenticateApiKey(apiKey: string): Promise<Supermarket | null> {
    if (!apiKey) return null;
    const db = getDatabase();
    const hash = hashApiKey(apiKey);

    for (const sm of db.supermarkets.values()) {
      if (sm.apiKeyHash === hash && sm.status === 'ACTIVE') {
        return sm;
      }
    }
    return null;
  }

  // 3. Create Offer for Supermarket
  static async createOffer(input: CreateOfferInput, authenticatedSupermarketId?: string): Promise<OfferWithSupermarket> {
    const db = getDatabase();

    const supermarketId = authenticatedSupermarketId || input.supermarketId;
    if (!supermarketId) {
      throw new Error('supermarketId must be provided or derived from authentication header');
    }

    // Relational Foreign Key Constraint Verification
    const supermarket = db.supermarkets.get(supermarketId);
    if (!supermarket) {
      throw new Error(`Foreign Key Violation: Supermarket '${supermarketId}' does not exist`);
    }

    if (supermarket.status !== 'ACTIVE') {
      throw new Error(`Supermarket '${supermarket.name}' is currently ${supermarket.status} and cannot publish offers`);
    }

    // Validation
    if (!input.title || input.title.trim().length < 3) {
      throw new Error('Offer title is required (min 3 characters)');
    }
    if (!input.description || input.description.trim().length < 5) {
      throw new Error('Offer description is required (min 5 characters)');
    }
    if (typeof input.discountValue !== 'number' || input.discountValue <= 0) {
      throw new Error('discountValue must be a positive number');
    }

    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Valid ISO-8601 startDate and endDate strings are required');
    }
    if (endDate <= startDate) {
      throw new Error('Validation Error: endDate must be strictly after startDate');
    }

    // Discount Calculation & Consistency
    let discountedPrice = input.originalPrice ? input.originalPrice : undefined;
    if (input.originalPrice !== undefined) {
      if (input.discountType === 'PERCENTAGE') {
        const factor = Math.min(100, Math.max(0, input.discountValue)) / 100;
        discountedPrice = Math.round(input.originalPrice * (1 - factor) * 100) / 100;
      } else if (input.discountType === 'FIXED_AMOUNT') {
        discountedPrice = Math.max(0, Math.round((input.originalPrice - input.discountValue) * 100) / 100);
      } else if (input.discountType === 'BOGO') {
        discountedPrice = Math.round((input.originalPrice / 2) * 100) / 100;
      }
    }

    const id = `off_${crypto.randomBytes(6).toString('hex')}`;
    const now = new Date().toISOString();

    const offer: Offer = {
      id,
      supermarketId: supermarket.id,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      discountType: input.discountType,
      discountValue: input.discountValue,
      originalPrice: input.originalPrice,
      discountedPrice,
      couponCode: input.couponCode ? input.couponCode.trim().toUpperCase() : undefined,
      imageUrl: input.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop',
      termsAndConditions: input.termsAndConditions || 'Standard promotional terms apply. In-store redemption only.',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'ACTIVE',
      maxRedemptions: input.maxRedemptions,
      currentRedemptions: 0,
      isFeatured: !!input.isFeatured,
      createdAt: now,
      updatedAt: now,
    };

    // Relational Insert
    db.offers.set(id, offer);

    return {
      ...offer,
      supermarket: {
        id: supermarket.id,
        name: supermarket.name,
        slug: supermarket.slug,
        city: supermarket.city,
        logoUrl: supermarket.logoUrl,
      },
    };
  }

  // 4. Browse Available Offers (Relational Query with Joins, Filters, Search & Pagination)
  static async browseOffers(
    filter: BrowseOffersFilter = {}
  ): Promise<{ offers: OfferWithSupermarket[]; pagination: PaginationMetadata }> {
    const db = getDatabase();
    const nowTime = new Date().getTime();

    // Relational Join: offers JOIN supermarkets ON offers.supermarketId = supermarkets.id
    const joinedRows: OfferWithSupermarket[] = [];

    for (const offer of db.offers.values()) {
      const sm = db.supermarkets.get(offer.supermarketId);
      if (!sm) continue; // Referential integrity safety

      // 1. Available Now Filter
      if (filter.availableNow !== false) {
        const start = new Date(offer.startDate).getTime();
        const end = new Date(offer.endDate).getTime();
        if (nowTime < start || nowTime > end || offer.status !== 'ACTIVE') {
          // If explicitly requested all, keep; otherwise skip inactive/expired
          if (filter.availableNow === true) continue;
        }
      }

      // 2. Category Filter
      if (filter.category && offer.category !== filter.category) {
        continue;
      }

      // 3. Supermarket ID Filter
      if (filter.supermarketId && offer.supermarketId !== filter.supermarketId) {
        continue;
      }

      // 4. Discount Type Filter
      if (filter.discountType && offer.discountType !== filter.discountType) {
        continue;
      }

      // 5. City Filter
      if (filter.city && sm.city.toLowerCase() !== filter.city.toLowerCase()) {
        continue;
      }

      // 6. Free-Text Search across Title, Description, and Supermarket Name
      if (filter.search && filter.search.trim().length > 0) {
        const q = filter.search.toLowerCase().trim();
        const matchTitle = offer.title.toLowerCase().includes(q);
        const matchDesc = offer.description.toLowerCase().includes(q);
        const matchSmName = sm.name.toLowerCase().includes(q);
        const matchCategory = offer.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchSmName && !matchCategory) {
          continue;
        }
      }

      joinedRows.push({
        ...offer,
        supermarket: {
          id: sm.id,
          name: sm.name,
          slug: sm.slug,
          city: sm.city,
          logoUrl: sm.logoUrl,
        },
      });
    }

    // 7. Sorting
    const sortBy = filter.sortBy || 'createdAt';
    const sortOrder = filter.sortOrder === 'asc' ? 1 : -1;

    joinedRows.sort((a, b) => {
      if (sortBy === 'discountValue') {
        return (a.discountValue - b.discountValue) * sortOrder;
      }
      if (sortBy === 'endDate') {
        return (new Date(a.endDate).getTime() - new Date(b.endDate).getTime()) * sortOrder;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title) * sortOrder;
      }
      // default: createdAt desc
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * sortOrder;
    });

    // 8. Pagination Metadata
    const page = Math.max(1, filter.page || 1);
    const limit = Math.max(1, Math.min(100, filter.limit || 9));
    const total = joinedRows.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedOffers = joinedRows.slice(startIndex, startIndex + limit);

    return {
      offers: paginatedOffers,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // 5. List Supermarkets with Offer Count
  static async listSupermarkets(): Promise<Array<Supermarket & { activeOfferCount: number }>> {
    const db = getDatabase();
    const result: Array<Supermarket & { activeOfferCount: number }> = [];

    for (const sm of db.supermarkets.values()) {
      let count = 0;
      for (const off of db.offers.values()) {
        if (off.supermarketId === sm.id && off.status === 'ACTIVE') {
          count++;
        }
      }
      const { apiKeyHash: _, ...safeSm } = sm;
      result.push({
        ...safeSm,
        apiKeyHash: 'PROTECTED',
        activeOfferCount: count,
      });
    }

    return result.sort((a, b) => b.activeOfferCount - a.activeOfferCount);
  }

  // 6. Get Supermarket Details by ID or Slug
  static async getSupermarket(idOrSlug: string): Promise<{ supermarket: Supermarket; offers: Offer[] } | null> {
    const db = getDatabase();
    let sm: Supermarket | undefined = db.supermarkets.get(idOrSlug);
    if (!sm) {
      sm = Array.from(db.supermarkets.values()).find((s) => s.slug === idOrSlug);
    }
    if (!sm) return null;

    const offers: Offer[] = [];
    for (const off of db.offers.values()) {
      if (off.supermarketId === sm.id) {
        offers.push(off);
      }
    }

    const { apiKeyHash: _, ...safeSm } = sm;
    return {
      supermarket: { ...safeSm, apiKeyHash: 'PROTECTED' },
      offers: offers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    };
  }

  // 7. Get Single Offer
  static async getOffer(id: string): Promise<OfferWithSupermarket | null> {
    const db = getDatabase();
    const off = db.offers.get(id);
    if (!off) return null;
    const sm = db.supermarkets.get(off.supermarketId);
    if (!sm) return null;

    return {
      ...off,
      supermarket: {
        id: sm.id,
        name: sm.name,
        slug: sm.slug,
        city: sm.city,
        logoUrl: sm.logoUrl,
      },
    };
  }

  // 8. Redeem Offer (Atomic Counter & Quota Check)
  static async redeemOffer(offerId: string, userIdentifier: string = 'shopper_anon'): Promise<{ success: boolean; message: string; remainingRedemptions?: number }> {
    const db = getDatabase();
    const off = db.offers.get(offerId);
    if (!off) {
      throw new Error(`Offer '${offerId}' not found`);
    }

    const now = new Date().getTime();
    if (now < new Date(off.startDate).getTime()) {
      throw new Error('This promotional offer is not yet active');
    }
    if (now > new Date(off.endDate).getTime()) {
      throw new Error('This promotional offer has expired');
    }
    if (off.status !== 'ACTIVE') {
      throw new Error(`This offer is inactive (${off.status})`);
    }

    if (off.maxRedemptions && off.currentRedemptions >= off.maxRedemptions) {
      throw new Error(`Promotion capacity reached (${off.maxRedemptions}/${off.maxRedemptions} redeemed)`);
    }

    // Atomic increment
    off.currentRedemptions += 1;
    off.updatedAt = new Date().toISOString();
    db.redemptions.push({
      id: `red_${crypto.randomBytes(6).toString('hex')}`,
      offerId,
      userIdentifier,
      timestamp: new Date().toISOString(),
    });

    const remaining = off.maxRedemptions ? off.maxRedemptions - off.currentRedemptions : undefined;
    return {
      success: true,
      message: `Coupon '${off.couponCode || 'OFFER'}' successfully applied!`,
      remainingRedemptions: remaining,
    };
  }
}
