import { useState, useEffect } from 'react';

function EventPage() {
  const [orderId, setOrderId] = useState("UNKNOWN");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const id = hash.startsWith('event/') ? hash.split('/')[1] : 
               window.location.pathname.startsWith('/event/') ? window.location.pathname.split('/')[2] : "UNKNOWN";
    setOrderId(id);
  }, []);

  const handleJoin = () => {
    setJoined(true);
    alert("Welcome! You are now part of the exclusive live session.");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-zinc-900 px-6 py-2 rounded-full mb-8">
            <span className="text-emerald-400">●</span>
            <span className="text-sm font-medium tracking-widest">EXCLUSIVE SESSION</span>
          </div>

          <h1 className="text-6xl font-bold tracking-tighter leading-none mb-8">
            BE OUR<br />EXCLUSIVE GUEST
          </h1>
          <p className="text-gray-400 text-lg">
            You have successfully scanned the code.<br />
            Join the private live experience now.
          </p>
        </div>

        {!joined ? (
          <button
            onClick={handleJoin}
            className="w-full py-8 bg-[#00F0FF] hover:bg-white text-black font-semibold text-2xl rounded-3xl transition-all active:scale-95"
          >
            JOIN
          </button>
        ) : (
          <div className="py-16">
            <div className="text-7xl mb-8">🎉</div>
            <h2 className="text-5xl font-bold">You're in!</h2>
            <p className="text-emerald-400 text-xl mt-4">Welcome to the exclusive session</p>
          </div>
        )}

        <p className="text-xs text-gray-600 mt-20">
          Order ID: {orderId}
        </p>
      </div>
    </div>
  );
}

export default EventPage;