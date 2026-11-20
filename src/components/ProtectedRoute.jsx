import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login preserving intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(currentUser.role);
    if (!hasRole) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-gray-900">Access Restricted</h2>
            <p className="text-sm text-[#686B78] mt-2">
              This portal requires <strong>{allowedRoles.join(' or ')}</strong> credentials. Your current role is <strong>{currentUser.role}</strong>.
            </p>
            <div className="mt-6 flex flex-col space-y-2">
              <a
                href="/"
                className="py-2.5 px-4 bg-[#FC8019] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#E96B0C]"
              >
                Return to QuickBite Home
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
}
