-- =====================================================================
-- Trident IT Promotional Offers Platform — Relational Database Schema
-- Compatible with PostgreSQL & SQLite (ANSI SQL Standard)
-- =====================================================================

-- 1. Supermarkets Table (Merchant Organization)
CREATE TABLE IF NOT EXISTS supermarkets (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    logo_url TEXT,
    api_key_hash VARCHAR(128) NOT NULL,
    api_key_prefix VARCHAR(16) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Supermarkets
CREATE INDEX IF NOT EXISTS idx_supermarkets_slug ON supermarkets(slug);
CREATE INDEX IF NOT EXISTS idx_supermarkets_email ON supermarkets(email);
CREATE INDEX IF NOT EXISTS idx_supermarkets_api_key_hash ON supermarkets(api_key_hash);
CREATE INDEX IF NOT EXISTS idx_supermarkets_city ON supermarkets(city);

-- 2. Promotional Offers Table
CREATE TABLE IF NOT EXISTS offers (
    id VARCHAR(36) PRIMARY KEY,
    supermarket_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'GROCERIES', 'PRODUCE', 'DAIRY', 'BAKERY', 'BEVERAGES', 'MEAT_SEAFOOD', 'HOUSEHOLD', 'SNACKS'
    )),
    discount_type VARCHAR(30) NOT NULL CHECK (discount_type IN (
        'PERCENTAGE', 'FIXED_AMOUNT', 'BOGO', 'BUNDLE'
    )),
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    original_price DECIMAL(10, 2) CHECK (original_price IS NULL OR original_price > 0),
    discounted_price DECIMAL(10, 2) CHECK (discounted_price IS NULL OR discounted_price >= 0),
    coupon_code VARCHAR(50),
    image_url TEXT,
    terms_and_conditions TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'DRAFT')),
    max_redemptions INTEGER CHECK (max_redemptions IS NULL OR max_redemptions > 0),
    current_redemptions INTEGER NOT NULL DEFAULT 0 CHECK (current_redemptions >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_offer_supermarket FOREIGN KEY (supermarket_id) 
        REFERENCES supermarkets(id) ON DELETE CASCADE,
    CONSTRAINT chk_offer_dates CHECK (end_date >= start_date)
);

-- Indexes for Offers
CREATE INDEX IF NOT EXISTS idx_offers_supermarket ON offers(supermarket_id);
CREATE INDEX IF NOT EXISTS idx_offers_category ON offers(category);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_dates ON offers(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_offers_discount_type ON offers(discount_type);

-- 3. Offer Redemptions Table (Audit Ledger & Rate-Limiting Protection)
CREATE TABLE IF NOT EXISTS redemptions (
    id VARCHAR(36) PRIMARY KEY,
    offer_id VARCHAR(36) NOT NULL,
    user_identifier VARCHAR(100) NOT NULL,
    redeemed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    client_ip VARCHAR(45),
    CONSTRAINT fk_redemption_offer FOREIGN KEY (offer_id) 
        REFERENCES offers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_redemptions_offer ON redemptions(offer_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_user ON redemptions(user_identifier);
