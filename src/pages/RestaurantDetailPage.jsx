import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Bike, 
  Heart, 
  Share2, 
  Check, 
  Copy, 
  Info, 
  ShoppingBag,
  Sparkles,
  MapPin,
  Tag
} from 'lucide-react';
import { RESTAURANTS } from '../data/mockData';
import FoodItemCard from '../components/FoodItemCard';
import { useCart } from '../context/CartContext';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite, cartItems, totalCount, finalAmount, showToast } = useCart();

  const restaurant = RESTAURANTS.find(r => r.id === id) || RESTAURANTS[0];
  const isFavorite = favorites.includes(restaurant.id);

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'ratings' | 'info'
  const [selectedCategory, setSelectedCategory] = useState(restaurant.menuCategories[0] || 'Pizza');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${restaurant.name} on QuickBite`,
        text: `Order food from ${restaurant.name} on QuickBite with superfast delivery!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Restaurant link copied to clipboard!');
    }
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    showToast(`Code ${code} copied! Apply at checkout.`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filtered menu items
  const filteredMenu = useMemo(() => {
    if (!restaurant.menu) return [];
    if (!selectedCategory || selectedCategory === 'All') return restaurant.menu;
    return restaurant.menu.filter(dish => dish.category === selectedCategory);
  }, [restaurant, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-24">
      {/* Top Banner matching reference Screen 3 */}
      <div className="relative h-60 sm:h-72 w-full bg-gray-900 overflow-hidden">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

        {/* Back Button & Top Action Icons */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-800 hover:bg-white shadow-lg transition active:scale-90"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => toggleFavorite(restaurant.id)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-800 hover:bg-white shadow-lg transition active:scale-90"
              aria-label="Save to Favorites"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`}
              />
            </button>

            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-800 hover:bg-white shadow-lg transition active:scale-90"
              aria-label="Share Restaurant"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
        {/* Restaurant Header Card matching reference Screen 3 */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Circular Logo Avatar matching reference */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-white shrink-0">
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight truncate">
                {restaurant.name}
              </h1>
              {restaurant.isVegOnly && (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Pure Veg
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1 text-sm font-bold text-gray-900">
                <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span>{restaurant.rating}</span>
                <span className="text-xs text-[#686B78] font-normal">
                  ({restaurant.ratingCount} ratings)
                </span>
              </div>
            </div>

            {/* Delivery time, Cost for two, Free delivery badge */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 font-medium">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{restaurant.deliveryTime}</span>
              </div>

              <span>•</span>

              <div className="flex items-center space-x-1.5 font-bold text-gray-800">
                <span>₹{restaurant.costForTwo} for two</span>
              </div>

              {restaurant.freeDelivery && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1 text-xs font-bold text-[#267E3E] bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Bike className="w-3.5 h-3.5" />
                    <span>Free Delivery</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs: Menu, Ratings, Info */}
        <div className="mt-8 flex items-center space-x-8 border-b border-gray-200">
          {['menu', 'ratings', 'info'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold capitalize transition relative ${
                activeTab === tab
                  ? 'text-[#FC8019] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FC8019] after:rounded-full'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab === 'menu' ? 'Menu' : tab === 'ratings' ? 'Ratings' : 'Info'}
            </button>
          ))}
        </div>

        {/* Tab 1: Menu Section with Left Categories & Right Food Items matching reference Screen 3 */}
        {activeTab === 'menu' && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Menu Categories Navigation matching Screen 3 */}
              <div className="md:col-span-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm space-y-1 sticky top-28">
                {restaurant.menuCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-orange-50 text-[#FC8019] shadow-sm font-extrabold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Menu Food Cards matching Screen 3 */}
              <div className="md:col-span-9 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-gray-900 text-lg">
                    {selectedCategory} Dishes
                  </h3>
                  <span className="text-xs text-gray-400">
                    {filteredMenu.length} items
                  </span>
                </div>

                {filteredMenu.map((dish) => (
                  <FoodItemCard
                    key={dish.id}
                    dish={dish}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Promo Coupon Box matching reference Screen 3 */}
            <div className="mt-10 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 border border-orange-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-md text-[#FC8019] flex items-center justify-center font-bold shrink-0">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm sm:text-base">
                    Get 40% OFF up to ₹120
                  </h4>
                  <p className="text-xs text-[#686B78]">
                    Use Code: <span className="font-bold text-[#FC8019]">QUICK40</span> on orders above ₹149
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopyCoupon('QUICK40')}
                className="bg-white hover:bg-orange-50 text-[#FC8019] border border-[#FC8019] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-1.5 shrink-0"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Use Code: QUICK40</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Ratings */}
        {activeTab === 'ratings' && (
          <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-black text-gray-900">{restaurant.rating} ★</div>
              <p className="text-xs text-gray-500">Based on {restaurant.ratingCount} user ratings</p>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Kavita Patel', rating: 5, date: 'Yesterday', comment: 'Always hot and fresh! Pizza crust was super soft and garlic bread was bursting with cheese.' },
                { name: 'Rahul Joshi', rating: 5, date: '3 days ago', comment: 'Delivered in just 22 minutes! Outstanding packaging and authentic taste.' },
              ].map((rev, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">{rev.name}</span>
                    <span className="text-xs text-gray-400">{rev.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Info */}
        {activeTab === 'info' && (
          <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-gray-900 text-lg">Restaurant Information</h3>
            <p className="text-sm text-gray-600">{restaurant.address}</p>
            <p className="text-xs text-gray-400">Timings: 10:00 AM – 11:30 PM (Daily)</p>
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar (if items in cart) */}
      {totalCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#FC8019] text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-gray-900">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} in cart
                </p>
                <p className="text-xs text-[#686B78]">
                  Extra discount applicable at checkout
                </p>
              </div>
            </div>

            <Link
              to="/cart"
              className="bg-[#FC8019] hover:bg-[#E96B0C] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <span>View Cart & Checkout</span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono">
                ₹{finalAmount}
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
