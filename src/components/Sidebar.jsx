import { useState } from 'react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'events', label: 'Events', icon: '🎤' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'profile', label: 'Profil', icon: '👤' },
];

function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div className="w-72 bg-[#0f0f0f] border-r border-gray-800 h-screen fixed left-0 top-0 p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#00F0FF] text-black font-bold text-3xl flex items-center justify-center rounded-xl">
            C
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tighter">codeNXT</div>
            <div className="text-xs text-gray-500 -mt-0.5">Artist Platform</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all
              ${activeItem === item.id 
                ? 'bg-[#00F0FF] text-black font-medium' 
                : 'hover:bg-[#1f1f1f] text-gray-400 hover:text-white'
              }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-lg">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Profile */}
      <div className="pt-8 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#1f1f1f]">
          <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <div className="font-medium text-white">Jan Paulsen</div>
            <div className="text-xs text-gray-500">Artist</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;