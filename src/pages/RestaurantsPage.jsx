import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  Star, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { RESTAURANTS, CATEGORIES } from '../data/mockData';
import RestaurantCard from '../components/RestaurantCard';

export default function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCuisine = searchParams.get('cuisine') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCuisinePill, setSelectedCuisinePill] = useState(initialCuisine);
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters State
  const [selectedRating, setSelectedRating] = useState(null); // '4.5', '4.0', '3.5'
  const [vegFilter, setVegFilter] = useState({ veg: false, nonVeg: false });
  const [costFilter, setCostFilter] = useState({
    '100-300': false,
    '300-500': false,
    '500+': false
  });

  // Sync url param changes
  useEffect(() => {
    const cuisineParam = searchParams.get('cuisine');
    if (cuisineParam) {
      setSelectedCuisinePill(cuisineParam);
    }
    const queryParam = searchParams.get('search');
    if (queryParam !== null) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  const handleCuisinePillClick = (catId) => {
    setSelectedCuisinePill(catId);
    if (catId === 'all') {
      searchParams.delete('cuisine');
    } else {
      searchParams.set('cuisine', catId);
    }
    setSearchParams(searchParams);
  };

  const handleClearAll = () => {
    setSelectedRating(null);
    setVegFilter({ veg: false, nonVeg: false });
    setCostFilter({ '100-300': false, '300-500': false, '500+': false });
    setSelectedCuisinePill('all');
    setSearchQuery('');
    setSortBy('popular');
    setSearchParams({});
  };

  const hasActiveFilters = 
    selectedRating !== null || 
    vegFilter.veg || 
    vegFilter.nonVeg || 
    costFilter['100-300'] || 
    costFilter['300-500'] || 
    costFilter['500+'] || 
    selectedCuisinePill !== 'all' || 
    searchQuery.trim() !== '';

  // Filter & Sort Logic
  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS.filter((rest) => {
      // Search matching (restaurant name, cuisines, or menu dish names)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = rest.name.toLowerCase().includes(query);
        const matchesCuisine = rest.cuisines.some(c => c.toLowerCase().includes(query));
        const matchesDishes = rest.menu?.some(dish => dish.name.toLowerCase().includes(query));
        if (!matchesName && !matchesCuisine && !matchesDishes) {
          return false;
        }
      }

      // Cuisine pill
      if (selectedCuisinePill !== 'all') {
        const hasCategory = rest.categoryIds?.includes(selectedCuisinePill) ||
          rest.cuisines.some(c => c.toLowerCase().includes(selectedCuisinePill.toLowerCase()));
        if (!hasCategory) return false;
      }

      // Rating filter
      if (selectedRating !== null) {
        if (rest.rating < parseFloat(selectedRating)) return false;
      }

      // Diet / Cuisine filter
      if (vegFilter.veg && !vegFilter.nonVeg) {
        // Pure veg only
        if (!rest.isVegOnly && !rest.cuisines.includes('Healthy')) return false;
      }
      if (vegFilter.nonVeg && !vegFilter.veg) {
        // Non-veg available
        if (rest.isVegOnly) return false;
      }

      // Cost for two filter
      const activeCostKeys = Object.keys(costFilter).filter(k => costFilter[k]);
      if (activeCostKeys.length > 0) {
        if (!activeCostKeys.includes(rest.priceRange)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'deliveryTime') {
        return a.deliveryTimeMin - b.deliveryTimeMin;
      }
      if (sortBy === 'costLow') {
        return a.costForTwo - b.costForTwo;
      }
      if (sortBy === 'costHigh') {
        return b.costForTwo - a.costForTwo;
      }
      // 'popular' default
      return (b.promoted ? 1 : 0) - (a.promoted ? 1 : 0);
    });
  }, [searchQuery, selectedCuisinePill, selectedRating, vegFilter, costFilter, sortBy]);

  // Sidebar Filter Content component
  const FilterSidebarContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-extrabold text-gray-900 text-lg">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-[#FC8019] hover:underline flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Rating</h4>
        <div className="space-y-2">
          {['4.5', '4.0', '3.5'].map((r) => (
            <label
              key={r}
              className="flex items-center space-x-2.5 text-sm text-gray-700 cursor-pointer hover:text-gray-900 select-none"
            >
              <input
                type="radio"
                name="ratingFilter"
                checked={selectedRating === r}
                onChange={() => setSelectedRating(selectedRating === r ? null : r)}
                onClick={() => {
                  if (selectedRating === r) setSelectedRating(null);
                }}
                className="w-4 h-4 text-[#FC8019] border-gray-300 focus:ring-[#FC8019]"
              />
              <div className="flex items-center space-x-1">
                <span>{r}+</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Cuisine / Diet */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Cuisine Preference</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2.5 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={vegFilter.veg}
              onChange={(e) => setVegFilter(prev => ({ ...prev, veg: e.target.checked }))}
              className="w-4 h-4 rounded text-[#267E3E] border-gray-300 focus:ring-[#267E3E]"
            />
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              <span>Veg Only</span>
            </span>
          </label>

          <label className="flex items-center space-x-2.5 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={vegFilter.nonVeg}
              onChange={(e) => setVegFilter(prev => ({ ...prev, nonVeg: e.target.checked }))}
              className="w-4 h-4 rounded text-[#FC8019] border-gray-300 focus:ring-[#FC8019]"
            />
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
              <span>Non-Veg Available</span>
            </span>
          </label>
        </div>
      </div>

      {/* Cost for Two */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Cost for Two</h4>
        <div className="space-y-2">
          {[
            { id: '100-300', label: '₹100 - ₹300' },
            { id: '300-500', label: '₹300 - ₹500' },
            { id: '500+', label: '₹500+' },
          ].map((c) => (
            <label
              key={c.id}
              className="flex items-center space-x-2.5 text-sm text-gray-700 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={costFilter[c.id]}
                onChange={(e) =>
                  setCostFilter(prev => ({ ...prev, [c.id]: e.target.checked }))
                }
                className="w-4 h-4 rounded text-[#FC8019] border-gray-300 focus:ring-[#FC8019]"
              />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants or dishes..."
              className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC8019]/30 focus:border-[#FC8019] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Cuisines Pill Row & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          {/* Quick Cuisine Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => handleCuisinePillClick('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                selectedCuisinePill === 'all'
                  ? 'bg-[#FC8019] text-white shadow-md shadow-orange-500/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCuisinePillClick(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                  selectedCuisinePill === cat.id
                    ? 'bg-[#FC8019] text-white shadow-md shadow-orange-500/20'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right Actions: Mobile Filter Toggle & Sort Dropdown */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Mobile filter button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center space-x-1.5 px-3.5 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-800"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#FC8019]" />
              )}
            </button>

            {/* Sort Dropdown matching reference "Sort by: Popular v" */}
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700">
              <span className="text-[#686B78] mr-1.5">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer pr-4"
              >
                <option value="popular">Popular</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="deliveryTime">Delivery Time (Fastest)</option>
                <option value="costLow">Cost: Low to High</option>
                <option value="costHigh">Cost: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Split: Sidebar + Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8">
          {/* Left Desktop Sidebar Filters */}
          <aside className="hidden md:block md:col-span-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-28">
            <FilterSidebarContent />
          </aside>

          {/* Right Restaurant Cards Grid */}
          <main className="md:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-gray-900">
                Restaurants delivering in {searchParams.get('city') || 'your area'}
              </h2>
              <span className="text-xs font-semibold text-[#686B78]">
                Showing {filteredRestaurants.length} restaurants
              </span>
            </div>

            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8">
                <div className="w-16 h-16 bg-orange-100 text-[#FC8019] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No restaurants match your filters</h3>
                <p className="text-sm text-[#686B78] mt-1 max-w-sm mx-auto">
                  Try adjusting your search keywords, rating, or cuisine preferences to discover delicious food.
                </p>
                <button
                  onClick={handleClearAll}
                  className="mt-5 bg-[#FC8019] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:bg-[#E96B0C] transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Sheet Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-lg text-gray-900">Filter Restaurants</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebarContent />

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-3">
              <button
                onClick={handleClearAll}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#FC8019] text-white rounded-xl font-bold text-sm shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
