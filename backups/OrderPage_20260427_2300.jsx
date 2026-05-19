import { useState } from 'react';

function OrderPage({ navigate, completeOrder }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    artist: '',
    eventDate: '',
    venue: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.artist) {
      alert("Please fill in Name, Email and Artist.");
      return;
    }

    // Enkel email-validering
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address (must contain @).");
      return;
    }

    completeOrder(formData);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Logo midtstilt i topp */}
        <div className="flex justify-center mb-12">
          <img src="/codenxt-logo.webp" alt="codeNXT" className="h-20 w-auto" onError={(e) => e.target.style.display = 'none'} />
        </div>

        <h1 className="text-5xl font-bold mb-10 text-center">Order Control Center</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-gray-400 mb-2">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-[#00F0FF]"
              required 
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-[#00F0FF]"
              required 
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Artist</label>
            <input 
              type="text" 
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-[#00F0FF]"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">Event Date</label>
              <input 
                type="date" 
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-[#00F0FF]"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Venue</label>
              <input 
                type="text" 
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-[#00F0FF]"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-7 bg-[#00F0FF] hover:bg-white text-black font-semibold text-2xl rounded-3xl transition-all mt-8"
          >
            Continue to Payment
          </button>
        </form>

        <button 
          onClick={() => navigate('')}
          className="mt-8 text-gray-400 hover:text-white block mx-auto"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default OrderPage;