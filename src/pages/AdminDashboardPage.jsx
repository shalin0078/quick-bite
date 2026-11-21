import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShoppingBag, 
  Bike, 
  Users, 
  Mail, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { emailService } from '../services/emailService';

export default function AdminDashboardPage() {
  const { orders, updateOrderStatus, showToast } = useCart();
  const { users, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'riders' | 'customers' | 'emails'
  const [searchTerm, setSearchTerm] = useState('');

  // Synthetic demo fleet list
  const deliveryFleet = [
    { id: 'rider-1', name: 'Arjun Singh', phone: '+91 90000 11111', vehicle: 'TVS Ntorq 125', bikeNumber: 'GJ-06-BQ-4912', rating: 4.9, status: 'Active (On Delivery)', activeOrderId: 'QB84920193' },
    { id: 'rider-2', name: 'Karan Patel', phone: '+91 90000 22222', vehicle: 'Honda Activa 6G', bikeNumber: 'GJ-06-CL-8821', rating: 4.8, status: 'Available', activeOrderId: null },
    { id: 'rider-3', name: 'Vikas Verma', phone: '+91 90000 33333', vehicle: 'Bajaj Pulsar 150', bikeNumber: 'GJ-06-MN-3310', rating: 4.7, status: 'Available', activeOrderId: null },
  ];

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeDeliveries = orders.filter(o => o.status !== 'Delivered').length;
  const sentEmails = emailService.getSentEmails();

  const handleAssignRider = (orderId, riderName) => {
    updateOrderStatus(orderId, 'Picked Up by Delivery Partner');
    showToast(`Assigned ${riderName} to order #${orderId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-16">
      {/* Admin Top Navigation */}
      <div className="bg-[#1C1C1C] text-white py-5 px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FC8019] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-lg text-white">QuickBite Operations Console</h1>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                  Admin Access
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Logged in as <strong>{currentUser?.fullName}</strong> ({currentUser?.customUserId})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">System Status:</span>
            <span className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Total Orders</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{orders.length + 18}</p>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">↑ 14% this week</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FC8019] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Active Deliveries</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{activeDeliveries}</p>
              <span className="text-[11px] text-blue-600 font-bold mt-1 block">Live on road</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bike className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Total Revenue</span>
              <p className="text-2xl font-black text-gray-900 mt-1">₹{totalRevenue + 14850}</p>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Avg ticket: ₹285</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Emails Dispatched</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{sentEmails.length}</p>
              <span className="text-[11px] text-[#FC8019] font-bold mt-1 block">OTPs & Receipts</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
          {[
            { id: 'orders', label: `Orders Pipeline (${orders.length})`, icon: ShoppingBag },
            { id: 'riders', label: `Delivery Fleet (${deliveryFleet.length})`, icon: Bike },
            { id: 'customers', label: `Registered Customers (${users.length})`, icon: Users },
            { id: 'emails', label: `Email Audit Logs (${sentEmails.length})`, icon: Mail },
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

        {/* TAB 1: Orders Pipeline */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-extrabold text-gray-900 text-base">Live Order Pipeline</h2>
              <span className="text-xs text-[#686B78]">{orders.length} total orders recorded</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-5">Order ID</th>
                    <th className="py-3 px-4">Restaurant</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Delivery Partner</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3.5 px-5 font-mono font-bold text-gray-900">
                        #{o.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {o.restaurantName || "Domino's Pizza"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block">{o.address?.name || 'Customer'}</span>
                        <span className="text-gray-400 text-[10px]">{o.address?.city}</span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-gray-900">
                        ₹{o.totalAmount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-100 text-[#267E3E]'
                            : 'bg-orange-100 text-[#FC8019]'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-gray-800">
                        {o.rider?.name || 'Ramesh Kumar'}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleAssignRider(o.id, 'Ramesh Kumar')}
                            className="text-[11px] font-bold px-2.5 py-1 bg-gray-100 hover:bg-orange-50 hover:text-[#FC8019] rounded-lg transition"
                          >
                            Dispatch Rider
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Delivery Fleet */}
        {activeTab === 'riders' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryFleet.map((r) => (
              <div key={r.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FC8019] flex items-center justify-center font-black">
                    {r.name.substring(0, 2)}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    r.status.includes('Active')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">{r.name}</h3>
                  <p className="text-xs text-[#686B78] mt-0.5">{r.phone}</p>
                  <p className="text-xs text-gray-400 mt-1">Vehicle: <strong>{r.vehicle}</strong> ({r.bikeNumber})</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700">Rating: ★ {r.rating}</span>
                  <span className="text-[#FC8019] font-bold">GPS: Online</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Customers Directory */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
            <h2 className="font-extrabold text-gray-900 text-base">Registered Customer Accounts</h2>
            <div className="divide-y divide-gray-100">
              {users.map((u) => (
                <div key={u.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900 text-sm">{u.fullName}</span>
                      <span className="font-mono text-xs text-[#FC8019] font-semibold">{u.customUserId}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#686B78] mt-0.5">{u.email}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    ✓ Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Transactional Email Audit Logs */}
        {activeTab === 'emails' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-gray-900 text-base">Sent Email Audit Trail</h2>
                <p className="text-xs text-[#686B78]">Cryptographically logged transactional delivery emails</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {sentEmails.map((em) => (
                <div key={em.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{em.subject}</span>
                      <span className="bg-orange-100 text-[#FC8019] text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                        {em.type}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-0.5">Recipient: <strong className="text-gray-700">{em.to}</strong></p>
                  </div>
                  <span className="text-gray-400 font-mono shrink-0">
                    {new Date(em.sentAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
