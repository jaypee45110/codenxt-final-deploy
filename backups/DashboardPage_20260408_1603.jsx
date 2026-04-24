import { useState } from 'react';

function DashboardPage() {
  const orderId = "ORD-TEST202373";   // Fast ID for testing
  const [soldTickets] = useState(3420);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <img src="/codenxt-logo.webp" alt="codeNXT" className="h-10" onError={(e) => e.target.style.display = 'none'} />
            <div className="text-4xl font-bold tracking-tighter">CONTROL CENTER</div>
          </div>
          <div className="font-mono text-[#00F0FF]">ID: {orderId}</div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold tracking-tighter">artistNN</h1>
          <p className="text-2xl text-gray-400 mt-4">Live Session Experience — Oslo Spektrum — April 6, 2026</p>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-12 text-center">
          <p className="text-xl mb-8">Dette er en testversjon av dashboardet.</p>
          
          <div className="bg-white p-8 rounded-2xl inline-block mb-10">
            <p className="text-black text-2xl font-mono">QR Code will be here</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <button onClick={() => alert("START klikket")} className="py-6 bg-[#00F0FF] text-black font-semibold rounded-3xl">
              START
            </button>
            <button onClick={() => alert("COPY LINK klikket")} className="py-6 border border-zinc-600 hover:bg-zinc-800 rounded-3xl">
              COPY LINK
            </button>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          Order ID: {orderId} • Static Test Mode
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;