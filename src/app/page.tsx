'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { OfferCard } from '@/components/OfferCard';
import { MerchantPortalModal } from '@/components/MerchantPortalModal';
import { ApiConsole } from '@/components/ApiConsole';
import { ArchitectureExplorer } from '@/components/ArchitectureExplorer';
import { Footer } from '@/components/Footer';
import { OfferWithSupermarket, Supermarket, OfferCategory, DiscountType } from '@/lib/types';
import { Tag, RefreshCw, ShoppingBag } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'browse' | 'merchant' | 'api' | 'architecture'>('browse');
  const [isDark, setIsDark] = useState<boolean>(true);

  // Offers & Filters State
  const [offers, setOffers] = useState<OfferWithSupermarket[]>([]);
  const [supermarkets, setSupermarkets] = useState<Array<Supermarket & { activeOfferCount: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<OfferCategory | 'ALL'>('ALL');
  const [selectedDiscountType, setSelectedDiscountType] = useState<DiscountType | 'ALL'>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalMatching, setTotalMatching] = useState<number>(0);

  // Sync theme with DOM
  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    // Initial theme set
    document.documentElement.classList.add('dark');
  }, []);

  // Fetch Supermarkets
  const fetchSupermarkets = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/supermarkets');
      if (res.ok) {
        const json = await res.json();
        setSupermarkets(json.data || []);
      }
    } catch (e) {
      console.error('Failed to load supermarkets', e);
    }
  }, []);

  // Fetch Offers
  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
      if (selectedDiscountType !== 'ALL') params.set('discountType', selectedDiscountType);
      if (selectedCity !== 'ALL') params.set('city', selectedCity);
      params.set('page', page.toString());
      params.set('limit', '9');
      params.set('availableNow', 'true');

      const res = await fetch(`/api/v1/offers?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setOffers(json.data || []);
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages || 1);
          setTotalMatching(json.pagination.total || 0);
        }
      }
    } catch (e) {
      console.error('Failed to load offers', e);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedDiscountType, selectedCity, page]);

  useEffect(() => {
    fetchSupermarkets();
  }, [fetchSupermarkets]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Handle Redeem
  const handleRedeem = async (offerId: string) => {
    setRedeemingId(offerId);
    try {
      const res = await fetch(`/api/v1/offers/${offerId}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdentifier: 'shopper_session_web' }),
      });
      if (res.ok) {
        await fetchOffers();
      }
    } catch (err) {
      console.error('Failed to redeem', err);
    } finally {
      setRedeemingId(null);
    }
  };

  const availableCities = Array.from(new Set(supermarkets.map((s) => s.city)));

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDark={isDark}
          toggleTheme={toggleTheme}
          supermarketCount={supermarkets.length}
          offersCount={totalMatching || offers.length}
        />

        {activeTab === 'browse' && (
          <main>
            <HeroSection
              search={search}
              setSearch={setSearch}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedDiscountType={selectedDiscountType}
              setSelectedDiscountType={setSelectedDiscountType}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              availableCities={availableCities}
              totalOffers={totalMatching || offers.length}
              totalSupermarkets={supermarkets.length}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-blue-600 dark:text-sky-400" />
                    <span>Available Promotional Offers</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Showing {offers.length} of {totalMatching} deals currently active
                  </p>
                </div>

                <button
                  id="btn-refresh-offers"
                  onClick={() => fetchOffers()}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Deals</span>
                </button>
              </div>

              {/* Offers Grid */}
              {loading && offers.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-80 animate-pulse p-4 flex flex-col justify-between"
                    >
                      <div className="w-full h-40 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4"></div>
                      <div className="space-y-2">
                        <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                        <div className="w-1/2 h-3 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
                      </div>
                      <div className="w-full h-8 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4"></div>
                    </div>
                  ))}
                </div>
              ) : offers.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No promotions match your search or filters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Try clearing your category filter or search keywords, or publish a new offer in the Merchant Portal.
                  </p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setSelectedCategory('ALL');
                      setSelectedDiscountType('ALL');
                      setSelectedCity('ALL');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onRedeem={handleRedeem}
                      isRedeeming={redeemingId === offer.id}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center space-x-2">
                  <button
                    id="btn-prev-page"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    id="btn-next-page"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </main>
        )}

        {activeTab === 'merchant' && (
          <MerchantPortalModal
            supermarkets={supermarkets}
            onSupermarketRegistered={async () => {
              await fetchSupermarkets();
            }}
            onOfferCreated={async () => {
              await fetchOffers();
              await fetchSupermarkets();
            }}
          />
        )}

        {activeTab === 'api' && <ApiConsole />}

        {activeTab === 'architecture' && <ArchitectureExplorer />}
      </div>

      <Footer />
    </div>
  );
}
