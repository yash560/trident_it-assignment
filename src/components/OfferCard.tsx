'use client';

import React, { useState } from 'react';
import { Tag, Calendar, Check, Copy, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { OfferWithSupermarket } from '@/lib/types';
import confetti from 'canvas-confetti';

interface OfferCardProps {
  offer: OfferWithSupermarket;
  onRedeem: (offerId: string) => Promise<void>;
  isRedeeming: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onRedeem, isRedeeming }) => {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!offer.couponCode) return;
    navigator.clipboard.writeText(offer.couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeemClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onRedeem(offer.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#2563eb', '#10b981', '#38bdf8', '#fbbf24'],
    });
  };

  const getDiscountBadge = () => {
    switch (offer.discountType) {
      case 'PERCENTAGE':
        return `${offer.discountValue}% OFF`;
      case 'FIXED_AMOUNT':
        return `$${offer.discountValue.toFixed(2)} OFF`;
      case 'BOGO':
        return 'BUY 1 GET 1';
      case 'BUNDLE':
        return 'BUNDLE DEAL';
      default:
        return 'SPECIAL OFFER';
    }
  };

  const formatEndDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isSoldOut = offer.maxRedemptions ? offer.currentRedemptions >= offer.maxRedemptions : false;

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-sky-500/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
      >
        {/* Top Image & Discount Pill */}
        <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

          {/* Discount Banner */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>{getDiscountBadge()}</span>
          </div>

          {/* Category Chip */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/20">
            {offer.category}
          </div>

          {/* Supermarket Banner at bottom of image */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center space-x-2 truncate">
              <span className="font-semibold truncate drop-shadow">{offer.supermarket.name}</span>
            </div>
            <span className="text-[11px] text-slate-200 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
              {offer.supermarket.city}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
              {offer.title}
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {offer.description}
            </p>
          </div>

          {/* Pricing & Expiry */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-baseline justify-between">
              <div>
                {offer.discountedPrice !== undefined ? (
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      ${offer.discountedPrice.toFixed(2)}
                    </span>
                    {offer.originalPrice !== undefined && (
                      <span className="text-xs text-slate-400 line-through">
                        ${offer.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm font-bold text-blue-600 dark:text-sky-400">
                    {getDiscountBadge()}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Exp: {formatEndDate(offer.endDate)}</span>
              </div>
            </div>

            {/* Quota Progress */}
            {offer.maxRedemptions && (
              <div className="mt-2.5">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <span>Capacity</span>
                  <span>
                    {offer.currentRedemptions} / {offer.maxRedemptions} claimed
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 dark:bg-sky-400 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (offer.currentRedemptions / offer.maxRedemptions) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-4 flex items-center space-x-2">
              {offer.couponCode ? (
                <button
                  id={`btn-copy-${offer.id}`}
                  onClick={handleCopyCode}
                  className="flex-1 py-2 px-3 rounded-xl border border-dashed border-blue-400 dark:border-sky-500/60 bg-blue-50/50 dark:bg-sky-950/30 text-blue-700 dark:text-sky-300 font-mono text-xs font-semibold flex items-center justify-center space-x-1.5 hover:bg-blue-100 dark:hover:bg-sky-950/60 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : offer.couponCode}</span>
                </button>
              ) : (
                <div className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium text-center">
                  Instant In-Store Deal
                </div>
              )}

              <button
                id={`btn-redeem-${offer.id}`}
                disabled={isSoldOut || isRedeeming}
                onClick={handleRedeemClick}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1 ${
                  isSoldOut
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{isSoldOut ? 'Claimed' : 'Redeem'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details & Terms Modal */}
      {showModal && (
        <div
          id="offer-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-blue-600 dark:text-sky-400">
                  {offer.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{offer.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Published by {offer.supermarket.name} • {offer.supermarket.city}
                </p>
              </div>
              <button
                id="btn-close-modal"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 h-48 rounded-xl overflow-hidden">
              <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover" />
            </div>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {offer.description}
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Terms & Conditions:</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {offer.termsAndConditions || 'Valid in-store at participating retail locations. Limit one coupon per transaction.'}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Valid: {formatEndDate(offer.startDate)} – {formatEndDate(offer.endDate)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={handleRedeemClick}
                  disabled={isSoldOut}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
                >
                  Apply & Redeem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
