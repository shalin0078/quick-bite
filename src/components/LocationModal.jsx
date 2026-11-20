import React, { useState } from 'react';
import { MapPin, X, Check, Search, Navigation } from 'lucide-react';
import { CITIES } from '../data/mockData';
import { useCart } from '../context/CartContext';

export default function LocationModal({ isOpen, onClose }) {
  const { selectedCity, setSelectedCity, showToast } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredCities = CITIES.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (cityName) => {
    setSelectedCity(cityName);
    showToast(`Delivery location updated to ${cityName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-[#FC8019]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Select Delivery Location</h3>
              <p className="text-xs text-[#686B78]">See restaurants delivering to you right now</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search city, area, or pincode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC8019]/40 focus:border-[#FC8019] transition"
              autoFocus
            />
          </div>

          <button
            onClick={() => handleSelect('Vadodara')}
            className="mt-3 w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-orange-50 hover:bg-orange-100 text-[#FC8019] text-sm font-semibold rounded-xl transition"
          >
            <Navigation className="w-4 h-4" />
            <span>Detect Current Location (GPS)</span>
          </button>
        </div>

        {/* Popular Cities */}
        <div className="p-6 pt-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Popular Cities
          </h4>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {filteredCities.map((city) => {
              const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
              return (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city.name)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                    isSelected
                      ? 'border-[#FC8019] bg-orange-50/70 text-[#FC8019]'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{city.name}</p>
                    <p className="text-xs text-[#686B78]">{city.state}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#FC8019] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-[#686B78]">
            QuickBite delivers in 100+ cities across India with 30-min fast delivery
          </p>
        </div>
      </div>
    </div>
  );
}
