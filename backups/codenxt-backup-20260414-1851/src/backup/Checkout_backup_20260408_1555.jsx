import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Checkout() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length < 16) {
      setError("Please enter a valid card number.");
      return false;
    }
    if (!expiry.trim() || !/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Please enter expiry date in MM/YY format.");
      return false;
    }
    if (!cvc.trim() || cvc.length < 3) {
      setError("Please enter a valid CVC code.");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    setError(null);
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const stripe = window.Stripe('pk_live_XXXXXXXXXXXXXXXXXXXXXXXX'); // ← Bytt til din Publishable Key

      const { error: stripeError } = await stripe.redirectToCheckout({
        lineItems: [{ price: 'price_XXXXXXXXXXXXXXXXXXXXXXXX', quantity: 1 }], // ← Bytt til din Price ID
        mode: 'payment',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/checkout`,
        locale: 'en',
      });

      if (stripeError) setError(stripeError.message);
    } catch (err) {
      setError("An error occurred while processing the payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* codeTone Logo */}
      <div className="pt-12 pb-8 flex justify-center">
        <img 
          src="/codetone-logo.webp" 
          alt="codeTone Logo" 
          className="h-24 w-auto object-contain"
        />
      </div>

      <div className="max-w-md mx-auto px-6 pb-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">CHECKOUT</h1>
          <p className="text-gray-400 mt-2">Complete your order</p>
        </div>

        <div className="bg-[#111111] border border-gray-800 rounded-3xl p-8 space-y-8">
          
          <div>
            <label className="block text-xs text-gray-400 mb-2 tracking-widest">FULL NAME</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-cyan-400"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2 tracking-widest">EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-cyan-400"
              placeholder="you@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2 tracking-widest">ARTIST</label>
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl px-5 py-4 text-lg">artistNN</div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 tracking-widest">DATE</label>
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl px-5 py-4 text-lg">April 6, 2026</div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2 tracking-widest">VENUE</label>
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl px-5 py-4 text-lg">Oslo Spektrum</div>
          </div>

          {/* Payment Details */}
          <div className="pt-4 border-t border-gray-800">
            <label className="block text-xs text-gray-400 mb-4 tracking-widest">PAYMENT DETAILS</label>
            <div className="space-y-4">
              <input 
                type="text" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-cyan-400"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="bg-[#1a1a1a] border border-gray-700 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-cyan-400"
                />
                <input 
                  type="text" 
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="CVC"
                  className="bg-[#1a1a1a] border border-gray-700 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" className="accent-cyan-400 w-5 h-5" defaultChecked />
            <span 
              className="text-sm text-gray-400 cursor-pointer hover:text-white underline"
              onClick={() => setShowTermsModal(true)}
            >
              I accept the Terms and Conditions
            </span>
          </div>

          {/* Pay Button */}
          <button 
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full mt-6 bg-[#00f0ff] hover:bg-cyan-300 disabled:bg-gray-600 text-black font-semibold py-5 rounded-2xl text-xl transition-all active:scale-95"
          >
            {isLoading ? "Processing..." : "Pay $1490"}
          </button>

          {error && <p className="text-red-400 text-center text-sm mt-4">{error}</p>}
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-6">
          <div className="bg-[#111111] border border-gray-700 rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-center">Terms and Conditions</h2>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto text-gray-300 text-sm leading-relaxed">
              <p className="mb-4">By completing this purchase you agree to the following terms:</p>
              <p className="mb-4">• Tickets are non-refundable except as required by law.</p>
              <p className="mb-4">• You must present a valid photo ID matching the name on the ticket.</p>
              <p className="mb-4">• The organizer reserves the right to refuse entry for any reason.</p>
              <p className="mb-4">• All sales are final. No exchanges or cancellations.</p>
              <p>• Any unauthorized recording or commercial use of the event is strictly prohibited.</p>
            </div>

            <div className="p-6 border-t border-gray-700 flex gap-4">
              <button 
                onClick={() => setShowTermsModal(false)}
                className="flex-1 py-4 border border-gray-600 rounded-2xl font-medium hover:bg-gray-900"
              >
                Close
              </button>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="flex-1 py-4 bg-[#00f0ff] text-black font-semibold rounded-2xl hover:bg-cyan-300"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Checkout;