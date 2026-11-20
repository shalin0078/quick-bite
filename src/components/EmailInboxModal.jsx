import React, { useState, useEffect } from 'react';
import { Mail, X, Check, Clock, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { emailService } from '../services/emailService';

export default function EmailInboxModal({ isOpen, onClose }) {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const loadEmails = () => {
    const list = emailService.getSentEmails();
    setEmails(list);
    if (!selectedEmail && list.length > 0) {
      setSelectedEmail(list[0]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEmails();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEmailSent = (e) => {
      loadEmails();
      if (e.detail) {
        setSelectedEmail(e.detail);
      }
    };
    window.addEventListener('quickbite:email_sent', handleEmailSent);
    return () => window.removeEventListener('quickbite:email_sent', handleEmailSent);
  }, []);

  if (!isOpen) return null;

  const handleClearAll = () => {
    localStorage.removeItem('quickbite_sent_emails');
    setEmails([]);
    setSelectedEmail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[88vh] shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FC8019] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-gray-900 text-base">QuickBite Customer Email Inbox</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Transactional Mail Dispatcher
                </span>
              </div>
              <p className="text-xs text-[#686B78]">
                Shows verified delivery OTPs, receipts & order status notifications sent to customers
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {emails.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs font-bold text-gray-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-gray-200/50 transition flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Inbox</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Split: Emails List + Email Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Email List (5 cols) */}
          <div className="md:col-span-5 border-r border-gray-100 overflow-y-auto divide-y divide-gray-100 bg-white">
            {emails.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Mail className="w-12 h-12 mx-auto mb-2 opacity-30 text-gray-400" />
                <p className="font-bold text-sm text-gray-700">Inbox is empty</p>
                <p className="text-xs mt-1 text-gray-400">
                  When orders are placed, out for delivery, or completed, QuickBite dispatches notifications here.
                </p>
              </div>
            ) : (
              emails.map((email) => {
                const isSelected = selectedEmail?.id === email.id;
                const isOtp = email.type === 'delivery_otp';
                return (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-4 cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-orange-50/70 border-l-4 border-[#FC8019]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          {isOtp && (
                            <span className="bg-[#FC8019] text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                              OTP
                            </span>
                          )}
                          <span className="font-bold text-gray-900 text-xs truncate block">
                            {email.subject}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#686B78] truncate block mt-0.5">
                          To: {email.to}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                        {new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-1 mt-1.5">
                      {email.text || 'Email content'}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: HTML Email Viewer (7 cols) */}
          <div className="md:col-span-7 bg-gray-50/60 overflow-y-auto p-4 sm:p-6 flex flex-col">
            {selectedEmail ? (
              <div className="space-y-4">
                {/* Meta details bar */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">{selectedEmail.subject}</span>
                    <span className="text-gray-400 font-mono text-[11px]">
                      {new Date(selectedEmail.sentAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[#686B78]">
                    <strong>From:</strong> QuickBite Delivery &lt;onboarding@quickbite.in&gt;
                  </p>
                  <p className="text-[#686B78]">
                    <strong>To:</strong> {selectedEmail.to}
                  </p>
                </div>

                {/* Rendered HTML */}
                <div
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-gray-400">
                <p className="text-sm font-semibold">Select an email from the left to view contents</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
