import React, { useState } from 'react';
import { Tag, Copy, Check, Percent, Sparkles, Gift, ArrowRight } from 'lucide-react';
import { COUPONS, RESTAURANTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState(null);
  const { showToast } = useCart();

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#FC8019] via-[#E96B0C] to-amber-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>QuickBite Feast Festival</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Delicious Food, <br />Unbeatable Savings.
            </h1>
            <p className="text-orange-100 text-sm sm:text-base mt-3">
              Explore exclusive food delivery coupons, flat discounts, and partner restaurant deals curated just for you.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-10 translate-y-10">
            <Gift className="w-80 h-80" />
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center space-x-2">
            <Tag className="w-6 h-6 text-[#FC8019]" />
            <span>Available Promo Codes</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COUPONS.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-orange-100 text-[#FC8019] text-xs font-bold px-2.5 py-1 rounded-full">
                      {coupon.badge}
                    </span>
                    <span className="text-xs text-[#686B78] font-medium">
                      Min Order: ₹{coupon.minOrder}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FC8019] flex items-center justify-center font-bold">
                      <Percent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-mono text-xl font-black text-gray-900 tracking-wider">
                        {coupon.code}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-600">
                        {coupon.isFreeDelivery ? 'Free Delivery' : coupon.flatDiscount ? `Flat ₹${coupon.flatDiscount} OFF` : `${coupon.discountPercent}% OFF`}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {coupon.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">Valid on all items</span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="bg-[#FC8019] hover:bg-[#E96B0C] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm flex items-center space-x-1.5"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Restaurant Deals */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center space-x-2">
            <Gift className="w-6 h-6 text-[#FC8019]" />
            <span>Featured Restaurant Deals</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESTAURANTS.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center space-x-4"
              >
                <img
                  src={r.logo}
                  alt={r.name}
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{r.name}</h4>
                  <p className="text-xs font-bold text-[#FC8019] mt-0.5">{r.discountTag}</p>
                  <Link
                    to={`/restaurant/${r.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-gray-700 hover:text-[#FC8019] mt-2"
                  >
                    <span>View Menu</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
