import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ShoppingCart, 
  User, 
  ChevronDown, 
  Search, 
  Clock, 
  Percent, 
  HelpCircle, 
  Menu, 
  X,
  Mail,
  Bike,
  ShieldCheck,
  LogOut,
  Navigation
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LocationModal from './LocationModal';
import EmailInboxModal from './EmailInboxModal';
import { emailService } from '../services/emailService';

export default function Navbar() {
  const { totalCount, selectedCity, orders } = useCart();
  const { currentUser, isAuthenticated, logout, isAdmin, isDeliveryPartner } = useAuth();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailCount, setEmailCount] = useState(() => emailService.getSentEmails().length);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmail = () => {
      setEmailCount(emailService.getSentEmails().length);
    };
    window.addEventListener('quickbite:email_sent', handleEmail);
    return () => window.removeEventListener('quickbite:email_sent', handleEmail);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Restaurants', path: '/restaurants' },
    { name: 'Offers', path: '/offers' },
    { name: 'Help', path: '/help' },
  ];

  return (
    <>
      {/* Prototype Environment Notice Strip */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-[11px] font-bold py-1 px-4 text-center tracking-wide flex items-center justify-center space-x-2 shadow-inner">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span>QuickBite Prototype Build — Evaluation & Demonstration Environment (No Real Financial Transactions)</span>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand Logo & Location */}
            <div className="flex items-center space-x-6 sm:space-x-8">
              {/* QuickBite Logo */}
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E96B0C] to-[#FC8019] flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition transform">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    className="w-6 h-6 text-white stroke-[2.5]"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" 
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-[#1C1C1C] flex items-center">
                    Quick<span className="text-[#FC8019]">Bite</span>
                  </span>
                  <span className="text-[10px] -mt-1 font-semibold tracking-wider text-[#686B78] uppercase hidden sm:block">
                    Good Food. Good Mood.
                  </span>
                </div>
              </Link>

              {/* Location Selector Pill */}
              <button
                onClick={() => setIsLocationOpen(true)}
                className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gray-50 hover:bg-orange-50/70 border border-gray-200/80 hover:border-orange-200 text-sm font-medium text-gray-700 transition"
              >
                <MapPin className="w-4 h-4 text-[#FC8019] shrink-0" />
                <span className="font-semibold text-gray-900 truncate max-w-[120px]">{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            {/* Center: Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition py-1 relative ${
                      isActive
                        ? 'text-[#FC8019] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FC8019] after:rounded-full'
                        : 'text-gray-700 hover:text-[#FC8019]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Delivery Partner Shortcut */}
              <NavLink
                to="/partner"
                className="text-xs font-bold text-gray-600 hover:text-[#FC8019] flex items-center space-x-1.5 bg-gray-50 hover:bg-orange-50 px-3 py-1.5 rounded-xl border border-gray-200 transition"
              >
                <Bike className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rider Portal</span>
              </NavLink>

              {/* Admin Shortcut for Admin users */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </NavLink>
              )}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Email Notifications & OTP Inbox Pill */}
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="relative p-2 rounded-xl text-gray-600 hover:text-[#FC8019] hover:bg-orange-50 transition"
                title="Customer Email & Delivery OTP Inbox"
                aria-label="Email Inbox"
              >
                <Mail className="w-5 h-5" />
                {emailCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FC8019] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {emailCount}
                  </span>
                )}
              </button>

              {/* Cart Button with Count Badge */}
              <Link
                to="/cart"
                className="relative flex items-center justify-center p-2.5 rounded-xl hover:bg-orange-50 text-gray-700 hover:text-[#FC8019] transition group"
                aria-label="View Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-105" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FC8019] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-soft-pulse">
                    {totalCount}
                  </span>
                )}
              </Link>

              {/* User Account / Profile Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 transition focus:outline-none"
                    aria-label="User Account"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 text-white font-bold text-xs flex items-center justify-center ring-2 ring-orange-500/20 shadow-sm">
                      {currentUser?.fullName?.substring(0, 2).toUpperCase() || 'SR'}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
                  </button>

                  {isProfileOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setIsProfileOpen(false)} 
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-40 animate-scale-up">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-900">{currentUser?.fullName}</p>
                          <p className="text-xs text-[#686B78] truncate">{currentUser?.email}</p>
                          <span className="inline-block mt-1.5 font-mono text-[10px] font-bold bg-orange-100 text-[#FC8019] px-2 py-0.5 rounded-md">
                            {currentUser?.customUserId || 'QB-CUST-849201'}
                          </span>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FC8019] transition"
                          >
                            <User className="w-4 h-4 text-gray-400" />
                            <span>My Account & Addresses</span>
                          </Link>

                          <Link
                            to="/orders"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FC8019] transition"
                          >
                            <div className="flex items-center space-x-2.5">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>Live Orders & Tracking</span>
                            </div>
                            {orders.length > 0 && (
                              <span className="bg-orange-100 text-[#FC8019] text-xs font-bold px-2 py-0.5 rounded-full">
                                {orders.length}
                              </span>
                            )}
                          </Link>

                          <Link
                            to="/partner"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FC8019] transition"
                          >
                            <Bike className="w-4 h-4 text-emerald-600" />
                            <span>Delivery Partner Portal</span>
                          </Link>

                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-50 transition"
                            >
                              <ShieldCheck className="w-4 h-4 text-blue-600" />
                              <span>Admin Operations</span>
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-gray-100 pt-1 mt-1">
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              logout();
                              navigate('/login');
                            }}
                            className="w-full text-left flex items-center space-x-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-[#FC8019] hover:bg-[#E96B0C] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-xl text-base font-semibold transition ${
                    isActive
                      ? 'bg-orange-50 text-[#FC8019]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#FC8019]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/partner"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Bike className="w-4 h-4 text-emerald-600" />
              <span>Delivery Partner Portal</span>
            </Link>

            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
            >
              <User className="w-4 h-4 text-[#FC8019]" />
              <span>My Account & Addresses</span>
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsEmailModalOpen(true);
              }}
              className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Mail className="w-4 h-4 text-[#FC8019]" />
              <span>Customer Email Inbox ({emailCount})</span>
            </button>
          </div>
        )}
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />

      {/* Email Inbox Simulator Modal */}
      <EmailInboxModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </>
  );
}
