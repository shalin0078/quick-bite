import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ShoppingBag, 
  Bike, 
  Sparkles,
  Percent
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { COUPONS } from '../data/mockData';

export default function CartPage() {
  const { 
    cartItems, 
    totalCount, 
    itemTotal, 
    discount, 
    deliveryFee, 
    platformFee, 
    finalAmount, 
    isFreeDeliveryQualified,
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const handleApply = (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    const result = applyCoupon(code);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const remainingForFreeDelivery = Math.max(0, 300 - itemTotal);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-gray-50 px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-orange-100 text-[#FC8019] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Your Cart is Empty</h2>
          <p className="text-sm text-[#686B78] mt-2">
            Looks like you haven't added anything to your cart yet. Explore popular restaurants and fill it with your favorite food!
          </p>
          <Link
            to="/restaurants"
            className="mt-6 inline-flex items-center space-x-2 bg-[#FC8019] hover:bg-[#E96B0C] text-white font-bold px-6 py-3 rounded-xl shadow-md transition"
          >
            <span>Browse Restaurants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items & Coupon matching reference Screen 4 */}
          <div className="lg:col-span-7 space-y-6">
            {/* Cart Header Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  Your Cart <span className="text-sm font-normal text-gray-500">({totalCount} {totalCount === 1 ? 'item' : 'items'})</span>
                </h1>
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline transition"
                >
                  Clear Cart
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                    {/* Item info */}
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                              item.veg ? 'border-emerald-600' : 'border-rose-600'
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.veg ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            />
                          </div>
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-xs text-[#686B78] mt-0.5 truncate">
                          {item.restaurantName}
                        </p>
                        <p className="text-sm font-extrabold text-gray-900 mt-1">
                          ₹{item.price}
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls & Trash */}
                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-gray-700 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-sm text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-[#FC8019] transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Code Section matching reference */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
                <Tag className="w-4 h-4 text-[#FC8019]" />
                <span>Apply Coupon</span>
              </h3>

              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Enter Coupon Code"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FC8019]/40 focus:border-[#FC8019] transition"
                  />
                </div>
                <button
                  onClick={() => handleApply()}
                  className="bg-[#FC8019] hover:bg-[#E96B0C] text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="text-xs font-semibold text-rose-500 mt-2">
                  {couponError}
                </p>
              )}

              {/* Coupon Applied banner */}
              {appliedCoupon && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-bold animate-fade-in">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Coupon Applied! You saved ₹{discount} with {appliedCoupon.code}
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-emerald-700 hover:text-rose-600"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Quick Available Coupon Chips */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-[#686B78] mb-2">Available Coupons for you:</p>
                <div className="flex flex-wrap gap-2">
                  {COUPONS.map((cp) => (
                    <button
                      key={cp.code}
                      onClick={() => handleApply(cp.code)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-mono font-bold transition flex items-center space-x-1 ${
                        appliedCoupon?.code === cp.code
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-orange-200 bg-orange-50/60 text-[#FC8019] hover:bg-orange-100'
                      }`}
                    >
                      <Percent className="w-3 h-3" />
                      <span>{cp.code}</span>
                      <span className="text-[10px] text-gray-500">
                        (Min ₹{cp.minOrder})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Free Delivery Banner matching reference Screen 4 */}
            <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 border border-orange-200 rounded-3xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-[#FC8019] shrink-0">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">
                    Free Delivery
                  </h4>
                  <p className="text-xs text-[#686B78]">
                    {isFreeDeliveryQualified
                      ? 'Congratulations! You unlocked Free Delivery on this order.'
                      : `Add ₹${remainingForFreeDelivery} more to enjoy Free Delivery.`}
                  </p>
                </div>
              </div>

              {/* Progress visual */}
              {!isFreeDeliveryQualified && (
                <div className="w-24 sm:w-32 hidden sm:block">
                  <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#FC8019] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (itemTotal / 300) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 block text-right mt-1">
                    ₹{itemTotal}/₹300
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Bill Details matching reference Screen 4 */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
            <h2 className="text-lg font-black text-gray-900 pb-4 border-b border-gray-100">
              Bill Details
            </h2>

            <div className="py-4 space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Item Total</span>
                <span className="font-bold text-gray-900">₹{itemTotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-[#267E3E] font-bold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span>Delivery Charges</span>
                  {deliveryFee === 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                      FREE
                    </span>
                  )}
                </div>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-[#267E3E]' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? '₹0' : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Platform Fee</span>
                <span className="font-bold text-gray-900">₹{platformFee}</span>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-base font-extrabold text-gray-900">
                <span>Total Amount</span>
                <span className="text-2xl text-[#FC8019]">₹{finalAmount}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="mt-6 w-full py-4 bg-[#FC8019] hover:bg-[#E96B0C] text-white font-black text-base rounded-2xl shadow-xl shadow-orange-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-[11px] text-center text-gray-400 mt-3">
              100% Safe & Secure Checkout with QuickBite Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
