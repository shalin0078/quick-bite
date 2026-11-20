import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Bike, 
  RotateCcw, 
  Copy, 
  Check, 
  ChefHat, 
  PackageCheck, 
  Sparkles, 
  Mail, 
  KeyRound, 
  ArrowLeft,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Play,
  Pause,
  FastForward,
  Volume2,
  VolumeX,
  ExternalLink,
  CheckCheck,
  Star,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import TrackingMap from '../components/TrackingMap';
import { routingService } from '../services/routingService';
import { otpService } from '../services/otpService';
import { emailService } from '../services/emailService';
import { soundService } from '../services/soundService';
import EmailInboxModal from '../components/EmailInboxModal';

// 7-Stage Delivery Lifecycle per requirement
const TIMELINE_STAGES = [
  { key: 'Order Placed', label: 'Order Placed', desc: 'Received by kitchen', step: 1, icon: PackageCheck },
  { key: 'Restaurant Confirmed', label: 'Restaurant Confirmed', desc: 'Order accepted by kitchen', step: 2, icon: CheckCircle2 },
  { key: 'Preparing Your Food', label: 'Preparing Your Food', desc: 'Fresh ingredients being cooked', step: 3, icon: ChefHat },
  { key: 'Ready for Pickup', label: 'Ready for Pickup', desc: 'Packed and sealed for hygiene', step: 4, icon: ShieldCheck },
  { key: 'Picked Up', label: 'Picked Up', desc: 'Handed over to delivery partner', step: 5, icon: Bike },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider en route to your doorstep', step: 6, icon: Navigation },
  { key: 'Delivered', label: 'Delivered', desc: 'Confirmed with customer email OTP', step: 7, icon: Sparkles },
];

function normalizeStageIndex(status) {
  if (!status) return 0;
  if (status === 'Picked Up by Delivery Partner') return 4;
  if (status === 'Restaurant Preparing') return 2;
  const idx = TIMELINE_STAGES.findIndex(s => s.key.toLowerCase() === status.toLowerCase());
  return idx === -1 ? 0 : idx;
}

export default function LiveTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, showToast } = useCart();
  const { currentUser } = useAuth();

  // Find target order or fallback to first order or demo order
  const matchedOrder = orders.find(o => o.id === orderId) || orders[0];
  const order = useMemo(() => matchedOrder || {
    id: orderId || 'QB84920193',
    createdAt: new Date().toISOString(),
    status: 'Order Placed',
    restaurantName: "Domino's Pizza",
    restaurant_lat: 22.3175,
    restaurant_lng: 73.1680,
    delivery_lat: 22.3072,
    delivery_lng: 73.1812,
    totalAmount: 263,
    items: [
      { name: 'McAloo Tikki Burger', quantity: 1, price: 49 },
      { name: 'Margherita Pizza', quantity: 1, price: 199 }
    ],
    address: {
      name: 'Shalin Rathod',
      street: '123, Green Park',
      city: 'Vadodara',
      pincode: '390001',
      phone: '+91 98765 43210'
    },
    rider: {
      name: 'Ramesh Kumar',
      phone: '+91 98250 12345',
      bikeNumber: 'GJ-06-BQ-4912',
      rating: 4.9
    }
  }, [matchedOrder, orderId]);

  // Primary reactive status state
  const [currentStatus, setCurrentStatus] = useState(() => order.status || 'Order Placed');

  // Sync when order status from CartContext changes
  useEffect(() => {
    if (order.status && order.status !== currentStatus) {
      setCurrentStatus(order.status);
    }
  }, [order.status]);

  // Active stage index in 0..6
  const activeStageIdx = normalizeStageIndex(currentStatus);

  // General States
  const [copiedId, setCopiedId] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundService.isMuted);

  // Simulation & Automation Controls
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [simSpeed, setSimSpeed] = useState(3); // 1 = Realtime, 3 = Fast, 10 = Turbo
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState({ distanceKm: 2.4, durationMins: 14 });
  const [riderLocation, setRiderLocation] = useState([order.restaurant_lat || 22.3175, order.restaurant_lng || 73.1680]);
  const [simIndex, setSimIndex] = useState(0);
  const [riderSpeed, setRiderSpeed] = useState(28);

  // Doorstep Handover & OTP states
  const [doorstepOtp, setDoorstepOtp] = useState('');
  const [doorstepOtpError, setDoorstepOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [hasTriggeredDoorstepChime, setHasTriggeredDoorstepChime] = useState(false);

  // Timestamps for fulfilled stages
  const [stageTimestamps, setStageTimestamps] = useState(() => {
    const now = new Date();
    const formatTime = (offsetMins) => {
      const d = new Date(now.getTime() - offsetMins * 60000);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return {
      0: formatTime(12),
      1: formatTime(10),
      2: formatTime(8),
      3: formatTime(5),
      4: formatTime(3),
      5: formatTime(1),
      6: formatTime(0),
    };
  });

  // 1. Fetch OSRM Route Geometry
  useEffect(() => {
    let isMounted = true;
    async function loadRoute() {
      const startLat = order.restaurant_lat || 22.3175;
      const startLng = order.restaurant_lng || 73.1680;
      const endLat = order.delivery_lat || 22.3072;
      const endLng = order.delivery_lng || 73.1812;

      const res = await routingService.getRoute({ startLat, startLng, endLat, endLng });
      if (isMounted && res.success) {
        setRouteCoords(res.coordinates);
        setRouteInfo({ distanceKm: res.distanceKm, durationMins: res.durationMins });
        
        // If order is in kitchen stages (0..4), rider sits at restaurant
        if (activeStageIdx < 5) {
          setRiderLocation([startLat, startLng]);
          setSimIndex(0);
        } else if (activeStageIdx === 6) {
          // Delivered
          setRiderLocation(res.coordinates[res.coordinates.length - 1]);
          setSimIndex(res.coordinates.length - 1);
          setRouteInfo({ distanceKm: 0, durationMins: 0 });
          setRiderSpeed(0);
        }
      }
    }
    loadRoute();
    return () => { isMounted = false; };
  }, [order, activeStageIdx]);

  // 2. Real-Time Auto-Progression of Kitchen Stages (Stage 0 -> Stage 5)
  useEffect(() => {
    if (!isAutoPlay || currentStatus === 'Delivered') return;

    // Only auto-advance kitchen stages (0..4)
    if (activeStageIdx < 5) {
      // Base delay per kitchen stage: 6000ms / speed (e.g. 2000ms at 3x, 600ms at 10x)
      const stageDelay = Math.max(700, Math.round(6000 / simSpeed));
      const timer = setTimeout(() => {
        const nextIdx = activeStageIdx + 1;
        const nextStatus = TIMELINE_STAGES[nextIdx].key;
        
        setCurrentStatus(nextStatus);
        updateOrderStatus(order.id, nextStatus);

        // Record timestamp
        setStageTimestamps(prev => ({
          ...prev,
          [nextIdx]: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        soundService.playStepChime();
        showToast(`Status updated: ${TIMELINE_STAGES[nextIdx].label}`);

        // If transitioning to Stage 5 (Picked Up) -> queue Out for Delivery
        if (nextIdx === 5) {
          setTimeout(() => {
            handleTransitionToOutForDelivery();
          }, Math.max(400, Math.round(1200 / simSpeed)));
        }
      }, stageDelay);

      return () => clearTimeout(timer);
    }
  }, [isAutoPlay, activeStageIdx, simSpeed, order.id, currentStatus]);

  // Helper to trigger Out for Delivery and Email OTP
  const handleTransitionToOutForDelivery = async () => {
    setCurrentStatus('Out for Delivery');
    updateOrderStatus(order.id, 'Out for Delivery');
    soundService.playStepChime();
    
    // Generate and send OTP to customer email
    await otpService.generateAndSendOtp({
      orderId: order.id,
      customerName: order.address?.name || currentUser?.fullName || 'Customer',
      customerEmail: currentUser?.email || 'shalin@example.com'
    });

    showToast('🛵 Rider Out for Delivery! 6-digit OTP sent to registered email.');
  };

  // 3. Smooth Scooter Movement along Route during Stage 5 ("Out for Delivery")
  useEffect(() => {
    if (currentStatus !== 'Out for Delivery' || routeCoords.length === 0 || !isAutoPlay) return;

    // Travel tick interval based on speed: 1200ms at 1x, 400ms at 3x, 100ms at 10x
    const tickInterval = Math.max(90, Math.round(1200 / simSpeed));

    const interval = setInterval(() => {
      setSimIndex((prev) => {
        const next = prev + 1;
        if (next >= routeCoords.length) {
          // Reached Doorstep!
          const dest = routeCoords[routeCoords.length - 1];
          setRiderLocation(dest);
          setRouteInfo({ distanceKm: 0, durationMins: 0 });
          setRiderSpeed(0);

          if (!hasTriggeredDoorstepChime) {
            soundService.playDoorstepChime();
            setHasTriggeredDoorstepChime(true);
            showToast('🛵 Rider has arrived at your doorstep! Share your Email OTP to receive food.');
          }

          return routeCoords.length - 1;
        }

        // Advance to next coordinate along road
        setRiderLocation(routeCoords[next]);

        // Fluctuate rider speed realistically (24..34 km/h)
        const randomizedSpeed = 24 + Math.floor(Math.sin(next) * 8 + 5);
        setRiderSpeed(randomizedSpeed);

        // Update remaining distance and ETA duration
        const remainingRatio = 1 - (next / routeCoords.length);
        const remDistance = (2.4 * remainingRatio).toFixed(1);
        const remMins = Math.max(1, Math.round(14 * remainingRatio));
        setRouteInfo({ distanceKm: parseFloat(remDistance), durationMins: remMins });

        return next;
      });
    }, tickInterval);

    return () => clearInterval(interval);
  }, [currentStatus, routeCoords, isAutoPlay, simSpeed, hasTriggeredDoorstepChime]);

  // Ensure OTP exists when order is Out for Delivery
  useEffect(() => {
    if (currentStatus === 'Out for Delivery') {
      const status = otpService.getOtpStatus(order.id);
      if (!status.exists) {
        otpService.generateAndSendOtp({
          orderId: order.id,
          customerName: order.address?.name || currentUser?.fullName || 'Customer',
          customerEmail: currentUser?.email || 'shalin@example.com'
        });
      }
    }
  }, [currentStatus, order.id, order.address, currentUser]);

  // Handle Doorstep OTP Verification
  const handleVerifyDoorstepOtp = async (codeToVerify) => {
    const code = codeToVerify || doorstepOtp;
    if (!code || code.trim().length !== 6) {
      setDoorstepOtpError('Please enter the 6-digit code sent to your registered email.');
      return;
    }

    setIsVerifyingOtp(true);
    setDoorstepOtpError('');

    const result = await otpService.verifyOtp({
      orderId: order.id,
      enteredOtp: code.trim()
    });

    setIsVerifyingOtp(false);

    if (result.success) {
      // Mark as Delivered!
      setCurrentStatus('Delivered');
      updateOrderStatus(order.id, 'Delivered');

      setStageTimestamps(prev => ({
        ...prev,
        6: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      soundService.playDeliveredChime();

      // Confetti burst!
      try {
        confetti({
          particleCount: 160,
          spread: 85,
          origin: { y: 0.6 }
        });
      } catch {
        // fallback
      }

      // Send delivery success confirmation email
      await emailService.sendDeliverySuccessEmail({
        customerName: order.address?.name || currentUser?.fullName || 'Customer',
        customerEmail: currentUser?.email || 'shalin@example.com',
        orderId: order.id
      });

      showToast('🎉 Delivery verified successfully! Enjoy your fresh hot meal.');
    } else {
      setDoorstepOtpError(result.message);
      showToast(result.message, 'error');
    }
  };

  // Jump or advance stage manually
  const handleJumpToStage = (targetIdx) => {
    const targetStatus = TIMELINE_STAGES[targetIdx].key;
    setCurrentStatus(targetStatus);
    updateOrderStatus(order.id, targetStatus);
    soundService.playStepChime();

    // If jumping to Out for Delivery or later
    if (targetIdx >= 5 && routeCoords.length > 0) {
      otpService.generateAndSendOtp({
        orderId: order.id,
        customerName: order.address?.name || currentUser?.fullName || 'Customer',
        customerEmail: currentUser?.email || 'shalin@example.com'
      });

      if (targetIdx === 6) {
        // Delivered
        setRiderLocation(routeCoords[routeCoords.length - 1]);
        setSimIndex(routeCoords.length - 1);
        setRouteInfo({ distanceKm: 0, durationMins: 0 });
        setRiderSpeed(0);

        try {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        } catch { /* ignore */ }
      } else {
        // Midway through route
        const mid = Math.floor(routeCoords.length / 2);
        setRiderLocation(routeCoords[mid]);
        setSimIndex(mid);
        setRouteInfo({ distanceKm: 1.2, durationMins: 6 });
        setRiderSpeed(28);
      }
    } else {
      // In kitchen
      setRiderLocation([order.restaurant_lat || 22.3175, order.restaurant_lng || 73.1680]);
      setSimIndex(0);
      setRouteInfo({ distanceKm: 2.4, durationMins: 14 });
      setRiderSpeed(0);
    }

    setStageTimestamps(prev => ({
      ...prev,
      [targetIdx]: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    showToast(`Jumped to: ${TIMELINE_STAGES[targetIdx].label}`);
  };

  // Reset entire simulation to Stage 0
  const handleResetSimulation = () => {
    setCurrentStatus('Order Placed');
    updateOrderStatus(order.id, 'Order Placed');
    setSimIndex(0);
    if (routeCoords.length > 0) {
      setRiderLocation(routeCoords[0]);
    }
    setRouteInfo({ distanceKm: 2.4, durationMins: 14 });
    setRiderSpeed(0);
    setDoorstepOtp('');
    setDoorstepOtpError('');
    setHasTriggeredDoorstepChime(false);
    setIsAutoPlay(true);
    soundService.playStepChime();
    showToast('Simulation reset to Stage 1: Order Placed');
  };

  const handleCopyId = () => {
    navigator.clipboard?.writeText(`#${order.id}`);
    setCopiedId(true);
    showToast(`Order ID #${order.id} copied!`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleAutoFillOtp = () => {
    const emails = emailService.getSentEmails();
    const found = emails.find(e => e.type === 'delivery_otp' && e.metadata?.orderId === order.id);
    if (found && found.metadata?.otpCode) {
      setDoorstepOtp(found.metadata.otpCode);
      showToast(`Code ${found.metadata.otpCode} auto-filled from email!`);
    } else {
      const anyOtp = emails.find(e => e.type === 'delivery_otp');
      if (anyOtp && anyOtp.metadata?.otpCode) {
        setDoorstepOtp(anyOtp.metadata.otpCode);
        showToast(`Code ${anyOtp.metadata.otpCode} auto-filled from email!`);
      } else {
        showToast('Click "Open Email Inbox" to view your 6-digit verification code.', 'info');
      }
    }
  };

  const isAtDoorstep = (currentStatus === 'Out for Delivery' && (simIndex >= routeCoords.length - 2 || routeInfo.distanceKm <= 0.3) && routeCoords.length > 0) || currentStatus === 'Delivered';

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-16">
      {/* 1. TOP HEADER BAR */}
      <div className="bg-white border-b border-gray-100 py-3.5 px-4 sm:px-8 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => navigate('/restaurants')}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  Quick<span className="text-[#FC8019]">Bite</span> Live Tracking
                </span>
                <span className="bg-orange-100 text-[#FC8019] text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                  #{order.id}
                </span>
                <button onClick={handleCopyId} className="text-gray-400 hover:text-gray-700" title="Copy ID">
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-[#686B78] mt-0.5">
                From <strong>{order.restaurantName}</strong> to {order.address?.street}, {order.address?.city}
              </p>
            </div>
          </div>

          {/* SIMULATION CONTROLS */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Auto Play / Pause Toggle */}
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border shadow-sm ${
                isAutoPlay 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlay ? 'Auto-Progress: ON' : 'Auto-Progress: PAUSED'}</span>
            </button>

            {/* Speed Selector */}
            <div className="bg-gray-100 p-1 rounded-xl flex items-center space-x-1 text-xs font-bold text-gray-600">
              <span className="text-[10px] text-gray-400 px-1 uppercase">Speed:</span>
              {[
                { val: 1, label: '1x' },
                { val: 3, label: '3x Fast' },
                { val: 10, label: '10x Turbo' }
              ].map(s => (
                <button
                  key={s.val}
                  onClick={() => setSimSpeed(s.val)}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    simSpeed === s.val ? 'bg-white text-[#FC8019] shadow-sm font-black' : 'hover:text-gray-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Reset Sim */}
            <button
              onClick={handleResetSimulation}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-xl transition"
              title="Reset to Stage 1: Order Placed"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const muted = soundService.toggleMute();
                setIsMuted(muted);
                showToast(muted ? 'Sound Muted' : 'Sound Enabled');
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-xl transition"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            {/* Check Email OTP Inbox Button */}
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="bg-[#FC8019] hover:bg-[#E96B0C] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-md flex items-center space-x-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>View OTP Email</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Map & ETA Telemetry (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Interactive Leaflet Map Container */}
            <div className="bg-white p-3 sm:p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[520px]">
              <TrackingMap
                restaurantLocation={[order.restaurant_lat || 22.3175, order.restaurant_lng || 73.1680]}
                restaurantName={order.restaurantName}
                riderLocation={riderLocation}
                riderName={order.rider?.name || 'Ramesh Kumar'}
                riderSpeed={riderSpeed}
                customerLocation={[order.delivery_lat || 22.3072, order.delivery_lng || 73.1812]}
                customerAddress={`${order.address?.street}, ${order.address?.city}`}
                routeCoordinates={routeCoords}
                currentRouteIndex={simIndex}
                orderStatus={currentStatus}
                isSimulated={true}
              />
            </div>

            {/* Dynamic ETA, Speed & Distance Banner */}
            <div className={`border rounded-3xl p-5 shadow-sm transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
              currentStatus === 'Delivered'
                ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border-emerald-200'
                : isAtDoorstep
                ? 'bg-gradient-to-r from-orange-100 via-amber-100 to-orange-200 border-orange-300 animate-pulse'
                : 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 border-orange-200'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center font-bold shadow-md shrink-0 ${
                  currentStatus === 'Delivered'
                    ? 'bg-[#267E3E]'
                    : isAtDoorstep
                    ? 'bg-[#FC8019] animate-bounce'
                    : 'bg-[#FC8019]'
                }`}>
                  {currentStatus === 'Delivered' ? (
                    <Award className="w-8 h-8" />
                  ) : isAtDoorstep ? (
                    <KeyRound className="w-8 h-8" />
                  ) : (
                    <Bike className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <span className={`text-xs font-black uppercase tracking-wider ${
                    currentStatus === 'Delivered' ? 'text-[#267E3E]' : 'text-[#FC8019]'
                  }`}>
                    {currentStatus === 'Delivered'
                      ? 'Delivered Successfully'
                      : isAtDoorstep
                      ? 'Rider At Doorstep'
                      : 'Live Delivery Status'}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
                    {currentStatus === 'Delivered'
                      ? 'Package Handed Over to Customer 🎉'
                      : isAtDoorstep
                      ? '🛵 Your Rider has arrived at your doorstep!'
                      : activeStageIdx < 5
                      ? `${TIMELINE_STAGES[activeStageIdx].label} (In Kitchen)`
                      : `Arriving in approximately ${routeInfo.durationMins} minutes`}
                  </h3>

                  <p className="text-xs text-[#686B78] mt-0.5 font-medium">
                    {currentStatus === 'Delivered'
                      ? 'Order completed and verified via email OTP'
                      : isAtDoorstep
                      ? 'Please share the 6-digit OTP code to complete delivery'
                      : activeStageIdx < 5
                      ? 'Kitchen preparing order; rider assigned and waiting for pickup'
                      : `${routeInfo.distanceKm} km remaining from your doorstep • Live speed: ${riderSpeed} km/h`}
                  </p>
                </div>
              </div>

              {/* Status Pill Badge */}
              <div className="text-center sm:text-right shrink-0">
                <span className="inline-block bg-white text-gray-800 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-sm border border-gray-200">
                  ⚡ OSRM Dynamic Routing
                </span>
              </div>
            </div>

            {/* DOORSTEP HANDOVER & INLINE OTP VERIFICATION CARD */}
            {isAtDoorstep && currentStatus !== 'Delivered' && (
              <div className="bg-white rounded-3xl p-6 border-2 border-[#FC8019] shadow-xl relative overflow-hidden animate-fade-in">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FC8019] flex items-center justify-center shrink-0 shadow-inner">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-black text-gray-900">
                        Doorstep Delivery Handover
                      </h3>
                      <span className="bg-red-100 text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                        Action Required
                      </span>
                    </div>

                    <p className="text-xs text-[#686B78] mt-1 leading-relaxed">
                      Your delivery partner is at your doorstep with your food. Please share the <strong>6-digit OTP</strong> sent to your email (<strong className="text-gray-900">{currentUser?.email || 'shalin@example.com'}</strong>) or verify below:
                    </p>

                    {/* Inline Verification Input Form */}
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={doorstepOtp}
                        onChange={(e) => setDoorstepOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full sm:w-56 px-4 py-2.5 rounded-xl border border-gray-300 text-center text-lg font-mono font-black tracking-widest focus:ring-2 focus:ring-[#FC8019] focus:border-transparent outline-none shadow-sm"
                      />

                      <button
                        onClick={() => handleVerifyDoorstepOtp()}
                        disabled={isVerifyingOtp}
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#267E3E] hover:bg-[#1f6632] text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center space-x-1.5"
                      >
                        {isVerifyingOtp ? (
                          <span>Verifying...</span>
                        ) : (
                          <>
                            <CheckCheck className="w-4 h-4" />
                            <span>Verify & Complete Delivery</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleAutoFillOtp}
                        className="w-full sm:w-auto px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                        title="Auto-fill code from received email"
                      >
                        <span>⚡ Fill Code From Email</span>
                      </button>

                      <button
                        onClick={() => setIsEmailModalOpen(true)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-[#FC8019] border border-orange-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Open Email Inbox</span>
                      </button>
                    </div>

                    {doorstepOtpError && (
                      <p className="text-xs font-bold text-red-600 mt-2 flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{doorstepOtpError}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Interactive 7-Stage Timeline & Partner Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Assigned Delivery Partner Card */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Assigned Delivery Partner
              </h3>

              <div className="flex items-center space-x-3.5 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gray-900 to-gray-700 text-white font-black text-base flex items-center justify-center shadow-md">
                  RK
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{order.rider?.name || 'Ramesh Kumar'}</h4>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-0.5">
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                      <span>{order.rider?.rating || '4.9'}</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#686B78] mt-0.5 font-mono">{order.rider?.bikeNumber || 'GJ-06-BQ-4912'}</p>
                </div>
              </div>

              <div className="pt-3 flex space-x-2">
                <a
                  href={`tel:${order.rider?.phone || '+919825012345'}`}
                  className="flex-1 py-2 bg-gray-50 hover:bg-orange-50 text-gray-800 hover:text-[#FC8019] rounded-xl text-xs font-bold border border-gray-200 flex items-center justify-center space-x-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Rider</span>
                </a>
                <Link
                  to="/partner"
                  className="flex-1 py-2 bg-orange-50 hover:bg-orange-100 text-[#FC8019] rounded-xl text-xs font-bold border border-orange-200 flex items-center justify-center space-x-1.5 transition"
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Rider View</span>
                </Link>
              </div>
            </div>

            {/* Email OTP Security Callout */}
            <div className="bg-white rounded-3xl p-5 border border-orange-200/80 shadow-sm relative overflow-hidden">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FC8019] flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">
                    Email Delivery OTP Verification
                  </h4>
                  <p className="text-xs text-[#686B78] mt-1 leading-relaxed">
                    A secure 6-digit verification code has been dispatched to your registered email (<strong className="text-gray-900">{currentUser?.email || 'shalin@example.com'}</strong>).
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-orange-100 flex items-center justify-between">
                <button
                  onClick={() => setIsEmailModalOpen(true)}
                  className="w-full py-2 bg-[#FC8019] hover:bg-[#E96B0C] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center space-x-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open Delivery Email & View OTP</span>
                </button>
              </div>
            </div>

            {/* REAL-TIME FULFILLING 7-STAGE DELIVERY TIMELINE */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Delivery Lifecycle Timeline
                </h3>
                <span className="text-[10px] text-gray-400 font-medium">
                  Click any stage to jump
                </span>
              </div>

              <div className="space-y-4 relative pl-3">
                {TIMELINE_STAGES.map((stage, idx) => {
                  // If Delivered (activeStageIdx === 6), all 7 stages are fulfilled!
                  const isCompleted = activeStageIdx === 6 ? true : idx < activeStageIdx;
                  const isCurrent = activeStageIdx === 6 ? idx === 6 : idx === activeStageIdx;
                  const Icon = stage.icon;

                  return (
                    <div 
                      key={stage.key} 
                      onClick={() => handleJumpToStage(idx)}
                      className="group flex items-start space-x-3.5 relative cursor-pointer select-none transition-all hover:translate-x-1"
                      title={`Jump to: ${stage.label}`}
                    >
                      {/* Connecting vertical line */}
                      {idx < TIMELINE_STAGES.length - 1 && (
                        <div 
                          className={`absolute left-3.5 top-7 bottom-0 w-0.5 -ml-[1px] transition-all duration-500 ${
                            isCompleted
                              ? 'bg-[#267E3E]'
                              : isCurrent
                              ? 'bg-gradient-to-b from-[#FC8019] to-gray-200'
                              : 'bg-gray-200'
                          }`}
                        />
                      )}

                      {/* Timeline Dot Icon */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isCompleted
                              ? 'bg-[#267E3E] text-white shadow-md ring-2 ring-emerald-100'
                              : isCurrent
                              ? 'bg-[#FC8019] text-white ring-4 ring-orange-200 shadow-lg scale-110 animate-pulse'
                              : 'bg-white text-gray-400 border-2 border-gray-300 group-hover:border-orange-400 group-hover:text-orange-500'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : isCurrent ? (
                            <span className="text-xs font-black">{idx + 1}</span>
                          ) : (
                            <span className="text-xs font-black">{idx + 1}</span>
                          )}
                        </div>
                      </div>

                      {/* Timeline Stage Details */}
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-xs sm:text-sm font-extrabold transition ${
                              isCompleted
                                ? 'text-gray-900'
                                : isCurrent
                                ? 'text-[#FC8019]'
                                : 'text-gray-400 group-hover:text-gray-700'
                            }`}
                          >
                            {stage.label}
                          </p>
                          
                          {/* Live timestamp / Status tag */}
                          {isCurrent && activeStageIdx !== 6 ? (
                            <span className="bg-orange-100 text-[#FC8019] text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                              In Progress
                            </span>
                          ) : isCompleted ? (
                            <span className="text-[10px] text-emerald-700 font-mono font-bold">
                              {stageTimestamps[idx] || '✓ Done'}
                            </span>
                          ) : null}
                        </div>

                        <p className={`text-[11px] mt-0.5 ${isCompleted || isCurrent ? 'text-[#686B78]' : 'text-gray-400'}`}>
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Jump Button */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleJumpToStage(Math.min(activeStageIdx + 1, TIMELINE_STAGES.length - 1))}
                  className="w-full py-2 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-[#FC8019] font-bold rounded-xl border border-gray-200 transition flex items-center justify-center space-x-1.5"
                >
                  <FastForward className="w-3.5 h-3.5 text-[#FC8019]" />
                  <span>Advance to Next Step ({TIMELINE_STAGES[Math.min(activeStageIdx + 1, TIMELINE_STAGES.length - 1)].label})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Inbox Viewer Modal */}
      <EmailInboxModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
}
