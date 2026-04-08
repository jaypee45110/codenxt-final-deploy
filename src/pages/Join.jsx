import React, { useState } from 'react';
import Footer from '../components/Footer';

function Join() {
  const [phoneNumber, setPhoneNumber] = useState('+47 412 34 567'); // Automatisk forhåndsutfylt
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleJoin = () => {
    if (phoneNumber.trim().length > 8) {
      setSubmitted(true);
      setTimeout(() => {
        alert("🎉 Welcome to the Inner Circle!\n\nYou will now receive exclusive content, updates and direct messages from the artist.");
        setShowModal(false);
      }, 800);
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      
      {/* Top info */}
      <div className="pt-16 pb-8 text-center">
        <p className="text-gray-400 text-lg">
          artistNN — Oslo Spektrum — April 25, 2026
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-8 py-3 rounded-full mb-8">
              <span className="text-emerald-400 text-xl">✦</span>
              <span className="uppercase tracking-[4px] text-sm font-medium">Exclusive Access</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold leading-none tracking-tighter mb-6">
              EXCLUSIVE<br />INVITATION
            </h1>

            <p className="text-xl text-gray-400 max-w-md mx-auto">
              You have been personally invited to join the artist’s private Inner Circle.
            </p>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="w-full bg-[#00f0ff] hover:bg-[#00e0ee] text-black font-semibold text-2xl py-8 rounded-3xl shadow-2xl shadow-cyan-500/50 active:scale-95 transition-all"
          >
            JOIN INNER CIRCLE
          </button>

          <p className="mt-10 text-sm text-gray-500">
            This is a private community. Only invited fans can join.
          </p>
        </div>
      </div>

      {/* GDPR-compliant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-6">
          <div className="bg-[#111111] border border-gray-700 rounded-3xl p-10 max-w-md w-full">
            {!submitted ? (
              <>
                <h2 className="text-3xl font-semibold text-center mb-6">
                  Join the Inner Circle
                </h2>
                
                <p className="text-gray-400 text-center mb-8">
                  Enter your mobile number to receive exclusive audio, video, photos and personal messages directly from the artist.
                </p>

                {/* Automatisk utfylt mobilnummer */}
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-2xl px-6 py-5 text-xl text-center focus:outline-none focus:border-cyan-400 mb-8"
                />

                {/* GDPR samtykke */}
                <div className="text-xs text-gray-500 leading-relaxed mb-8 px-2">
                  By joining, you consent to receiving direct communications from the artist via SMS and other channels. 
                  You can unsubscribe at any time. We respect your privacy and will only use your number for Inner Circle purposes. 
                  Read our <span className="text-cyan-400 underline">Privacy Policy</span>.
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-5 border border-gray-600 rounded-2xl font-medium hover:bg-gray-900 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleJoin}
                    className="flex-1 py-5 bg-[#00f0ff] hover:bg-[#00e0ee] text-black font-semibold rounded-2xl transition-all active:scale-95"
                  >
                    JOIN NOW
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="text-3xl font-semibold mb-4">Welcome to the Inner Circle</h2>
                <p className="text-gray-400 mb-8">You will now receive exclusive updates directly from the artist.</p>
                
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-10 py-4 bg-white text-black rounded-2xl font-semibold"
                >
                  Back to Home
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Join;