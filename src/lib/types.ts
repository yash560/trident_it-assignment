// =====================================================================
// Trident IT — Promotional Offers & Supermarket Management Data Types
// =====================================================================

export type SupermarketStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export type OfferCategory = 
  | 'GROCERIES' 
  | 'PRODUCE' 
  | 'DAIRY' 
  | 'BAKERY' 
  | 'BEVERAGES' 
  | 'MEAT_SEAFOOD' 
  | 'HOUSEHOLD' 
  | 'SNACKS';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BOGO' | 'BUNDLE';

export type OfferStatus = 'ACTIVE' | 'EXPIRED' | 'DRAFT';

export interface Supermarket {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  logoUrl?: string;
  apiKeyHash: string;
  apiKeyPrefix: string;
  status: SupermarketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupermarketRegistrationInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  logoUrl?: string;
}

export interface SupermarketRegistrationResponse {
  supermarket: Omit<Supermarket, 'apiKeyHash'>;
  apiKey: string; // Plaintext token returned only upon creation
}

export interface Offer {
  id: string;
  supermarketId: string;
  title: string;
  description: string;
  category: OfferCategory;
  discountType: DiscountType;
  discountValue: number;
  originalPrice?: number;
  discountedPrice?: number;
  couponCode?: string;
  imageUrl?: string;
  termsAndConditions?: string;
  startDate: string;
  endDate: string;
  status: OfferStatus;
  maxRedemptions?: number;
  currentRedemptions: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OfferWithSupermarket extends Offer {
  supermarket: {
    id: string;
    name: string;
    slug: string;
    city: string;
    logoUrl?: string;
  };
}

export interface CreateOfferInput {
  supermarketId?: string; // Optional if derived from authenticated X-API-Key
  title: string;
  description: string;
  category: OfferCategory;
  discountType: DiscountType;
  discountValue: number;
  originalPrice?: number;
  couponCode?: string;
  imageUrl?: string;
  termsAndConditions?: string;
  startDate: string;
  endDate: string;
  maxRedemptions?: number;
  isFeatured?: boolean;
}

export interface BrowseOffersFilter {
  search?: string;
  category?: OfferCategory;
  supermarketId?: string;
  discountType?: DiscountType;
  city?: string;
  availableNow?: boolean;
  sortBy?: 'discountValue' | 'endDate' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMetadata;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  error: string;
  message: string;
  timestamp: string;
  path: string;
  validationErrors?: Record<string, string>;
}
