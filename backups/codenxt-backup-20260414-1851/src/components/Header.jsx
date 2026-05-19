import React from 'react';

const Header = () => {
  return (
    <header className="bg-[#0a0a0a] border-b border-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        {/* codeTone Logo – stor og sentral */}
        <div className="flex items-center">
          <img 
            src="/codetone-logo.webp" 
            alt="codeTone Logo" 
            className="h-24 w-auto object-contain"   // Stor logo – h-24 gir god størrelse
          />
        </div>

        {/* Navigasjon – kan utvides senere */}
        <nav className="flex items-center gap-8 text-sm text-gray-300">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
          <a href="/checkout" className="hover:text-white transition-colors">Checkout</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;