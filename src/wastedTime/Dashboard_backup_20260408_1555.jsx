import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Dashboard() {
  const [soldTickets, setSoldTickets] = useState(3200);
  const [linkSent, setLinkSent] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const scans = Math.round(soldTickets * 0.79);
  const innerCircle = Math.round(soldTickets * 0.04);

  const handleSendLink = () => {
    setLinkSent(true);
    alert("✅ Link has been sent to the buyer's email.");
  };

  const handleUploadReward = () => {
    alert("✅ Reward uploaded successfully!");
    setShowUploadModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      
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
            
            {/* QR Code Box */}
            <div className="bg-[#111111] border border-gray-800 rounded-3xl p-10 flex flex-col">
              <div className="text-center mb-6">
                <div className="inline-block bg-cyan-400 text-black text-xs font-bold tracking-widest px-6 py-2 rounded-full mb-4">
                  EVENT QR CODE
                </div>
                <h2 className="text-2xl font-semibold">SCAN TO JOIN SESSION</h2>
              </div>

              <div className="flex justify-center mb-10">
                <div className="bg-white p-6 rounded-2xl">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=https://codetone.codenxt.global/join" 
                    alt="Event QR Code"
                    className="w-80 h-80 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Høyre kolonne */}
            <div className="flex flex-col gap-4">
              
              <button 
                onClick={() => setShowUploadModal(true)}
                className="w-full bg-[#00f0ff] hover:bg-[#00e0ee] text-black font-semibold py-6 rounded-3xl text-xl shadow-lg active:scale-95 transition-all"
              >
                UPLOAD REWARD
              </button>

              <button className="w-full bg-red-600 hover:bg-red-700 font-semibold py-5 rounded-3xl text-lg active:scale-95 transition-all">
                UNLOCK REWARD
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-emerald-500 hover:bg-emerald-600 font-semibold py-5 rounded-3xl text-lg active:scale-95 transition-all">
                  SEND TO SCREEN
                </button>
                <button className="bg-red-600 hover:bg-red-700 font-semibold py-5 rounded-3xl text-lg active:scale-95 transition-all">
                  STOP SCREEN
                </button>
              </div>

              <button className="w-full bg-gray-700 hover:bg-gray-600 font-semibold py-5 rounded-3xl text-lg active:scale-95 transition-all">
                PRINT QR CODE
              </button>

              <button className="w-full bg-gray-700 hover:bg-gray-600 font-semibold py-5 rounded-3xl text-lg active:scale-95 transition-all">
                SEND REPORT
              </button>

              {/* Stats - prosentene alignet til høyre */}
              <div className="bg-[#111111] border border-gray-800 rounded-3xl p-10 mt-6">
                <div className="space-y-10">
                  <div>
                    <div className="text-gray-400 text-sm mb-2">SOLD TICKETS * (required)</div>
                    <input 
                      type="number" 
                      value={soldTickets}
                      onChange={(e) => setSoldTickets(Number(e.target.value) || 0)}
                      min="0"
                      className="w-full bg-transparent text-6xl font-bold tracking-tighter focus:outline-none border-b border-gray-700 pb-3"
                    />
                  </div>

                  {/* Scans - aligned */}
                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="text-gray-400 text-sm">SCANS</div>
                      <div className="text-5xl font-bold tracking-tighter mt-1">{scans}</div>
                    </div>
                    <div className="text-emerald-400 text-4xl font-semibold">79%</div>
                  </div>

                  {/* Inner Circle - aligned */}
                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="text-gray-400 text-sm">INNER CIRCLE</div>
                      <div className="text-5xl font-bold tracking-tighter mt-1">{innerCircle}</div>
                    </div>
                    <div className="text-orange-400 text-4xl font-semibold">4%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Upload Reward Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-6">
          <div className="bg-[#111111] border border-gray-700 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            
            <div className="p-8 border-b border-gray-700">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-gray-500 text-[10px] leading-tight">
                    PLACE<br />ARTIST<br />LOGO<br />HERE
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-center">Upload New Reward</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Reward Title</label>
                <input type="text" placeholder="e.g. Exclusive Unreleased Track" className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-4" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea rows="3" placeholder="Personal message to your fans..." className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-4" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">File Upload</label>
                <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-cyan-400 cursor-pointer">
                  <p className="text-gray-400 font-medium">Click to upload or drag & drop</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supported: MP3, WAV, MP4, JPG, PNG, PDF (Setlist, Lyrics etc.)
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Maximum size: 100 MB
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Reward Type</label>
                <select className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-4">
                  <option value="static">Static (One-time reward)</option>
                  <option value="dynamic">Dynamic (Reusable multiple times)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <label className="flex items-start gap-3 text-sm text-gray-400">
                  <input 
                    type="checkbox" 
                    checked={acceptedUploadTerms || false}
                    onChange={(e) => setAcceptedUploadTerms(e.target.checked)}
                    className="mt-1 accent-cyan-400"
                  />
                  <span>
                    I confirm that I am the legal rights holder of this content and that it does not contain any illegal, 
                    infringing, or offensive material. I accept full legal responsibility for the content I upload.
                  </span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex gap-4">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-4 border border-gray-600 rounded-2xl font-medium hover:bg-gray-900"
              >
                Cancel
              </button>
              <button 
                onClick={handleUploadReward}
                className="flex-1 py-4 bg-[#00f0ff] text-black font-semibold rounded-2xl hover:bg-[#00e0ee]"
              >
                Upload Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;