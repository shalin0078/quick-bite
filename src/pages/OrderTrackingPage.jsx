import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Bike, 
  ChevronRight, 
  RotateCcw, 
  Copy, 
  Check, 
  ShoppingBag,
  ChefHat,
  PackageCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, reorder, showToast } = useCart();
  
  const [copiedId, setCopiedId] = useState(false);
  const [isPastOrdersModalOpen, setIsPastOrdersModalOpen] = useState(false);

  // Find active order or fallback to the latest order in state
  const currentOrder = orders.find(o => o.id === orderId) || orders[0] || {
    id: 'QB12345678',
    createdAt: new Date().toISOString(),
    status: 'Restaurant Preparing',
    items: [
      {
        id: 'mcd-1',
        name: 'McAloo Tikki Burger',
        price: 49,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'dom-1',
        name: 'Margherita Pizza',
        price: 199,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80'
      }
    ],
    address: {
      name: 'Demo Customer',
      street: '123, Green Park',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390001',
      phone: '+91 90000 00000'
    },
    totalAmount: 263,
    rider: {
      name: 'Arjun Singh',
      phone: '+91 90000 11111',
      bikeNumber: 'GJ-06-BQ-4912',
      rating: 4.9
    },
    estimatedDeliveryMins: 24
  };

  const stages = [
    { key: 'Order Placed', label: 'Order Placed', desc: 'Received by kitchen', icon: PackageCheck },
    { key: 'Restaurant Preparing', label: 'Restaurant Preparing', desc: 'Fresh ingredients being cooked', icon: ChefHat },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider is on the way', icon: Bike },
    { key: 'Delivered', label: 'Delivered', desc: 'Enjoy your meal!', icon: CheckCircle2 },
  ];

  const currentStageIndex = stages.findIndex(s => s.key === currentOrder.status);
  const activeIndex = currentStageIndex === -1 ? 1 : currentStageIndex;

  const handleCopyOrderId = () => {
    navigator.clipboard?.writeText(`#${currentOrder.id}`);
    setCopiedId(true);
    showToast(`Order ID #${currentOrder.id} copied to clipboard!`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleAdvanceStage = () => {
    const nextIndex = (activeIndex + 1) % stages.length;
    const nextStatus = stages[nextIndex].key;
    updateOrderStatus(currentOrder.id, nextStatus);
    showToast(`Order status updated to: ${nextStatus}`);
  };

  const handleReorderClick = (idToReorder) => {
    const success = reorder(idToReorder);
    if (success) {
      navigate('/cart');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Success & Tracking Card matching reference Screen 6 */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 text-center relative overflow-hidden">
          {/* Green Checkmark Circle */}
          <div className="w-20 h-20 bg-emerald-100 text-[#267E3E] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/10 animate-bounce-short">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-sm sm:text-base text-[#686B78] mt-1.5 max-w-md mx-auto">
            Your order has been placed and is on its way. Relax while our partner restaurant prepares your fresh food.
          </p>

          {/* Order ID Tag */}
          <div className="mt-4 inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-800">
            <span className="text-[#686B78]">Order ID:</span>
            <span className="font-mono text-[#FC8019]">#{currentOrder.id}</span>
            <button
              onClick={handleCopyOrderId}
              className="p-1 hover:text-[#FC8019] text-gray-400 transition"
              title="Copy Order ID"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Animated Delivery Scooter / Rider Illustration */}
          <div className="my-8 flex justify-center items-center">
            <div className="relative p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 max-w-sm w-full flex items-center justify-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[#FC8019] text-white flex items-center justify-center shadow-md animate-soft-pulse shrink-0">
                <Bike className="w-8 h-8" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[#FC8019] uppercase tracking-wider">
                  Live Dispatch
                </span>
                <p className="font-extrabold text-gray-900 text-sm">
                  Arriving in ~{currentOrder.estimatedDeliveryMins || 25} mins
                </p>
                <p className="text-xs text-[#686B78]">Rider: Ramesh Kumar</p>
              </div>
            </div>
          </div>

          {/* Order Items Mini Summary matching Screen 6 */}
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 max-w-lg mx-auto text-left mb-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-xs font-bold text-gray-500 uppercase">Items Ordered</span>
              <span className="text-sm font-extrabold text-gray-900">
                ₹{currentOrder.totalAmount}
              </span>
            </div>

            <div className="divide-y divide-gray-100 mt-2">
              {currentOrder.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <span className="text-gray-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-800">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Details */}
          <div className="max-w-lg mx-auto p-4 rounded-2xl bg-orange-50/50 border border-orange-100 text-left flex items-start space-x-3 mb-10">
            <MapPin className="w-5 h-5 text-[#FC8019] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-gray-900 block">Delivery Address:</span>
              <p className="text-gray-600 mt-0.5">
                {currentOrder.address?.flat ? `${currentOrder.address.flat}, ` : ''}
                {currentOrder.address?.street}, {currentOrder.address?.city} - {currentOrder.address?.pincode}
              </p>
            </div>
          </div>

          {/* Interactive Order Stepper matching reference Screen 6 */}
          <div className="mb-10 max-w-2xl mx-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
              Live Order Status
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {stages.map((stage, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;
                const IconComponent = stage.icon;

                return (
                  <div key={stage.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#FC8019] text-white ring-4 ring-orange-200 shadow-lg scale-110'
                          : isPassed
                          ? 'bg-[#267E3E] text-white shadow'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <h4
                      className={`text-xs sm:text-sm font-extrabold mt-3 ${
                        isCurrent ? 'text-[#FC8019]' : isPassed ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {stage.label}
                    </h4>
                    <p className="text-[10px] text-[#686B78] mt-0.5 hidden sm:block">
                      {stage.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons matching reference Screen 6 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-100">
            {/* Live Simulation Trigger */}
            <button
              onClick={handleAdvanceStage}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#FC8019] hover:bg-[#E96B0C] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/20 transition flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate Next Stage ({stages[(activeIndex + 1) % stages.length].label})</span>
            </button>

            {/* View Past Orders Button */}
            <button
              onClick={() => setIsPastOrdersModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
            >
              <Clock className="w-4 h-4 text-[#FC8019]" />
              <span>View Past Orders ({orders.length})</span>
            </button>

            <Link
              to="/restaurants"
              className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition flex items-center justify-center space-x-1"
            >
              <span>Order More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Past Orders Drawer/Modal */}
      {isPastOrdersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden p-6 max-h-[85vh] flex flex-col animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-black text-xl text-gray-900">Your Past Orders</h3>
                <p className="text-xs text-[#686B78]">Saved automatically in QuickBite LocalStorage</p>
              </div>
              <button
                onClick={() => setIsPastOrdersModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold p-1"
              >
                Close ✕
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4 flex-1">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-bold text-sm text-gray-700">No previous orders recorded yet</p>
                  <p className="text-xs">Place an order to see it tracked here!</p>
                </div>
              ) : (
                orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-2xl border border-gray-200 hover:border-orange-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-gray-900">
                          #{o.id}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {o.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#686B78] mt-1">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs font-semibold text-gray-700 mt-1">
                        {o.items?.map(it => `${it.name} (${it.quantity})`).join(', ')}
                      </p>
                      <p className="text-sm font-extrabold text-[#FC8019] mt-1">
                        Total: ₹{o.totalAmount}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          setIsPastOrdersModalOpen(false);
                          navigate(`/order-tracking/${o.id}`);
                        }}
                        className="text-xs font-bold px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-700"
                      >
                        Track Status
                      </button>

                      <button
                        onClick={() => handleReorderClick(o.id)}
                        className="text-xs font-bold px-3 py-2 bg-[#FC8019] text-white rounded-xl hover:bg-[#E96B0C] shadow-sm flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
