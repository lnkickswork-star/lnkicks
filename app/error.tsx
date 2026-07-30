'use client';

import React from 'react';

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: "'Inter', sans-serif", background: '#ffffff', minHeight: '100vh' }}>
      <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, color: '#111111' }}>Something went wrong!</h2>
      <p style={{ fontSize: '14px', color: '#777777', margin: '12px 0 24px' }}>{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={() => reset()} style={{ padding: '14px 32px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
        TRY AGAIN
      </button>
    </div>
  );
}
