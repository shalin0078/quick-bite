import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('customer'); // 'customer' | 'delivery_partner'
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill out all registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the QuickBite Terms and Conditions.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const result = await register({ fullName, email, password, role });
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Account created! Welcome, ${result.user.fullName}.`);
      if (role === 'delivery_partner') {
        navigate('/partner');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl shadow-orange-500/5 space-y-6">
        {/* Brand Header */}
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
          <h2 className="text-2xl font-black text-gray-900 pt-2">Create Account</h2>
          <p className="text-xs sm:text-sm text-[#686B78]">
            Join QuickBite for lightning-fast deliveries and exclusive discounts
          </p>
        </div>

        {/* Role Toggle: Customer vs Delivery Partner */}
        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2 rounded-lg transition ${
              role === 'customer'
                ? 'bg-white text-[#FC8019] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('delivery_partner')}
            className={`flex-1 py-2 rounded-lg transition ${
              role === 'delivery_partner'
                ? 'bg-white text-[#FC8019] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Delivery Partner
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2.5 text-xs text-rose-700 font-semibold animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setError(''); }}
                placeholder="e.g. Alex Mercer"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FC8019]/40 focus:border-[#FC8019] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="e.g. yourname@example.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FC8019]/40 focus:border-[#FC8019] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FC8019]/40 focus:border-[#FC8019] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FC8019]/40 focus:border-[#FC8019] transition"
              />
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-1 text-xs text-gray-600">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#FC8019] border-gray-300 focus:ring-[#FC8019]"
            />
            <label htmlFor="terms" className="cursor-pointer select-none">
              I agree to QuickBite's{' '}
              <span className="font-bold text-[#FC8019]">Terms of Service</span> and{' '}
              <span className="font-bold text-[#FC8019]">Privacy Policy</span>.
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
                <span>Create QuickBite Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-[#686B78]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#FC8019] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
