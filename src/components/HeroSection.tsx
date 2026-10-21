'use client';

import React from 'react';
import { Search, Tag, Sparkles, MapPin, Percent, ShoppingBag, ShieldCheck } from 'lucide-react';
import { OfferCategory, DiscountType } from '@/lib/types';

interface HeroSectionProps {
  search: string;
  setSearch: (s: string) => void;
  selectedCategory: OfferCategory | 'ALL';
  setSelectedCategory: (c: OfferCategory | 'ALL') => void;
  selectedDiscountType: DiscountType | 'ALL';
  setSelectedDiscountType: (d: DiscountType | 'ALL') => void;
  selectedCity: string;
  setSelectedCity: (c: string) => void;
  availableCities: string[];
  totalOffers: number;
  totalSupermarkets: number;
}

const CATEGORIES: Array<{ key: OfferCategory | 'ALL'; label: string; icon: string }> = [
  { key: 'ALL', label: 'All Categories', icon: '🛒' },
  { key: 'PRODUCE', label: 'Fresh Produce', icon: '🥑' },
  { key: 'DAIRY', label: 'Dairy & Eggs', icon: '🧀' },
  { key: 'BAKERY', label: 'Artisan Bakery', icon: '🥖' },
  { key: 'GROCERIES', label: 'Pantry Groceries', icon: '🥫' },
  { key: 'BEVERAGES', label: 'Cold Beverages', icon: '🧃' },
  { key: 'MEAT_SEAFOOD', label: 'Meat & Seafood', icon: '🥩' },
  { key: 'HOUSEHOLD', label: 'Household & Cleaning', icon: '🧼' },
  { key: 'SNACKS', label: 'Healthy Snacks', icon: '🥜' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  selectedDiscountType,
  setSelectedDiscountType,
  selectedCity,
  setSelectedCity,
  availableCities,
  totalOffers,
  totalSupermarkets,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-transparent dark:from-slate-900/60 dark:via-[#090d16] dark:to-transparent py-10 md:py-14 border-b border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badge */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-700/50 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            <span>Trident IT Engineering Assessment — Live REST System</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Promotional Offers & <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Supermarket Management API
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            A production REST API and interactive discovery platform connecting registered supermarket businesses to local consumers with real-time discounts, verified coupons, and capacity-tracked redemptions.
          </p>
        </div>

        {/* KPI Metrics Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Tag className="w-4 h-4" />
              <span>Active Offers</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalOffers}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live verified deals</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShoppingBag className="w-4 h-4" />
              <span>Partner Stores</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalSupermarkets}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Across major cities</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Percent className="w-4 h-4" />
              <span>Avg Discount</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">32.5%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instant consumer savings</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>API Auth</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">SHA-256</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cryptographic API keys</div>
          </div>
        </div>

        {/* Real-time Search and Filter Bar */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="input-search-offers"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search offers by item, supermarket name, or description (e.g. Avocado, Sourdough, Metro)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            {/* City Filter */}
            <div className="relative min-w-[180px]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                id="select-city-filter"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-9 pr-8 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm appearance-none cursor-pointer"
              >
                <option value="ALL">All Metro Cities</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Discount Type Filter */}
            <div className="relative min-w-[160px]">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                id="select-discount-filter"
                value={selectedDiscountType}
                onChange={(e) => setSelectedDiscountType(e.target.value as any)}
                className="w-full pl-9 pr-8 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm appearance-none cursor-pointer"
              >
                <option value="ALL">All Deal Types</option>
                <option value="PERCENTAGE">Percentage % Off</option>
                <option value="FIXED_AMOUNT">Flat $ Cash Rebate</option>
                <option value="BOGO">Buy 1 Get 1 (BOGO)</option>
              </select>
            </div>
          </div>

          {/* Category Chips Carousel */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  id={`filter-${cat.key.toLowerCase()}`}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
