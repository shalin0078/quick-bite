import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Mail, 
  Phone, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! Welcome to QuickBite Customer Support. How can we help you today?' }
  ]);
  const { showToast } = useCart();

  const faqs = [
    {
      q: 'How does QuickBite achieve 30-minute delivery?',
      a: 'QuickBite algorithmically pairs your order with nearby cloud kitchens and restaurants with dedicated express dispatch lanes. Our smart routing algorithms ensure riders are dispatched before food prep completes.'
    },
    {
      q: 'How do I apply coupon codes to my order?',
      a: 'You can apply coupons either from the Offers page with 1-click copy, or directly in your Shopping Cart before proceeding to checkout. Codes like QUICK50, QUICK40, or QUICK20 give instant bill discounts.'
    },
    {
      q: 'Can I cancel or modify my order after placing it?',
      a: 'You can cancel or edit instructions within 60 seconds of order placement. Once the restaurant begins preparing your dishes, cancellation is restricted to avoid food wastage.'
    },
    {
      q: 'What payment methods are supported on QuickBite?',
      a: 'We support Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit cards (Visa, Mastercard, RuPay), and Netbanking. On this demo website, all payments are simulated locally.'
    },
    {
      q: 'How can I track my live order?',
      a: 'Click on "Orders" in the navigation or visit the Order Tracking page. You will see a live 4-stage tracker: Order Placed → Restaurant Preparing → Out for Delivery → Delivered.'
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const userMsg = messageText;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setMessageText('');

    setTimeout(() => {
      let reply = "Thank you for reaching out! Our executive has noted your inquiry and our support team will update you within 5 minutes.";
      if (userMsg.toLowerCase().includes('order')) {
        reply = "You can view and simulate your order status in real time from the 'My Orders' section in the navigation.";
      } else if (userMsg.toLowerCase().includes('coupon') || userMsg.toLowerCase().includes('discount')) {
        reply = "You can use code 'QUICK50' for 50% OFF or 'QUICK20' for flat ₹20 OFF on your order!";
      }
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      showToast('Support reply received');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="w-16 h-16 rounded-3xl bg-orange-100 text-[#FC8019] flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-sm text-[#686B78] mt-2">
            Have questions about orders, payments, delivery or restaurant partnerships? We're here 24/7.
          </p>
        </div>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FC8019] flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Email Support</h3>
              <p className="text-xs text-[#686B78] mt-0.5">Quick responses within 15 mins</p>
              <a href="mailto:support@quickbite.in" className="text-xs font-bold text-[#FC8019] hover:underline block mt-2">
                support@quickbite.in
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Call Us Toll-Free</h3>
              <p className="text-xs text-[#686B78] mt-0.5">Mon–Sun from 8:00 AM to 1:00 AM</p>
              <a href="tel:+919000000000" className="text-xs font-bold text-emerald-600 hover:underline block mt-2">
                1800-202-FOOD (+91 90000 00000)
              </a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Average Delivery</h3>
              <p className="text-xs text-[#686B78] mt-0.5">Real-time GPS dispatch</p>
              <p className="text-xs font-bold text-blue-600 mt-2">28 Mins in Vadodara</p>
            </div>
          </div>
        </div>

        {/* FAQs & Live Chat Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-2xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-4 text-left font-bold text-sm text-gray-900 hover:text-[#FC8019] flex items-center justify-between bg-gray-50/50"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          isOpen ? 'rotate-180 text-[#FC8019]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Support Chat Assistant (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col h-[520px]">
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FC8019] to-[#E96B0C] text-white flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">QuickBite Live Support</h3>
                <span className="flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online now</span>
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 py-4 overflow-y-auto space-y-3 pr-1 text-xs">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#FC8019] text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-gray-100 flex items-center space-x-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Ask about your order, food, coupons..."
                className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#FC8019]"
              />
              <button
                type="submit"
                className="bg-[#FC8019] hover:bg-[#E96B0C] text-white p-2.5 rounded-xl shadow-md transition"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
