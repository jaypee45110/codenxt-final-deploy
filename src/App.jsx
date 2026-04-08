import React from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden flex flex-col">
      
      {/* Header – stor midtstilt logo */}
      <header className="pt-12 pb-8 flex justify-center bg-[#0a0a0a]">
        <img 
          src="/codetone-logo.webp" 
          alt="codeTone Logo" 
          className="h-40 w-auto object-contain drop-shadow-2xl"
        />
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center -mt-8">
        
        <h1 className="text-7xl md:text-[5.5rem] font-bold leading-none tracking-tighter mb-6">
          Get your own<br />
          <span className="text-[#00f0ff]">Control Center</span>
        </h1>

        <div className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-20 leading-relaxed">
          <p className="mb-8">
            codeTone empowers artists to build and own their <span className="text-white font-medium">InnerCircle</span> — 
            a private, direct-to-fan community where true supporters receive exclusive audio, video, photos, and text messages.
          </p>
          
          <p className="mb-8">
            For your audience: Join the InnerCircle to get instant, intimate access to unreleased tracks, behind-the-scenes videos, 
            personal updates, and private conversations — all delivered straight from the artist, bypassing social media algorithms.
          </p>
          
          <p className="mb-8">
            For the artist: The flow is simple. Upload your content once, choose who receives it, and communicate directly with your most dedicated fans through one controlled platform.
          </p>
          
          <p className="mb-12">
            Take full ownership of your fan database. Speak directly to your audience without intermediaries, build deeper loyalty, and create sustainable revenue — all while keeping complete control of your data and relationships.
          </p>
        </div>

        {/* Button now uses React Router Link */}
        <Link 
          to="/checkout"
          className="inline-flex items-center justify-center bg-[#00f0ff] hover:bg-[#00e0ee] transition-all text-black font-semibold text-xl px-16 py-6 rounded-3xl shadow-2xl shadow-cyan-500/50 active:scale-95"
        >
          Order your Control Center now →
        </Link>
      </div>

      <Footer />
    </div>
  );
}

export default App;