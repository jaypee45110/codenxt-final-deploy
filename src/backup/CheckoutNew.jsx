import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CheckoutNew() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0b0b',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Checkout OK</h1>
        <p>This is the new working checkout.</p>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginTop: '20px',
            padding: '12px 20px',
            background: '#00f0ff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Go to dashboard
        </button>
      </div>
    </div>
  );
}