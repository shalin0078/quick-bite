import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart, Globe, MessageCircle, Share2, ShieldCheck, Zap, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 mb-12 border-b border-gray-800">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FC8019] shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Lightning-Fast Delivery</h4>
              <p className="text-sm text-gray-400 mt-1">
                Hot food delivered to your doorstep in 30 minutes or less with live GPS tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Hygiene & Safety Assured</h4>
              <p className="text-sm text-gray-400 mt-1">
                100% verified kitchen hygiene protocols and contactless delivery options.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Best Price Guarantee</h4>
              <p className="text-sm text-gray-400 mt-1">
                Super saver coupon codes, flat discounts, and zero surge pricing anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E96B0C] to-[#FC8019] flex items-center justify-center shadow-lg shadow-orange-500/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-white stroke-[2.5]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Quick<span className="text-[#FC8019]">Bite</span>
              </span>
            </div>
            <p className="text-[#FC8019] font-medium text-sm">
              Good Food. Good Mood.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              QuickBite connects food lovers with the finest local restaurants and culinary legends. Fast delivery, fresh food, and joyful everyday meals.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {/* Clean social SVG links */}
              <a href="#instagram" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FC8019] transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#twitter" aria-label="Twitter / X" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FC8019] transition">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#linkedin" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FC8019] transition">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FC8019] transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h5>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-[#FC8019] transition">Home</Link>
              </li>
              <li>
                <Link to="/restaurants" className="hover:text-[#FC8019] transition">Restaurants</Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#FC8019] transition">Promotions & Offers</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#FC8019] transition">Live Order Tracking</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-[#FC8019] transition">Help & FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Popular Cuisines */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Top Cuisines
            </h5>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/restaurants?cuisine=pizza" className="hover:text-[#FC8019] transition">Pizzas</Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=biryani" className="hover:text-[#FC8019] transition">Hyderabadi Biryani</Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=burger" className="hover:text-[#FC8019] transition">Gourmet Burgers</Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=chinese" className="hover:text-[#FC8019] transition">Authentic Chinese</Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=south-indian" className="hover:text-[#FC8019] transition">South Indian Dosas</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h5 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Contact Us
            </h5>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#FC8019] shrink-0" />
                <span className="text-xs">support@quickbite.in</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#FC8019] shrink-0" />
                <span className="text-xs">1800-202-FOOD (+91 90000 00000)</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#FC8019] shrink-0 mt-0.5" />
                <span className="text-xs">QuickBite Tower, Race Course Road, Vadodara, Gujarat - 390007</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} QUICKBITE Technologies Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer">FSSAI License: 10721026000189</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
