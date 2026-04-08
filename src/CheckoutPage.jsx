import { useState } from 'react';

function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: "Jan Paulsen",
    email: "jan@example.com",
    artistName: "artistNN",
    eventDate: "April 6, 2026",
    venue: "Oslo Spektrum",
    cardNumber: "4242 4242 4242 4242",
    expiryDate: "12/28",
    cvc: "123",
    acceptTerms: true,
  });

  const price = 1490;

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "acceptTerms" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newOrderId = `ORD-TEST${Date.now().toString().slice(-6)}`;
    
    alert(`Payment Successful!\n\nOrder ID: ${newOrderId}\n\nRedirecting to Dashboard...`);

    window.location.hash = `/dashboard/${newOrderId}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12">
      <div className="max-w-lg mx-auto px-6">
        <div className="flex justify-center mb-8">
          <img src="/codenxt-logo.webp" alt="codeNXT" className="h-12 w-auto" onError={(e) => e.target.style.display = 'none'} />
        </div>

        <h1 className="text-4xl font-bold text-center mb-2">CHECKOUT</h1>
        <p className="text-center text-gray-400 mb-10">Complete your order</p>

        <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-3xl p-8 space-y-6">
          <div>
            <label className="block text-xs text-gray-500 mb-1">FULL NAME</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-3 text-white" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">EMAIL</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-3 text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">ARTIST</label>
              <input type="text" name="artistName" value={formData.artistName} onChange={handleChange} className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-3 text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">DATE</label>
              <input type="text" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-3 text-white" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">VENUE</label>
            <input type="text" name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-3 text-white" />
          </div>

          <div className="pt-4 border-t border-zinc-700">
            <h3 className="text-sm font-medium mb-4">PAYMENT DETAILS</h3>
            <div className="space-y-4">
              <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="Card number" className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-3 text-white" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="MM/YY" className="bg-black border border-zinc-700 rounded-2xl px-5 py-3 text-white" />
                <input type="text" name="cvc" value={formData.cvc} onChange={handleChange} placeholder="CVC" className="bg-black border border-zinc-700 rounded-2xl px-5 py-3 text-white" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input 
              type="checkbox" 
              name="acceptTerms" 
              checked={formData.acceptTerms} 
              onChange={handleChange}
              className="accent-[#00F0FF]"
            />
            <span className="text-sm text-gray-400">I accept the Terms and Conditions</span>
          </div>

          <button 
            type="submit"
            className="w-full mt-6 py-7 bg-[#00F0FF] hover:bg-white text-black font-semibold text-xl rounded-3xl transition-all"
          >
            Pay ${price}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;