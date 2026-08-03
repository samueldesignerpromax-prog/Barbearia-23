import React from 'react';

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #333',
        borderTopColor: '#d4af37',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
