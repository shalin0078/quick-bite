import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  LogOut, 
  Check, 
  ShieldCheck, 
  RotateCcw, 
  X,
  CreditCard,
  ShoppingBag
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updateProfile, logout } = useAuth();
  const { 
    savedAddresses, 
    addAddress, 
    selectedAddressId, 
    setSelectedAddressId, 
    orders, 
    reorder, 
    showToast 
  } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses' | 'orders'
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || ''
  });

  // Address modal state
  const [isAddrModalOpen, setIsAddrModalOpen] = useState(false);
  const [addrForm, setAddrForm] = useState({
    id: null,
    name: currentUser?.fullName || '',
    phone: currentUser?.phone || '+91 90000 00000',
    type: 'Home',
    flat: '',
    street: '',
    city: 'Vadodara',
    state: 'Gujarat',
    pincode: '390001'
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsEditingProfile(false);
    showToast('Profile information updated!');
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addrForm.flat || !addrForm.street || !addrForm.pincode) {
      showToast('Please fill out all address fields', 'error');
      return;
    }

    addAddress(addrForm);
    setIsAddrModalOpen(false);
    setAddrForm({
      id: null,
      name: currentUser?.fullName || '',
      phone: currentUser?.phone || '+91 90000 00000',
      type: 'Home',
      flat: '',
      street: '',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390001'
    });
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out of QuickBite.');
    navigate('/login');
  };

  const handleReorder = (orderId) => {
    const success = reorder(orderId);
    if (success) {
      navigate('/cart');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FC8019] to-[#E96B0C] text-white text-2xl font-black flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
              {currentUser?.fullName?.substring(0, 2).toUpperCase() || 'QB'}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-gray-900">{currentUser?.fullName}</h1>
                <span className="bg-orange-100 text-[#FC8019] font-mono text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {currentUser?.customUserId || 'QB-CUST-849201'}
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Verified Email</span>
                </span>
              </div>
              <p className="text-sm text-[#686B78] mt-1">{currentUser?.email}</p>
              <p className="text-xs text-gray-400 mt-1">Role: <strong className="text-gray-700 capitalize">{currentUser?.role}</strong></p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-4 py-2.5 border border-gray-200 hover:border-rose-200 hover:bg-rose-50 text-gray-700 hover:text-rose-600 rounded-xl text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-gray-200 mb-6 pb-2">
          {[
            { id: 'profile', label: 'My Account Settings', icon: User },
            { id: 'addresses', label: `Saved Addresses (${savedAddresses.length})`, icon: MapPin },
            { id: 'orders', label: `Order History (${orders.length})`, icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                  isSelected
                    ? 'bg-[#FC8019] text-white shadow-md shadow-orange-500/20'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Account Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900">Personal Information</h2>
                <p className="text-xs text-[#686B78]">Manage your primary contact and login identifiers</p>
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-xs font-bold text-[#FC8019] hover:bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? 'Cancel' : 'Edit Information'}</span>
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#FC8019]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 90000 00000"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#FC8019]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FC8019] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#E96B0C] transition"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase">Customer Name</span>
                  <p className="font-extrabold text-gray-900 mt-1">{currentUser?.fullName}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase">Registered Email</span>
                  <p className="font-extrabold text-gray-900 mt-1">{currentUser?.email}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase">Phone Number</span>
                  <p className="font-extrabold text-gray-900 mt-1">{currentUser?.phone || '+91 90000 00000'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase">Unique User ID</span>
                  <p className="font-mono font-extrabold text-[#FC8019] mt-1">{currentUser?.customUserId}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Saved Delivery Addresses */}
        {activeTab === 'addresses' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900">Saved Delivery Addresses</h2>
                <p className="text-xs text-[#686B78]">Add or choose your default delivery destinations</p>
              </div>
              <button
                onClick={() => setIsAddrModalOpen(true)}
                className="text-xs font-bold text-white bg-[#FC8019] hover:bg-[#E96B0C] px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#FC8019] bg-orange-50/40 shadow-sm ring-1 ring-[#FC8019]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                          {addr.type || 'Home'}
                        </span>
                        {isSelected && (
                          <span className="text-[11px] font-bold text-[#FC8019] flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Default</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">{addr.name}</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {addr.flat}, {addr.street}, {addr.city} - {addr.pincode}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Mobile: {addr.phone}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          showToast('Set as active delivery address');
                        }}
                        className="text-xs font-bold text-[#FC8019] hover:underline"
                      >
                        {isSelected ? 'Active Address' : 'Use as Default'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Order History */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900">Your Past Orders</h2>
                <p className="text-xs text-[#686B78]">Live tracking, order details, and 1-click reorder</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-40 text-gray-400" />
                <p className="font-bold text-sm text-gray-700">No past orders found</p>
                <p className="text-xs text-[#686B78] mt-1">Explore our restaurants and place your first QuickBite order!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-5 rounded-2xl border border-gray-200 hover:border-orange-200 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition"
                  >
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono font-bold text-sm text-gray-900">#{o.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-100 text-[#267E3E]'
                            : 'bg-orange-100 text-[#FC8019]'
                        }`}>
                          {o.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#686B78] mt-1">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs font-semibold text-gray-800 mt-1">
                        {o.items?.map(it => `${it.name} (${it.quantity})`).join(', ')}
                      </p>
                      <p className="text-sm font-extrabold text-[#FC8019] mt-1">
                        Total: ₹{o.totalAmount} • <span className="text-xs text-gray-500 font-normal">{o.paymentMethod}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => navigate(`/live-tracking/${o.id}`)}
                        className="text-xs font-bold px-3.5 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-800 transition"
                      >
                        Live Map Tracking
                      </button>
                      <button
                        onClick={() => handleReorder(o.id)}
                        className="text-xs font-bold px-3.5 py-2 bg-[#FC8019] text-white rounded-xl hover:bg-[#E96B0C] shadow-sm flex items-center space-x-1 transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {isAddrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-black text-lg text-gray-900">Add New Delivery Address</h3>
              <button onClick={() => setIsAddrModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={addrForm.name}
                    onChange={(e) => setAddrForm({ ...addrForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={addrForm.phone}
                    onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Flat / Building / House</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B-402, Green Park Residency"
                  value={addrForm.flat}
                  onChange={(e) => setAddrForm({ ...addrForm, flat: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Street / Area / Landmark</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Inorbit Mall, Subhanpura"
                  value={addrForm.street}
                  onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={addrForm.pincode}
                    onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FC8019]"
                  />
                </div>
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddrModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FC8019] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#E96B0C]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
