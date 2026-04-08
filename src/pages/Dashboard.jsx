import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Dashboard() {
  const [soldTickets, setSoldTickets] = useState(3200);
  const [linkSent, setLinkSent] = useState(false);

  const scans = Math.round(soldTickets * 0.79);
  const innerCircle = Math.round(soldTickets * 0.04);

  const handleSendLink = () => {
    setLinkSent(true);
    alert("✅ Link has been sent to the buyer's email.\n\nIt will be active from 09:00 on April 25, 2026 until 04:00 on April 26, 2026.");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      
      {/* Header */}
      <header className="pt-12 pb-8 flex justify-center bg-[#0a0a0a]">
        <img 
          src="/codetone-logo.webp" 
          alt="codeTone Logo" 
          className="h-40 w-auto object-contain drop-shadow-2xl"
        />
      </header>

      <div className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full">
        
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter leading-none">
            CONTROL CENTER
          </h1>
          <p className="text-gray-400 mt-4 text-2xl">
            artistNN — Oslo Spektrum — April 25, 2026
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
            
            {/* Venstre: QR Code Box */}
            <div className="bg-[#111111] border border-gray-800 rounded-3xl p-10 flex flex-col">
              <div className="text-center mb-6">
                <div className="inline-block bg-cyan-400 text-black text-xs font-bold tracking-widest px-6 py-2 rounded-full mb-4">
                  EVENT QR CODE
                </div>
                <h2 className="text-2xl font-semibold">SCAN TO JOIN SESSION</h2>
              </div>

              {/* QR-kode som peker til /join */}
              <div className="flex justify-center mb-10">
                <div className="bg-white p-6 rounded-2xl">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=http://localhost:5173/join" 
                    alt="Event QR Code"
                    className="w-80 h-80 object-contain"
                  />
                </div>
              </div>

              {/* Tidsvindu */}
              <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-8 text-center">
                <p className="text-sm text-gray-400 mb-1">Link is active:</p>
                <p className="font-medium">
                  April 25, 2026 — 09:00 until April 26, 2026 — 04:00
                </p>
                <div className="inline-block mt-4 px-6 py-1.5 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400">
                  ● ACTIVE
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <button 
                  onClick={handleSendLink}
                  className="bg-[#00f0ff] hover:bg-[#00e0ee] text-black font-semibold py-5 rounded-2xl text-lg transition-all active:scale-95"
                >
                  {linkSent ? "Link Sent ✓" : "Send Link to Buyer’s Email"}
                </button>

                <button className="border border-gray-600 hover:bg-gray-900 font-medium py-5 rounded-2xl text-lg transition-all">
                  Generate New QR Code & Link
                </button>
              </div>
            </div>

            {/* Høyre: Stats & Actions */}
            <div className="flex flex-col gap-6">
              <button className="w-full bg-[#00f0ff] hover:bg-[#00e0ee] text-black font-semibold py-5 rounded-3xl text-xl transition-all active:scale-95">
                UPLOAD REWARD
              </button>

              <div className="bg-[#111111] border border-gray-800 rounded-3xl p-10 flex-1 flex flex-col">
                <div className="space-y-10 flex-1">
                  <div>
                    <div className="text-gray-400 text-sm mb-2">SOLD TICKETS</div>
                    <input 
                      type="number" 
                      value={soldTickets}
                      onChange={(e) => setSoldTickets(Number(e.target.value) || 0)}
                      className="w-full bg-transparent text-6xl font-bold tracking-tighter focus:outline-none border-b border-gray-700 pb-3"
                    />
                  </div>

                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="text-gray-400 text-sm">SCANS</div>
                      <div className="text-5xl font-bold tracking-tighter mt-1">{scans}</div>
                    </div>
                    <div className="text-emerald-400 text-right">
                      <div className="text-3xl font-semibold">79%</div>
                      <div className="text-xs">of tickets</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="text-gray-400 text-sm">INNER CIRCLE</div>
                      <div className="text-5xl font-bold tracking-tighter mt-1">{innerCircle}</div>
                    </div>
                    <div className="text-orange-400 text-right">
                      <div className="text-3xl font-semibold">4%</div>
                      <div className="text-xs">of tickets</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-emerald-500 hover:bg-emerald-600 font-semibold py-5 rounded-3xl text-lg transition-all active:scale-95">
                  START
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 font-semibold py-5 rounded-3xl text-lg transition-all active:scale-95">
                  STOP
                </button>
                <button className="bg-red-600 hover:bg-red-700 font-semibold py-5 rounded-3xl text-lg transition-all col-span-2 active:scale-95">
                  UNLOCK REWARD
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 font-semibold py-5 rounded-3xl text-lg transition-all col-span-2 active:scale-95">
                  SEND REPORT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;