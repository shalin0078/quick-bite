import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Mail, Lock, KeyRound, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { requestPasswordReset, resetPassword } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState('request'); // 'request' | 'reset' | 'success'
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const result = await requestPasswordReset(email);
    setIsSubmitting(false);

    if (result.success) {
      showToast(result.message);
      setStep('reset');
    } else {
      setError(result.message);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!token.trim() || !newPassword) {
      setError('Please provide the reset code and new password.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const result = await resetPassword({ email, token, newPassword });
    setIsSubmitting(false);

    if (result.success) {
      showToast('Password reset successfully!');
      setStep('success');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl shadow-orange-500/5 space-y-6">
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
          <h2 className="text-2xl font-black text-gray-900 pt-2">
            {step === 'success' ? 'Password Changed!' : 'Reset Password'}
          </h2>
          <p className="text-xs sm:text-sm text-[#686B78]">
            {step === 'request' && 'Enter your registered email and we will send you a password reset code'}
            {step === 'reset' && `We sent a 6-digit reset code to ${email}`}
            {step === 'success' && 'Your password has been updated securely. You can now log in.'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-2.5 text-xs text-rose-700 font-semibold animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Request Email */}
        {step === 'request' && (
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="e.g. shalin@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FC8019]/40 focus:border-[#FC8019] transition"
                />
              </div>
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
                  <span>Send Reset Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Enter Code & New Password */}
        {step === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                6-Digit Reset Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => { setToken(e.target.value); setError(''); }}
                  placeholder="Check your email for the code"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-[#FC8019]/40 focus:border-[#FC8019] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FC8019]/40 focus:border-[#FC8019] transition"
                />
              </div>
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
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-[#267E3E] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <p className="text-sm text-gray-700 font-semibold">
              You can now log in with your updated credentials.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#FC8019] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#E96B0C] transition"
            >
              <span>Back to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {step !== 'success' && (
          <div className="text-center pt-2 border-t border-gray-100">
            <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#FC8019] hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
