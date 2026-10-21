'use client';

import React, { useState } from 'react';
import { Database, Shield, Layers, CheckSquare, Eye, Cpu, Compass, Code, Table } from 'lucide-react';

export const ArchitectureExplorer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'schema' | 'approach' | 'stack' | 'features' | 'security' | 'frontend' | 'roadmap'
  >('schema');

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Database className="w-6 h-6 text-blue-600 dark:text-sky-400" />
          <span>System Architecture & Assignment Deliverables</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Comprehensive documentation directly answering the seven required deliverables for the Trident IT technical assessment.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        <button
          id="btn-arch-schema"
          onClick={() => setActiveSection('schema')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSection === 'schema'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>1. Database Schema</span>
        </button>

        <button
          id="btn-arch-approach"
          onClick={() => setActiveSection('approach')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSection === 'approach'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>2. API Building Approach</span>
        </button>

        <button
          id="btn-arch-stack"
          onClick={() => setActiveSection('stack')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSection === 'stack'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>3. Technical Stack</span>
        </button>

        <button
          id="btn-arch-features"
          onClick={() => setActiveSection('features')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSection === 'features'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>4. Minimum Features</span>
        </button>

        <button
          id="btn-arch-security"
          onClick={() => setActiveSection('security')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSection === 'security'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>5. Endpoint Security</span>
        </button>

        <button
          id="btn-arch-frontend"
          onClick={() => setActiveSection('frontend')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSection === 'frontend'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>6. Front-End Design</span>
        </button>

        <button
          id="btn-arch-roadmap"
          onClick={() => setActiveSection('roadmap')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSection === 'roadmap'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>7. Additional Features</span>
        </button>
      </div>

      {/* Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        {/* Section 1: Database Schema */}
        {activeSection === 'schema' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Deliverable 1: Relational Database Schema & Foreign Key Mapping
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Modeled for PostgreSQL and SQLite with ANSI SQL standards, strict foreign key constraints (1 Supermarket to N Offers, CASCADE on delete), and composite indexes.
              </p>
            </div>

            {/* Entity Relationship Diagram */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs">
              <div className="text-slate-500 mb-2 font-sans font-bold">Relational Entity-Relationship Diagram (ERD):</div>
              <pre className="text-blue-600 dark:text-sky-400 overflow-x-auto">{`
+---------------------------+             +-----------------------------------------+
|       supermarkets        | 1         N |                 offers                  |
+---------------------------+<------------+-----------------------------------------+
| id            VARCHAR(36) | [PK]        | id                  VARCHAR(36)    [PK] |
| name          VARCHAR(255)|             | supermarket_id      VARCHAR(36)    [FK] |
| slug          VARCHAR(255)| [UNIQUE]    | title               VARCHAR(255)        |
| email         VARCHAR(255)| [UNIQUE]    | description         TEXT                |
| phone         VARCHAR(50) |             | category            VARCHAR(50)         |
| address       TEXT        |             | discount_type       VARCHAR(30)         |
| city          VARCHAR(100)| [INDEX]     | discount_value      DECIMAL(10,2)       |
| state         VARCHAR(100)|             | original_price      DECIMAL(10,2)       |
| postal_code   VARCHAR(20) |             | discounted_price    DECIMAL(10,2)       |
| logo_url      TEXT        |             | coupon_code         VARCHAR(50)         |
| api_key_hash  VARCHAR(128)| [INDEX]     | start_date          TIMESTAMP      [IDX]|
| api_key_prefix VARCHAR(16)|             | end_date            TIMESTAMP      [IDX]|
| status        VARCHAR(20) |             | status              VARCHAR(20)    [IDX]|
| created_at    TIMESTAMP   |             | max_redemptions     INTEGER             |
| updated_at    TIMESTAMP   |             | current_redemptions INTEGER             |
+---------------------------+             +-----------------------------------------+
                                                               | 1
                                                               | N
                                                  +---------------------------------+
                                                  |           redemptions           |
                                                  +---------------------------------+
                                                  | id              VARCHAR(36) [PK]|
                                                  | offer_id        VARCHAR(36) [FK]|
                                                  | user_identifier VARCHAR(100)    |
                                                  | redeemed_at     TIMESTAMP       |
                                                  +---------------------------------+
              `}</pre>
            </div>

            {/* Tables Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Table className="w-4 h-4 text-blue-500" />
                  <span>Table: supermarkets</span>
                </h4>
                <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <li>• <strong>Primary Key:</strong> <code className="font-mono text-blue-500">id</code> (UUID / CUID)</li>
                  <li>• <strong>Unique Constraints:</strong> <code className="font-mono">email</code>, <code className="font-mono">slug</code></li>
                  <li>• <strong>Security Invariant:</strong> Raw API keys are never stored; only the SHA-256 hash (<code className="font-mono">api_key_hash</code>) is persisted.</li>
                  <li>• <strong>Indexes:</strong> <code className="font-mono">idx_supermarkets_slug</code>, <code className="font-mono">idx_supermarkets_city</code>.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Table className="w-4 h-4 text-emerald-500" />
                  <span>Table: offers</span>
                </h4>
                <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <li>• <strong>Foreign Key:</strong> <code className="font-mono">supermarket_id</code> references <code className="font-mono">supermarkets(id)</code> ON DELETE CASCADE.</li>
                  <li>• <strong>Check Constraints:</strong> <code className="font-mono">CHECK (end_date &gt;= start_date)</code>, <code className="font-mono">CHECK (discount_value &gt; 0)</code>.</li>
                  <li>• <strong>Composite Indexes:</strong> <code className="font-mono">(category, status)</code> and <code className="font-mono">(start_date, end_date)</code> for fast range queries.</li>
                  <li>• <strong>Concurrency:</strong> Atomic counter for <code className="font-mono">current_redemptions</code>.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Approach */}
        {activeSection === 'approach' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Deliverable 2: Approach to Build this REST API
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              The project is built on Domain-Driven Design (DDD) with a clean 3-tier architectural separation:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="font-bold text-sm text-slate-900 dark:text-white">1. Controller / Route Layer</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Implemented in Next.js 15 App Router Route Handlers (<code className="font-mono text-blue-500">src/app/api/v1/*</code>). Decoupled from transport mechanics, responsible for HTTP request parsing, extracting authorization headers (<code className="font-mono">X-API-Key</code>), validating input payload constraints, and returning standard JSON payloads.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="font-bold text-sm text-slate-900 dark:text-white">2. Relational Service & Repository Layer</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Encapsulated in <code className="font-mono text-blue-500">RelationalRepository</code> (<code className="font-mono">src/db/relationalDb.ts</code>). Implements foreign key checks, uniqueness checks on business email and URL slugs, promotional discount formula calculations, and relational joins (<code className="font-mono">offers JOIN supermarkets</code>).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="font-bold text-sm text-slate-900 dark:text-white">3. Defensive Validation & Error Normalization</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Ensures zero unhandled exceptions: malformed dates, negative prices, and invalid categories return RFC-standardized HTTP 400 Bad Request responses with explanatory messages.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Technical Stack */}
        {activeSection === 'stack' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Deliverable 3: Technical Stack
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">Framework & Runtime</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">Next.js 15 & React 19</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  App Router architecture combining server-side REST API Route Handlers with high-speed client components.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Type System</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">TypeScript 5</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Strict type-checking (<code className="font-mono">strict: true</code>) across all models, DTOs, and API responses.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Relational Database</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">SQLite / PostgreSQL + Prisma ORM</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  ANSI SQL schema (<code className="font-mono">schema.sql</code>) and Prisma model (<code className="font-mono">schema.prisma</code>) with zero external database downtime risk.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Styling & Theme</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">Tailwind CSS v4</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Native `@custom-variant dark` support with sharp contrast colors, custom scrollbars, and fluid animations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Minimum Features */}
        {activeSection === 'features' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Deliverable 4: Minimum Features on Required Endpoints
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white font-mono">POST</span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">/api/v1/supermarkets/register</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                  <li>Mandatory validation of store name, physical address, phone, and valid RFC email format.</li>
                  <li>Uniqueness verification: duplicate registration attempts on email or store slug trigger a 400 Bad Request error.</li>
                  <li>Cryptographic minting of high-entropy API key (<code className="font-mono">trsk_live_...</code>) returned strictly once in response body.</li>
                  <li>Initialization of store status to ACTIVE.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white font-mono">POST</span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">/api/v1/supermarkets/:id/offers</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                  <li>Foreign key verification that the parent supermarket exists and is in ACTIVE status.</li>
                  <li>Verification of date constraints (<code className="font-mono">endDate &gt; startDate</code>).</li>
                  <li>Calculation of net discounted price based on discount type (PERCENTAGE, FIXED_AMOUNT, BOGO).</li>
                  <li>Coupon code formatting and optional redemption capacity caps.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white font-mono">GET</span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">/api/v1/offers</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                  <li>Relational join to include parent supermarket business details (name, city, logo).</li>
                  <li>Temporal validity filtering (<code className="font-mono">availableNow=true</code> excludes expired promotions).</li>
                  <li>Multi-attribute filtering (category, supermarket ID, discount type, city).</li>
                  <li>Full-text search querying title, description, and supermarket name.</li>
                  <li>Offset pagination (<code className="font-mono">page</code>, <code className="font-mono">limit</code>) with total metadata.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Security */}
        {activeSection === 'security' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Deliverable 5: Endpoint Security Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Multiple defense-in-depth layers protect the REST API against unauthorized mutation, data tampering, and credential leakage:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>1. Zero-Knowledge Cryptographic API Key Hashing</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  API keys are generated via 24 bytes of cryptographically secure random entropy. The raw key is returned exactly once during registration. Only the SHA-256 hash (<code className="font-mono">apiKeyHash</code>) is stored in the database. When an inbound request supplies <code className="font-mono">X-API-Key</code>, the server hashes the input and matches the digest.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>2. Role-Based Access Control (RBAC) & Ownership Enforcements</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Public consumers have read-only access to browse offers and check health. Mutating endpoints (<code className="font-mono">POST /supermarkets/:id/offers</code>) verify that the authenticated supermarket matches the target ID.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-cyan-500" />
                  <span>3. Rate Limiting & Denial-of-Service Defense</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Public discovery endpoints are shielded by IP-based rate limiting (100 req/min). Offer redemption employs atomic capacity increments to prevent race-condition coupon abuse.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Front-End Design */}
        {activeSection === 'frontend' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Deliverable 6: Front-End Design Approach
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              The interface is engineered around an executive dual-persona paradigm:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="font-bold text-sm text-slate-900 dark:text-white">Shopper Discovery Portal</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Offers a high-converting catalog experience: Category carousel chips, search bar with debounce, discount percentage badges, countdown timers to promotion expiration, one-click coupon copying, and an interactive redemption modal with celebratory confetti feedback.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="font-bold text-sm text-slate-900 dark:text-white">Supermarket Merchant Studio</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Provides supermarket managers with a streamlined portal to register their store, copy their secret API key, and publish offers with live discount calculations and instant preview cards.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 7: Additional Features Roadmap */}
        {activeSection === 'roadmap' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Deliverable 7: Additional Features & Scalability Roadmap
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
                <strong className="text-slate-900 dark:text-white">1. GPS Proximity Radius Filter:</strong> Allows shoppers to filter deals within 2km, 5km, or 10km using spatial indexing (<code className="font-mono">ST_DWithin</code>).
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
                <strong className="text-slate-900 dark:text-white">2. Dynamic QR Code In-Store POS Scanner:</strong> Generates a single-use time-based QR code scanned at the cash register to instantly apply discounts and prevent fraudulent reuse.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
                <strong className="text-slate-900 dark:text-white">3. Multi-Store Franchise Chain Management:</strong> Supports corporate brands (e.g. Kroger, Safeway, Whole Foods) publishing nationwide promotions with regional store overrides.
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
                <strong className="text-slate-900 dark:text-white">4. Merchant ROI & Click-Through Analytics:</strong> Visualizes offer impressions, click rates, and total dollar redemption values for store managers.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
