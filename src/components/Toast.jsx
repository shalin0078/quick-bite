import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#FC8019] shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
      <div className="bg-[#1C1C1C] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-gray-700/60 backdrop-blur-md">
        {icons[toast.type] || icons.success}
        <span className="text-sm font-medium pr-2">{toast.message}</span>
      </div>
    </div>
  );
}
