'use client';

import React, { useState } from 'react';
import { Store, PlusCircle, Key, Copy, Check, Sparkles, Building, AlertCircle } from 'lucide-react';
import { Supermarket, OfferCategory, DiscountType } from '@/lib/types';

interface MerchantPortalModalProps {
  supermarkets: Array<Supermarket & { activeOfferCount: number }>;
  onSupermarketRegistered: () => Promise<void>;
  onOfferCreated: () => Promise<void>;
}

export const MerchantPortalModal: React.FC<MerchantPortalModalProps> = ({
  supermarkets,
  onSupermarketRegistered,
  onOfferCreated,
}) => {
  const [subTab, setSubTab] = useState<'register' | 'createOffer' | 'stores'>('register');

  // Register Form State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    logoUrl: '',
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [mintedApiKey, setMintedApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Create Offer Form State
  const [offerForm, setOfferForm] = useState({
    supermarketId: supermarkets[0]?.id || '',
    apiKey: '',
    title: '',
    description: '',
    category: 'PRODUCE' as OfferCategory,
    discountType: 'PERCENTAGE' as DiscountType,
    discountValue: 20,
    originalPrice: 10.0,
    couponCode: '',
    imageUrl: '',
    termsAndConditions: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    maxRedemptions: 200,
  });
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);
  const [offerSuccess, setOfferSuccess] = useState<string | null>(null);

  // Handle Register Supermarket
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError(null);

    try {
      const resp = await fetch('/api/v1/supermarkets/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setMintedApiKey(data.data.apiKey);
      await onSupermarketRegistered();
    } catch (err: any) {
      setRegError(err.message || 'Error registering supermarket');
    } finally {
      setRegLoading(false);
    }
  };

  // Handle Create Offer
  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfferLoading(true);
    setOfferError(null);
    setOfferSuccess(null);

    try {
      const payload = {
        supermarketId: offerForm.supermarketId || supermarkets[0]?.id,
        title: offerForm.title,
        description: offerForm.description,
        category: offerForm.category,
        discountType: offerForm.discountType,
        discountValue: Number(offerForm.discountValue),
        originalPrice: offerForm.originalPrice ? Number(offerForm.originalPrice) : undefined,
        couponCode: offerForm.couponCode || undefined,
        imageUrl: offerForm.imageUrl || undefined,
        termsAndConditions: offerForm.termsAndConditions || undefined,
        startDate: new Date(offerForm.startDate).toISOString(),
        endDate: new Date(offerForm.endDate).toISOString(),
        maxRedemptions: offerForm.maxRedemptions ? Number(offerForm.maxRedemptions) : undefined,
      };

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (offerForm.apiKey) {
        headers['X-API-Key'] = offerForm.apiKey.trim();
      }

      const resp = await fetch('/api/v1/offers', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.message || 'Failed to create offer');
      }

      setOfferSuccess(`Promotional offer '${data.data.title}' created successfully!`);
      await onOfferCreated();
      // Reset form
      setOfferForm((prev) => ({
        ...prev,
        title: '',
        description: '',
        couponCode: '',
      }));
    } catch (err: any) {
      setOfferError(err.message || 'Error creating promotional offer');
    } finally {
      setOfferLoading(false);
    }
  };

  const copyKeyToClipboard = () => {
    if (!mintedApiKey) return;
    navigator.clipboard.writeText(mintedApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 space-x-4">
        <button
          id="btn-subtab-register"
          onClick={() => {
            setSubTab('register');
            setMintedApiKey(null);
          }}
          className={`pb-3 text-sm font-semibold transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
            subTab === 'register'
              ? 'border-blue-600 text-blue-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>1. Register Supermarket</span>
        </button>

        <button
          id="btn-subtab-create-offer"
          onClick={() => setSubTab('createOffer')}
          className={`pb-3 text-sm font-semibold transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
            subTab === 'createOffer'
              ? 'border-blue-600 text-blue-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>2. Publish Promotional Offer</span>
        </button>

        <button
          id="btn-subtab-stores"
          onClick={() => setSubTab('stores')}
          className={`pb-3 text-sm font-semibold transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
            subTab === 'stores'
              ? 'border-blue-600 text-blue-600 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>3. Registered Stores ({supermarkets.length})</span>
        </button>
      </div>

      {/* Sub-Tab 1: Register Supermarket Form */}
      {subTab === 'register' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600 dark:text-sky-400" />
              <span>Register a Supermarket Business</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Endpoint: <code className="text-blue-600 dark:text-sky-400 font-mono">POST /api/v1/supermarkets/register</code>. Enforces unique business email and store slug, hashes credential keys using SHA-256, and provisions merchant privileges.
            </p>

            {/* API Key Modal on Success */}
            {mintedApiKey ? (
              <div className="mt-6 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 animate-fade-in">
                <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>Supermarket Successfully Provisioned!</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                  Your secure REST API key has been minted. You will use this key in the <code className="font-mono">X-API-Key</code> header to publish offers.
                </p>

                <div className="mt-4 flex items-center space-x-2">
                  <div className="flex-1 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 px-3.5 py-2.5 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 select-all overflow-x-auto">
                    {mintedApiKey}
                  </div>
                  <button
                    id="btn-copy-minted-key"
                    onClick={copyKeyToClipboard}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>

                <div className="mt-4 flex items-center space-x-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800/60">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Security Invariant: For zero-knowledge protection, this plaintext key is never stored in the database. Please copy it now!</span>
                </div>

                <button
                  onClick={() => {
                    setMintedApiKey(null);
                    setSubTab('createOffer');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
                >
                  Proceed to Publish First Offer →
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                {regError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                    {regError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Supermarket Name *
                    </label>
                    <input
                      id="input-sm-name"
                      type="text"
                      required
                      placeholder="e.g. Trident Market Central"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Business Email (Unique) *
                    </label>
                    <input
                      id="input-sm-email"
                      type="email"
                      required
                      placeholder="manager@tridentcentral.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      id="input-sm-phone"
                      type="text"
                      required
                      placeholder="+1 (415) 555-0144"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Store Logo URL (Optional)
                    </label>
                    <input
                      id="input-sm-logo"
                      type="url"
                      placeholder="https://..."
                      value={regForm.logoUrl}
                      onChange={(e) => setRegForm({ ...regForm, logoUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Physical Street Address *
                  </label>
                  <input
                    id="input-sm-address"
                    type="text"
                    required
                    placeholder="100 Mission Street, Suite 400"
                    value={regForm.address}
                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City *
                    </label>
                    <input
                      id="input-sm-city"
                      type="text"
                      required
                      placeholder="San Francisco"
                      value={regForm.city}
                      onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      State *
                    </label>
                    <input
                      id="input-sm-state"
                      type="text"
                      required
                      placeholder="CA"
                      value={regForm.state}
                      onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Postal Code *
                    </label>
                    <input
                      id="input-sm-postal"
                      type="text"
                      required
                      placeholder="94105"
                      value={regForm.postalCode}
                      onChange={(e) => setRegForm({ ...regForm, postalCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-register-sm"
                  type="submit"
                  disabled={regLoading}
                  className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>{regLoading ? 'Registering Supermarket...' : 'Register Supermarket & Mint API Key'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Create Offer Form */}
      {subTab === 'createOffer' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-blue-600 dark:text-sky-400" />
              <span>Create Offer for Supermarket</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Endpoint: <code className="text-blue-600 dark:text-sky-400 font-mono">POST /api/v1/offers</code> or <code className="text-blue-600 dark:text-sky-400 font-mono">POST /api/v1/supermarkets/:id/offers</code>. Validates dates, calculates net discounts, and attaches supermarket foreign key.
            </p>

            <form onSubmit={handleCreateOffer} className="mt-6 space-y-4">
              {offerError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                  {offerError}
                </div>
              )}
              {offerSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  {offerSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Target Supermarket *
                  </label>
                  <select
                    id="select-offer-supermarket"
                    value={offerForm.supermarketId}
                    onChange={(e) => setOfferForm({ ...offerForm, supermarketId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {supermarkets.map((sm) => (
                      <option key={sm.id} value={sm.id}>
                        {sm.name} ({sm.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    X-API-Key Header (Optional Override)
                  </label>
                  <input
                    id="input-offer-api-key"
                    type="password"
                    placeholder="trsk_live_... (auto-authorized if omitted)"
                    value={offerForm.apiKey}
                    onChange={(e) => setOfferForm({ ...offerForm, apiKey: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Offer Title *
                </label>
                <input
                  id="input-offer-title"
                  type="text"
                  required
                  placeholder="e.g. 25% Off California Organic Strawberries"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  id="input-offer-description"
                  required
                  rows={2}
                  placeholder="Detailed description of the promotional offer, product highlights, and origin..."
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    id="select-offer-category"
                    value={offerForm.category}
                    onChange={(e) => setOfferForm({ ...offerForm, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="PRODUCE">Fresh Produce</option>
                    <option value="DAIRY">Dairy & Eggs</option>
                    <option value="BAKERY">Artisan Bakery</option>
                    <option value="GROCERIES">Pantry Groceries</option>
                    <option value="BEVERAGES">Beverages</option>
                    <option value="MEAT_SEAFOOD">Meat & Seafood</option>
                    <option value="HOUSEHOLD">Household</option>
                    <option value="SNACKS">Snacks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Discount Type *
                  </label>
                  <select
                    id="select-offer-type"
                    value={offerForm.discountType}
                    onChange={(e) => setOfferForm({ ...offerForm, discountType: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Flat Amount ($)</option>
                    <option value="BOGO">Buy 1 Get 1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Discount Value *
                  </label>
                  <input
                    id="input-offer-discount-val"
                    type="number"
                    step="0.01"
                    required
                    value={offerForm.discountValue}
                    onChange={(e) => setOfferForm({ ...offerForm, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Original Price ($)
                  </label>
                  <input
                    id="input-offer-price"
                    type="number"
                    step="0.01"
                    placeholder="9.99"
                    value={offerForm.originalPrice}
                    onChange={(e) => setOfferForm({ ...offerForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Coupon Code
                  </label>
                  <input
                    id="input-offer-coupon"
                    type="text"
                    placeholder="BERRY25"
                    value={offerForm.couponCode}
                    onChange={(e) => setOfferForm({ ...offerForm, couponCode: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Redemptions
                  </label>
                  <input
                    id="input-offer-quota"
                    type="number"
                    placeholder="250"
                    value={offerForm.maxRedemptions}
                    onChange={(e) => setOfferForm({ ...offerForm, maxRedemptions: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    id="input-offer-start"
                    type="date"
                    required
                    value={offerForm.startDate}
                    onChange={(e) => setOfferForm({ ...offerForm, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date *
                  </label>
                  <input
                    id="input-offer-end"
                    type="date"
                    required
                    value={offerForm.endDate}
                    onChange={(e) => setOfferForm({ ...offerForm, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                id="btn-submit-create-offer"
                type="submit"
                disabled={offerLoading}
                className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{offerLoading ? 'Publishing Offer...' : 'Publish Promotional Offer'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Registered Stores Directory */}
      {subTab === 'stores' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-x-auto">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Registered Supermarket Directory
          </h2>
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Supermarket</th>
                <th className="py-3 px-4">City / State</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Active Offers</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {supermarkets.map((sm) => (
                <tr key={sm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Store className="w-4 h-4 text-blue-500" />
                    <span>{sm.name}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {sm.city}, {sm.state}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">{sm.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-sky-300 font-bold">
                      {sm.activeOfferCount} deals
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                      {sm.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
