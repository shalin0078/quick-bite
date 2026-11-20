import React from 'react';
import { Plus, Minus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FoodItemCard({ dish, restaurant }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartItem = cartItems.find(item => item.id === dish.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-orange-100 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4">
      {/* Left Details */}
      <div className="flex-1 pr-2">
        {/* Veg / Non-Veg Badge */}
        <div className="flex items-center space-x-2 mb-1.5">
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
              dish.veg
                ? 'border-emerald-600 bg-white'
                : 'border-rose-600 bg-white'
            }`}
            title={dish.veg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                dish.veg ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
          </div>

          {dish.bestseller && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
              Bestseller
            </span>
          )}
        </div>

        {/* Dish Name */}
        <h4 className="font-bold text-gray-900 text-base leading-snug">
          {dish.name}
        </h4>

        {/* Price */}
        <div className="flex items-center space-x-2 mt-1">
          <span className="font-bold text-gray-900 text-base">₹{dish.price}</span>
          {dish.rating && (
            <div className="flex items-center text-xs text-amber-500 font-semibold space-x-1">
              <Star className="w-3 h-3 fill-amber-500" />
              <span>{dish.rating}</span>
              {dish.ratingCount && (
                <span className="text-gray-400">({dish.ratingCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#686B78] mt-2 line-clamp-2 leading-relaxed">
          {dish.description}
        </p>
      </div>

      {/* Right Dish Thumbnail & Add Button */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="w-28 h-24 sm:w-32 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shadow-inner">
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Floating Add / Quantity Stepper Button */}
        <div className="-mt-4 z-10">
          {quantity === 0 ? (
            <button
              onClick={() => addToCart(dish, restaurant)}
              className="bg-white hover:bg-orange-50 text-[#FC8019] border-2 border-[#FC8019] font-bold text-xs sm:text-sm px-6 py-1.5 rounded-xl shadow-md transition transform active:scale-95 flex items-center space-x-1 uppercase tracking-wider"
            >
              <span>Add</span>
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : (
            <div className="bg-[#FC8019] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center space-x-3 px-2 py-1.5 transition">
              <button
                onClick={() => updateQuantity(dish.id, -1)}
                className="w-5 h-5 rounded hover:bg-white/20 flex items-center justify-center transition active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <span className="min-w-[16px] text-center font-extrabold text-sm">
                {quantity}
              </span>

              <button
                onClick={() => updateQuantity(dish.id, 1)}
                className="w-5 h-5 rounded hover:bg-white/20 flex items-center justify-center transition active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
