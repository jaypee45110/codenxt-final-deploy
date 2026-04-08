import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();

  const handlePayment = () => {
    // Simulert betaling – i produksjon ville dette kobles til Stripe
    alert("Payment successful! Redirecting to your Control Center...");
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      
      {/* Header – stor midtstilt logo */}
      <header className="pt-12 pb-8 flex justify-center bg-[#0a0a0a]">
        <img 
          src="/codetone-logo.webp" 
          alt="codeTone Logo" 
          className="h-40 w-auto object-contain drop-shadow-2xl"
        />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold tracking-tighter">CHECKOUT</h1>
            <p className="text-gray-400 mt-2">Complete your order</p>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-3xl p-10">

            {/* Order Information (samme som før) */}
            <div className="space-y-8">
              <div>
                <label className="block text-sm text-gray-400 mb-2">FULL NAME</label>
                <input type="text" defaultValue="Jan Paulsen" className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-400" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">EMAIL</label>
                <input type="email" defaultValue="jan@example.com" className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-400" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">ARTIST</label>
                  <input type="text" defaultValue="artistNN" className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-400" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">DATE</label>
                  <input type="text" defaultValue="April 25, 2026" className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">VENUE</label>
                <input type="text" defaultValue="Oslo Spektrum" className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-400" />
              </div>

              {/* Payment Details */}
              <div>
                <label className="block text-sm text-gray-400 mb-4">PAYMENT DETAILS</label>
                
                <div className="flex gap-4 mb-6">
                  <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-4 rounded-2xl font-medium transition-all ${paymentMethod === 'card' ? 'bg-white text-black' : 'bg-[#1a1a1a] border border-gray-700 text-gray-300'}`}>Card</button>
                  <button onClick={() => setPaymentMethod('stripe')} className={`flex-1 py-4 rounded-2xl font-medium transition-all ${paymentMethod === 'stripe' ? 'bg-white text-black' : 'bg-[#1a1a1a] border border-gray-700 text-gray-300'}`}>Stripe</button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">CARD NUMBER</label>
                      <input type="text" placeholder="4242 4242 4242 4242" className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">EXPIRY DATE</label>
                        <input type="text" placeholder="12/28" className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-400" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">CVC</label>
                        <input type="text" placeholder="123" className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-400" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'stripe' && (
                  <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-6 text-center text-gray-400">
                    Stripe Checkout will open in a secure window.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <input type="checkbox" id="terms" className="w-5 h-5 accent-cyan-400" defaultChecked />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I accept the <span className="text-cyan-400 underline">Terms and Conditions</span>
              </label>
            </div>

            <button 
              onClick={handlePayment}
              className="mt-8 w-full bg-[#00f0ff] hover:bg-[#00e0ee] transition-all text-black font-semibold text-xl py-6 rounded-3xl shadow-2xl shadow-cyan-500/50 active:scale-95"
            >
              Pay $1490
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Checkout;