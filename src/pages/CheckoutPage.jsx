import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Check, 
  MapPin, 
  Plus, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ArrowRight, 
  ShieldCheck, 
  X,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { emailService } from '../services/emailService';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cartItems, 
    itemTotal, 
    discount, 
    deliveryFee, 
    platformFee, 
    finalAmount, 
    appliedCoupon, 
    savedAddresses, 
    selectedAddressId, 
    setSelectedAddressId, 
    addAddress, 
    placeOrder,
    showToast 
  } = useCart();

  const { currentUser, isAuthenticated } = useAuth();

  // Authentication Enforcement Rule (Requirement 3.D)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-gray-50 px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 space-y-4">
          <div className="w-16 h-16 bg-orange-100 text-[#FC8019] rounded-full flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Please Sign In to Checkout</h2>
          <p className="text-xs sm:text-sm text-[#686B78]">
            QuickBite requires customer verification to guarantee safe delivery and email OTP dispatch.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              state={{ from: location }}
              className="w-full py-3.5 bg-[#FC8019] hover:bg-[#E96B0C] text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi' | 'card'
  const [upiId, setUpiId] = useState('shalin@okhdfcbank');
  const [cardData, setCardData] = useState({ number: '4532 •••• •••• 8821', name: currentUser?.fullName || 'Shalin Rathod', expiry: '08/28', cvv: '•••' });
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New address form state
  const [newAddrForm, setNewAddrForm] = useState({
    name: currentUser?.fullName || 'Shalin Rathod',
    phone: currentUser?.phone || '+91 98765 43210',
    type: 'Home',
    flat: '',
    street: '',
    city: 'Vadodara',
    pincode: '390001'
  });
  const [formError, setFormError] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md">
          <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mt-2">Add items to your cart before proceeding to checkout.</p>
          <Link
            to="/restaurants"
            className="mt-6 inline-block bg-[#FC8019] text-white font-bold px-6 py-2.5 rounded-xl shadow"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddrForm.flat.trim() || !newAddrForm.street.trim() || !newAddrForm.pincode.trim()) {
      setFormError('Please fill in house/flat, street, and pincode.');
      return;
    }
    const created = addAddress(newAddrForm);
    setSelectedAddressId(created.id);
    setIsNewAddressModalOpen(false);
    setFormError('');
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    setTimeout(async () => {
      const order = placeOrder({
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI (Demo)' : 'Card (Demo)'
      });

      // Send Order Confirmation Transactional Email
      await emailService.sendOrderConfirmationEmail({
        customerName: currentUser?.fullName || 'Customer',
        customerEmail: currentUser?.email || 'shalin@example.com',
        order
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // fallback
      }

      showToast('Order placed successfully! Confirmation email sent.');
      setIsSubmitting(false);
      navigate(`/live-tracking/${order.id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper Header matching reference Screen 5 */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            {/* Step line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-0" />
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-[#FC8019] -z-0 transition-all duration-500"
              style={{ width: '70%' }}
            />

            {[
              { id: 'cart', label: 'Cart', done: true },
              { id: 'address', label: 'Address', done: true },
              { id: 'payment', label: 'Payment', done: true },
              { id: 'review', label: 'Review', done: false },
            ].map((step, idx) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                    step.done
                      ? 'bg-[#FC8019] text-white ring-4 ring-orange-100 shadow-md'
                      : 'bg-white text-gray-400 border-2 border-gray-300'
                  }`}
                >
                  {step.done ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>
                <span
                  className={`text-xs mt-2 font-bold ${
                    step.done ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-[#FC8019]" />
                  <h2 className="text-lg font-black text-gray-900">Delivery Address</h2>
                </div>
                <button
                  onClick={() => setIsNewAddressModalOpen(true)}
                  className="text-xs font-bold text-[#FC8019] hover:bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Saved Addresses List */}
              <div className="mt-4 space-y-3">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                        isSelected
                          ? 'border-[#FC8019] bg-orange-50/40 shadow-sm ring-1 ring-[#FC8019]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="deliveryAddress"
                          checked={isSelected}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 w-4 h-4 text-[#FC8019] focus:ring-[#FC8019]"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-gray-900 text-sm">
                              {addr.name}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                              {addr.type || 'Home'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {addr.flat}, {addr.street}, {addr.city}, {addr.state || 'Gujarat'} - {addr.pincode}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Mobile: {addr.phone}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAddressId(addr.id);
                          showToast('Selected this address for delivery');
                        }}
                        className="text-xs font-bold text-[#FC8019] hover:underline shrink-0"
                      >
                        {isSelected ? 'Selected' : 'Deliver Here'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-[#FC8019]" />
                  <h2 className="text-lg font-black text-gray-900">Payment Method</h2>
                </div>
                <span className="text-[11px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  Demo Mode
                </span>
              </div>

              {/* Radio Payment Options */}
              <div className="mt-4 space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-[#FC8019] bg-orange-50/40 shadow-sm ring-1 ring-[#FC8019]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-[#FC8019] focus:ring-[#FC8019]"
                    />
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">Cash on Delivery</p>
                      <p className="text-xs text-[#686B78]">Pay cash or UPI on doorstep upon arrival</p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'upi'
                      ? 'border-[#FC8019] bg-orange-50/40 shadow-sm ring-1 ring-[#FC8019]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="w-4 h-4 text-[#FC8019] focus:ring-[#FC8019]"
                    />
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">UPI (Demo)</p>
                      <p className="text-xs text-[#686B78]">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-orange-200 pl-7">
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Mock UPI ID:
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full max-w-sm px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold"
                        placeholder="username@bank"
                      />
                    </div>
                  )}
                </label>

                <label
                  className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === 'card'
                      ? 'border-[#FC8019] bg-orange-50/40 shadow-sm ring-1 ring-[#FC8019]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-4 h-4 text-[#FC8019] focus:ring-[#FC8019]"
                    />
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">Card (Demo)</p>
                      <p className="text-xs text-[#686B78]">Credit, Debit, or Rupay card</p>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-orange-200 pl-7 space-y-2">
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full max-w-sm px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold"
                        placeholder="Card Number"
                      />
                      <div className="flex space-x-2 max-w-sm">
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono"
                          placeholder="MM/YY"
                        />
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono"
                          placeholder="CVV"
                        />
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center space-x-2 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Demo Platform:</strong> No real bank charges will occur. Order confirmation & OTP will be sent to <strong>{currentUser?.email}</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
            <h2 className="text-lg font-black text-gray-900 pb-4 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="py-4 space-y-3 divide-y divide-gray-50 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                    <div className="truncate max-w-[170px]">
                      <p className="font-bold text-gray-900 truncate text-xs sm:text-sm">{item.name}</p>
                      <span className="text-[11px] text-gray-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-gray-900 text-sm">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{itemTotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-[#267E3E] font-bold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Delivery Charges</span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-[#267E3E]' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
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

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="mt-6 w-full py-4 bg-[#FC8019] hover:bg-[#E96B0C] disabled:bg-orange-300 text-white font-black text-base rounded-2xl shadow-xl shadow-orange-500/25 transition transform active:scale-95 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Placing QuickBite Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center space-x-1.5 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Contactless delivery & hygiene verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      {isNewAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-black text-gray-900 text-lg">Add Delivery Address</h3>
              <button
                onClick={() => setIsNewAddressModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewAddress} className="space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddrForm.name}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newAddrForm.phone}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Flat / House / Building</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Block A, Sunshine Heights"
                  value={newAddrForm.flat}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, flat: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Street / Landmark / Area</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Inorbit Mall, Subhanpura"
                  value={newAddrForm.street}
                  onChange={(e) => setNewAddrForm({ ...newAddrForm, street: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddrForm.city}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newAddrForm.pincode}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewAddressModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FC8019] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#E96B0C]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
