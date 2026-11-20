import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  KeyRound, 
  Phone, 
  AlertCircle, 
  Compass, 
  Package, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { otpService } from '../services/otpService';
import TrackingMap from '../components/TrackingMap';
import { routingService } from '../services/routingService';

export default function DeliveryPartnerPage() {
  const { orders, updateOrderStatus, showToast } = useCart();
  const { currentUser, switchDemoRole } = useAuth();

  // Find active assigned delivery order
  const activeOrder = orders.find(o => o.status !== 'Delivered') || orders[0] || {
    id: 'QB84920193',
    status: 'Picked Up by Delivery Partner',
    restaurantName: "Domino's Pizza",
    restaurant_lat: 22.3175,
    restaurant_lng: 73.1680,
    delivery_lat: 22.3072,
    delivery_lng: 73.1812,
    totalAmount: 263,
    address: {
      name: 'Shalin Rathod',
      street: '123, Green Park',
      city: 'Vadodara',
      phone: '+91 98765 43210'
    }
  };

  // State for OTP input & verification
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // GPS Sharing State
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState([22.3120, 73.1740]);
  const [gpsError, setGpsError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Navigation Route
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState({ distanceKm: 2.4, durationMins: 14 });

  // Load Route
  useEffect(() => {
    let isMounted = true;
    async function loadRoute() {
      const res = await routingService.getRoute({
        startLat: activeOrder.restaurant_lat || 22.3175,
        startLng: activeOrder.restaurant_lng || 73.1680,
        endLat: activeOrder.delivery_lat || 22.3072,
        endLng: activeOrder.delivery_lng || 73.1812
      });
      if (isMounted && res.success) {
        setRouteCoords(res.coordinates);
        setRouteInfo({ distanceKm: res.distanceKm, durationMins: res.durationMins });
      }
    }
    loadRoute();
    return () => { isMounted = false; };
  }, [activeOrder]);

  // Check OTP status on mount
  useEffect(() => {
    if (activeOrder.id) {
      const status = otpService.getOtpStatus(activeOrder.id);
      setIsOtpSent(status.exists);
    }
  }, [activeOrder.id]);

  // Handle Real GPS Tracking via Geolocation API
  const handleToggleGps = () => {
    if (isGpsActive) {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      setIsGpsActive(false);
      showToast('Live GPS sharing stopped');
    } else {
      if (!('geolocation' in navigator)) {
        setGpsError('Geolocation API not supported by browser.');
        return;
      }

      showToast('Requesting GPS permission...');
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setGpsCoordinates([lat, lng]);
          setIsGpsActive(true);
          setGpsError(null);
          showToast(`GPS Active: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        },
        (err) => {
          setGpsError(`GPS Access: ${err.message}. Using simulated road coordinate.`);
          setIsGpsActive(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
      );
      setWatchId(id);
    }
  };

  // Start Delivery & Trigger Email OTP
  const handleStartDelivery = async () => {
    updateOrderStatus(activeOrder.id, 'Out for Delivery');
    const result = await otpService.generateAndSendOtp({
      orderId: activeOrder.id,
      customerName: activeOrder.address?.name || 'Customer',
      customerEmail: 'shalin@example.com' // customer's registered email
    });

    if (result.success) {
      setIsOtpSent(true);
      showToast('Delivery started! Customer OTP dispatched to email.');
    } else {
      showToast(result.message, 'error');
    }
  };

  // Verify Delivery OTP entered by partner
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.length !== 6) {
      setOtpError('Please enter the 6-digit delivery code from customer.');
      return;
    }

    setOtpError('');
    setIsVerifying(true);

    const result = await otpService.verifyOtp({
      orderId: activeOrder.id,
      enteredOtp,
      partnerId: currentUser?.customUserId || 'QB-RIDER-392011'
    });

    setIsVerifying(false);

    if (result.success) {
      setOtpSuccess('OTP Verified Successfully! Order Delivered.');
      updateOrderStatus(activeOrder.id, 'Delivered');
      showToast('Delivery completed! Confirmation email sent to customer.');
    } else {
      setOtpError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-16">
      {/* Top Bar for Rider */}
      <div className="bg-[#1C1C1C] text-white py-4 px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FC8019] flex items-center justify-center font-bold">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-lg text-white">QuickBite Rider Portal</h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  On Duty
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Partner: <strong>{currentUser?.fullName || 'Ramesh Kumar'}</strong> (TVS Ntorq • GJ-06-BQ-4912)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleGps}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                isGpsActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isGpsActive ? 'animate-spin' : ''}`} />
              <span>{isGpsActive ? 'Sharing Live GPS' : 'Enable Real GPS'}</span>
            </button>

            <button
              onClick={() => switchDemoRole('customer')}
              className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition flex items-center space-x-1"
            >
              <span>Switch to Customer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Assigned Delivery & OTP Verification (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Active Delivery Order Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase">Assigned Order</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activeOrder.status === 'Delivered'
                    ? 'bg-emerald-100 text-[#267E3E]'
                    : 'bg-orange-100 text-[#FC8019]'
                }`}>
                  {activeOrder.status}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-gray-900">#{activeOrder.id}</h2>
                <p className="text-sm font-bold text-[#FC8019] mt-0.5">{activeOrder.restaurantName}</p>
                <p className="text-xs text-gray-500 mt-1">Pickup outlet: Race Course Road, Vadodara</p>
              </div>

              {/* Destination info */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-gray-700 block">Deliver to:</span>
                    <p className="text-xs font-extrabold text-gray-900">{activeOrder.address?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activeOrder.address?.street}, {activeOrder.address?.city}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Customer Contact:</span>
                  <a
                    href={`tel:${activeOrder.address?.phone || '+919876543210'}`}
                    className="font-bold text-[#FC8019] hover:underline flex items-center space-x-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{activeOrder.address?.phone || '+91 98765 43210'}</span>
                  </a>
                </div>
              </div>

              {/* Actions based on stage */}
              <div className="pt-2 space-y-2">
                {activeOrder.status === 'Picked Up by Delivery Partner' && (
                  <button
                    onClick={handleStartDelivery}
                    className="w-full py-3.5 bg-[#FC8019] hover:bg-[#E96B0C] text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Start Delivery (Send Email OTP to Customer)</span>
                  </button>
                )}

                {activeOrder.status !== 'Out for Delivery' && activeOrder.status !== 'Delivered' && (
                  <button
                    onClick={() => updateOrderStatus(activeOrder.id, 'Picked Up by Delivery Partner')}
                    className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-sm transition"
                  >
                    Confirm Food Pickup from Restaurant
                  </button>
                )}
              </div>
            </div>

            {/* OTP Verification Box (Only active when Out for Delivery) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-md space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FC8019] flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                    Customer Delivery Verification OTP
                  </h3>
                  <p className="text-xs text-[#686B78]">
                    Ask the customer for the 6-digit code received on their email
                  </p>
                </div>
              </div>

              {otpSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-scale-up">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-emerald-800">{otpSuccess}</p>
                  <p className="text-xs text-emerald-600">You have completed this delivery successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  {otpError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Enter Customer's 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => { setEnteredOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                      placeholder="• • • • • •"
                      className="w-full py-3 px-4 text-center text-2xl font-mono font-black tracking-widest bg-gray-50 border-2 border-gray-200 focus:border-[#FC8019] rounded-2xl focus:outline-none focus:bg-white transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || enteredOtp.length !== 6 || activeOrder.status === 'Delivered'}
                    className="w-full py-3.5 bg-[#267E3E] hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                  >
                    {isVerifying ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify OTP & Mark Delivered</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-gray-400">
                    Maximum 5 incorrect attempts allowed per order.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Turn-by-Turn Map Navigation (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[600px]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                  Route to Destination
                </h3>
                <p className="text-xs text-[#686B78]">
                  Distance: <strong>{routeInfo.distanceKm} km</strong> • ETA: <strong>{routeInfo.durationMins} mins</strong>
                </p>
              </div>
              <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                OSRM Driving
              </span>
            </div>

            <div className="flex-1 w-full relative">
              <TrackingMap
                restaurantLocation={[activeOrder.restaurant_lat || 22.3175, activeOrder.restaurant_lng || 73.1680]}
                restaurantName={activeOrder.restaurantName}
                riderLocation={gpsCoordinates}
                riderName={currentUser?.fullName || 'Ramesh Kumar'}
                customerLocation={[activeOrder.delivery_lat || 22.3072, activeOrder.delivery_lng || 73.1812]}
                customerAddress={`${activeOrder.address?.street}, ${activeOrder.address?.city}`}
                routeCoordinates={routeCoords}
                isSimulated={!isGpsActive}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
