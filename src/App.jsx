import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Existing Pages
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OffersPage from './pages/OffersPage';
import HelpPage from './pages/HelpPage';

// New Advanced Systems Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import DeliveryPartnerPage from './pages/DeliveryPartnerPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Mobile Bottom Navigation
import { Home, Compass, ShoppingBag, Percent, Navigation, User } from 'lucide-react';

function MobileBottomNav() {
  const location = useLocation();
  const { totalCount } = useCart();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Restaurants', path: '/restaurants', icon: Compass },
    { label: 'Live Map', path: '/live-tracking', icon: Navigation },
    { label: 'Cart', path: '/cart', icon: ShoppingBag, badge: totalCount },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-2 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition relative ${
              isActive ? 'text-[#FC8019]' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#FC8019] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          {/* Public Core Food Delivery Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* Customer Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Customer Profile & Saved Addresses (Protected) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Live Delivery Tracking with Interactive Map */}
          <Route path="/live-tracking/:orderId" element={<LiveTrackingPage />} />
          <Route path="/live-tracking" element={<LiveTrackingPage />} />
          <Route path="/order-tracking/:orderId" element={<LiveTrackingPage />} />
          <Route path="/order-tracking" element={<LiveTrackingPage />} />
          <Route path="/orders" element={<LiveTrackingPage />} />

          {/* Delivery Partner Portal (Role Protected: delivery_partner or admin) */}
          <Route
            path="/partner"
            element={
              <ProtectedRoute allowedRoles={['delivery_partner', 'admin']}>
                <DeliveryPartnerPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Operations Console (Role Protected: admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
