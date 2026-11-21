import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Bike, 
  ShieldCheck 
} from 'lucide-react';

export default function LoginPage() {
  const { login, switchDemoRole } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.from?.pathname || '/';

  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrId.trim() || !password) {
      setError('Please provide your email/user ID and password.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const result = await login({ emailOrId, password, rememberMe });
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Welcome back, ${result.user.fullName}!`);
      if (result.user.role === 'delivery_partner') {
        navigate('/partner');
      } else if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(returnPath);
      }
    } else {
      setError(result.message);
    }
  };

  const handleQuickDemoLogin = (role) => {
    const user = switchDemoRole(role);
    if (user) {
      showToast(`Logged in as ${user.fullName} (${user.role.toUpperCase()})`);
      if (role === 'delivery_partner') navigate('/partner');
      else if (role === 'admin') navigate('/admin');
      else navigate(returnPath);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl shadow-orange-500/5 space-y-6">
        {/* QuickBite Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#E96B0C] to-[#FC8019] flex items-center justify-center shadow-lg shadow-orange-500/25">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7 text-white stroke-[2.5]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-3xl font-black tracking-tight text-gray-900">
              Quick<span className="text-[#FC8019]">Bite</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-gray-900 pt-2">Welcome back!</h2>
          <p className="text-xs sm:text-sm text-[#686B78]">
            Sign in to track orders, manage addresses & enjoy fast delivery
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2.5 text-xs text-rose-700 font-semibold animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address / User ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={emailOrId}
                onChange={(e) => { setEmailOrId(e.target.value); setError(''); }}
                placeholder="e.g. customer@quickbite.demo or QB-CUST-849201"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FC8019]/40 focus:border-[#FC8019] transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-[#FC8019] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FC8019]/40 focus:border-[#FC8019] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#FC8019] border-gray-300 focus:ring-[#FC8019]"
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#FC8019] hover:bg-[#E96B0C] disabled:bg-orange-300 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-500/25 transition transform active:scale-95 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to QuickBite</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Create account link */}
        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-[#686B78]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#FC8019] hover:underline">
              Create Account
            </Link>
          </p>
        </div>

        {/* Safe Demo Credential Pre-fill (Fills fields for testing, requires real validation) */}
        <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/70 rounded-2xl p-3.5 text-center">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Demo Evaluation Helpers
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmailOrId('customer@quickbite.demo');
                setPassword('password123');
                setError('');
              }}
              className="py-1.5 px-2 bg-white rounded-lg border border-gray-200 text-[11px] font-bold text-gray-800 hover:bg-orange-50 hover:text-[#FC8019] transition flex items-center justify-center space-x-1"
            >
              <UserCheck className="w-3 h-3 text-[#FC8019]" />
              <span>Fill Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmailOrId('rider@quickbite.demo');
                setPassword('rider123');
                setError('');
              }}
              className="py-1.5 px-2 bg-white rounded-lg border border-gray-200 text-[11px] font-bold text-gray-800 hover:bg-orange-50 hover:text-emerald-600 transition flex items-center justify-center space-x-1"
            >
              <Bike className="w-3 h-3 text-emerald-600" />
              <span>Fill Rider Demo</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            Admin access requires explicit administrator credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
