import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  ChevronRight, 
  Clock, 
  Star, 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  ShieldCheck, 
  Smartphone,
  Flame
} from 'lucide-react';
import { CATEGORIES, RESTAURANTS, COUPONS } from '../data/mockData';
import RestaurantCard from '../components/RestaurantCard';
import { useCart } from '../context/CartContext';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);
  const navigate = useNavigate();
  const { showToast } = useCart();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const promoBanners = [
    {
      title: "Flat 50% OFF",
      subtitle: "On your favorite Domino's, Biryani & more",
      code: "QUICK50",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
      bg: "from-[#FC8019] to-[#E96B0C]"
    },
    {
      title: "Mega Biryani Festival",
      subtitle: "Get up to ₹120 OFF on authentic dum biryani",
      code: "QUICK40",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
      bg: "from-[#E96B0C] to-[#C2410C]"
    },
    {
      title: "Free Delivery Everyday",
      subtitle: "No delivery charges on orders above ₹300",
      code: "FREEDEL",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
      bg: "from-amber-600 to-[#FC8019]"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/40 via-white to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-orange-100/80 text-[#FC8019] px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Superfast Food Delivery</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1C1C1C] tracking-tight leading-[1.12]">
                Your Favourite <br />
                Food, Delivered <br />
                <span className="text-[#FC8019] relative inline-block">
                  Fresh.
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C50 2 150 2 198 10" stroke="#FC8019" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#686B78] max-w-xl font-normal leading-relaxed">
                Discover the best restaurants and delicious food around you. Freshly prepared, hygienically packed, and delivered right to your doorstep.
              </p>

              {/* Search Bar matching reference */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl">
                <div className="relative flex items-center shadow-lg shadow-orange-500/10 rounded-2xl bg-white border border-gray-200 p-1.5 focus-within:border-[#FC8019] focus-within:ring-2 focus-within:ring-orange-100 transition">
                  <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for restaurants or dishes..."
                    className="w-full px-3 py-2.5 text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#FC8019] hover:bg-[#E96B0C] text-white p-3 rounded-xl transition shadow-md flex items-center justify-center shrink-0"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* CTA Explore Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/restaurants"
                  className="inline-flex items-center space-x-2 bg-[#FC8019] hover:bg-[#E96B0C] text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explore Restaurants</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 bg-gray-50 px-3.5 py-3 rounded-xl border border-gray-100">
                  <Clock className="w-4 h-4 text-[#FC8019]" />
                  <span>Average delivery: 28 mins</span>
                </div>
              </div>
            </div>

            {/* Right Hero Burger / Food Visual matching reference */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Warm decorative circular backdrop */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-orange-400/30 to-amber-200/40 blur-2xl" />
              <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#FC8019]/15" />

              {/* Main Food Photo */}
              <div className="relative z-10 w-72 h-72 sm:w-96 sm:h-96 rounded-full p-3 bg-white/70 shadow-2xl backdrop-blur-sm border-4 border-white flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80"
                  alt="QuickBite Gourmet Burger"
                  className="w-full h-full object-cover rounded-full shadow-inner transform hover:rotate-3 transition duration-500"
                />
              </div>

              {/* Floating Badge 1: 30 Mins */}
              <div className="absolute -bottom-4 -left-2 sm:left-4 z-20 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center space-x-3 animate-bounce-slow">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FC8019] flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">30 Mins</p>
                  <p className="text-[10px] text-gray-500">Fast Delivery</p>
                </div>
              </div>

              {/* Floating Badge 2: 4.8 Rating */}
              <div className="absolute top-6 -right-2 sm:right-2 z-20 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#267E3E] flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">4.8 Rating</p>
                  <p className="text-[10px] text-gray-500">Over 50k+ Orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C1C]">
                Popular Categories
              </h2>
              <p className="text-xs sm:text-sm text-[#686B78] mt-1">
                Explore hand-picked food by your favorite cravings
              </p>
            </div>
            <Link
              to="/restaurants"
              className="group inline-flex items-center space-x-1 text-sm font-bold text-[#FC8019] hover:text-[#E96B0C]"
            >
              <span>See all</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Categories Grid/Row */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-4 sm:gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/restaurants?cuisine=${category.id}`}
                className="group flex flex-col items-center text-center transition"
              >
                <div className="w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-orange-100 to-amber-50 group-hover:from-orange-400 group-hover:to-orange-500 transition duration-300 shadow-sm group-hover:shadow-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition duration-300"
                  />
                </div>
                <span className="mt-3 text-xs sm:text-sm font-bold text-gray-800 group-hover:text-[#FC8019] transition">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-12 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C1C]">
                Popular Restaurants
              </h2>
              <p className="text-xs sm:text-sm text-[#686B78] mt-1">
                Top rated dining spots with highest satisfaction in your city
              </p>
            </div>
            <Link
              to="/restaurants"
              className="group inline-flex items-center space-x-1 text-sm font-bold text-[#FC8019] hover:text-[#E96B0C]"
            >
              <span>See all</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Restaurant Cards Grid (Top 6 on home screen) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESTAURANTS.slice(0, 6).map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Offers Carousel Banner matching reference */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-[#FC8019] to-[#E96B0C] text-white">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
              {/* Left Promo text */}
              <div className="p-8 sm:p-12 md:col-span-7 space-y-4">
                <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Special Offer
                </span>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {promoBanners[activeBannerSlide].title}
                </h3>

                <p className="text-orange-100 text-sm sm:text-base max-w-md">
                  {promoBanners[activeBannerSlide].subtitle}
                </p>

                {/* Coupon Code Pill */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-xl px-4 py-2 font-mono font-bold text-lg">
                    <Tag className="w-4 h-4 text-white" />
                    <span>Use Code: {promoBanners[activeBannerSlide].code}</span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(promoBanners[activeBannerSlide].code)}
                    className="bg-white text-[#FC8019] hover:bg-orange-50 font-bold px-4 py-2 rounded-xl shadow-md transition flex items-center space-x-1.5 text-sm"
                  >
                    {copiedCode === promoBanners[activeBannerSlide].code ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Promo Image */}
              <div className="md:col-span-5 h-56 sm:h-72 md:h-full relative overflow-hidden">
                <img
                  src={promoBanners[activeBannerSlide].image}
                  alt="Special Offer"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#FC8019]/80 md:from-[#FC8019] via-transparent to-transparent" />
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="absolute bottom-4 left-8 flex items-center space-x-2 z-10">
              {promoBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBannerSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeBannerSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best-selling food preview strip */}
      <section className="py-12 bg-[#F8F8F8] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FC8019]">
                <Flame className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#1C1C1C]">
                Trending & Best-Selling Dishes
              </h2>
            </div>
            <Link
              to="/restaurants"
              className="text-sm font-bold text-[#FC8019] hover:underline"
            >
              Explore Full Menus
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Margherita Pizza',
                restaurant: "Domino's Pizza",
                price: 199,
                rating: 4.6,
                image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80',
                restId: 'dominos-pizza'
              },
              {
                name: 'McAloo Tikki Burger',
                restaurant: "McDonald's",
                price: 49,
                rating: 4.4,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
                restId: 'mcdonalds'
              },
              {
                name: 'Chicken Dum Biryani',
                restaurant: 'Biryani Blues',
                price: 299,
                rating: 4.7,
                image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
                restId: 'biryani-blues'
              },
              {
                name: 'Belgian Chocolate Tub',
                restaurant: 'Baskin Robbins',
                price: 320,
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80',
                restId: 'baskin-robbins'
              }
            ].map((dish, i) => (
              <Link
                key={i}
                to={`/restaurant/${dish.restId}`}
                className="bg-white rounded-2xl p-3 border border-gray-100 hover:shadow-lg transition group block"
              >
                <div className="h-40 w-full rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#FC8019] truncate">
                      {dish.name}
                    </h4>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      ★ {dish.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{dish.restaurant}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    <span className="font-extrabold text-gray-900 text-sm">₹{dish.price}</span>
                    <span className="text-xs font-bold text-[#FC8019]">Order Now →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
