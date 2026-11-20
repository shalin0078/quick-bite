import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Heart, Bike } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function RestaurantCard({ restaurant }) {
  const { favorites, toggleFavorite } = useCart();
  const isFavorite = favorites.includes(restaurant.id);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image Area */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <Link to={`/restaurant/${restaurant.id}`} className="block w-full h-full">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        </Link>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(restaurant.id);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-rose-500 hover:bg-white shadow-md transition transform active:scale-90"
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`}
          />
        </button>

        {/* Discount Tag on bottom of image */}
        {restaurant.discountTag && (
          <div className="absolute bottom-2.5 left-3 text-white font-extrabold text-xs sm:text-sm tracking-wide drop-shadow-md flex items-center space-x-1.5">
            <span className="bg-[#FC8019] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
              {restaurant.discountTag}
            </span>
          </div>
        )}

        {/* Promoted badge */}
        {restaurant.promoted && (
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded">
            Promoted
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <Link to={`/restaurant/${restaurant.id}`} className="block">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-base group-hover:text-[#FC8019] transition truncate">
              {restaurant.name}
            </h3>
            
            {/* Rating pill */}
            <div className="flex items-center space-x-1 bg-[#267E3E] text-white px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
              <Star className="w-3 h-3 fill-white" />
              <span>{restaurant.rating}</span>
            </div>
          </div>

          <p className="text-xs text-[#686B78] mt-1 truncate">
            {restaurant.cuisines.join(', ')}
          </p>

          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {restaurant.address}
          </p>
        </Link>

        {/* Meta Stats row */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-medium">{restaurant.deliveryTime}</span>
          </div>

          <span className="font-semibold text-gray-800">
            ₹{restaurant.costForTwo} for two
          </span>
        </div>

        {/* Free Delivery Tag */}
        {restaurant.freeDelivery && (
          <div className="mt-2 flex items-center space-x-1 text-[11px] font-bold text-[#267E3E]">
            <Bike className="w-3.5 h-3.5" />
            <span>Free Delivery</span>
          </div>
        )}
      </div>
    </div>
  );
}
