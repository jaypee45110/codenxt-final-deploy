import React, { useState, useEffect } from 'react';
import BadgeGeneratorModal from './components/BadgeGeneratorModal';

export default function BadgeTestPage() {
  const [open, setOpen] = useState(false);
  const [eventData, setEventData] = useState({});

  useEffect(() => {
    try {
      setEventData(JSON.parse(localStorage.getItem('codenxt_event') || '{}'));
    } catch {
      setEventData({});
    }
  }, []);  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <button onClick={() => setOpen(true)}>
        OPEN BADGE GENERATOR
      </button>

      <BadgeGeneratorModal
        open={open}
        onClose={() => setOpen(false)}
        artistName={eventData?.artistName || 'Artist / Event Name'}
                onSave={(config) => {
          console.log('BADGE CONFIG:', config);
          alert('Saved — check console');
        }}
      />
    </div>
  );
}