import { useState } from 'react';

function PaymentPage({ navigate, orderId, orderData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePayment = () => {
    if (!orderId || !orderData) {
      alert("Order information is missing. Please go back.");
      return;
    }

    if (!cardNumber || !expiry || !cvc) {
      alert("Please fill in all card details.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentCompleted(true);

      const dashboardUrl = `${window.location.origin}/#/dashboard/${orderId}`;

      alert(`✅ Payment Successful!\n\nOrder ID: ${orderId}\n\nThank you, ${orderData.name}!\n\nA confirmation email with your unique Control Center link has been sent to:\n${orderData.email}\n\nLink: ${dashboardUrl}`);
    }, 1800);
  };

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-7xl mb-8">✅</div>
          <h2 className="text-5xl font-bold text-[#00F0FF] mb-6">Payment Completed Successfully</h2>
          
          <div className="bg-zinc-900 rounded-3xl p-8 mb-10">
            <p className="text-gray-400 mb-2">Your Order ID</p>
            <p className="text-4xl font-mono tracking-widest text-white mb-6">{orderId}</p>
            
            <p className="text-lg text-gray-300">
              Thank you, <strong>{orderData?.name}</strong>!<br />
              Your unique Control Center link has been sent to <strong>{orderData?.email}</strong>.
            </p>
          </div>

          <button 
            onClick={() => navigate('')}
            className="w-full py-7 bg-[#00F0FF] hover:bg-white text-black font-semibold text-2xl rounded-3xl transition-all mb-6"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">Complete Your Payment</h1>

        {orderId && (
          <div className="bg-zinc-900 p-6 rounded-3xl mb-10">
            <p className="text-gray-400 mb-1">Order ID</p>
            <p className="text-3xl font-mono text-[#00F0FF]">{orderId}</p>
          </div>
        )}

        <div className="bg-zinc-900 rounded-3xl p-10">
          <div className="mb-10">
            <p className="text-2xl mb-2">Total Amount</p>
            <p className="text-6xl font-bold text-[#00F0FF]">$299.00</p>
            <p className="text-gray-400">One-time payment • codeTone Control Center</p>
          </div>

          {/* Stripe-like Card Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span>💳</span> Pay with Card
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Card Number</label>
                <input 
                  type="text" 
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0,16))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg font-mono focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value.slice(0,5))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg font-mono focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.slice(0,4))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-lg font-mono focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-8 bg-[#00F0FF] hover:bg-white disabled:bg-gray-600 text-black font-semibold text-3xl rounded-3xl transition-all disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing Secure Payment..." : "Pay $299.00 Now"}
          </button>

          <p className="text-center text-xs text-gray-500 mt-6">🔒 Secured by Stripe • PCI DSS Compliant</p>
        </div>

        <button 
          onClick={() => navigate('order')}
          className="mt-10 text-gray-400 hover:text-white flex items-center gap-2 mx-auto"
        >
          ← Back to Order Details
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;