import React from 'react';

export default function Loader({ fullScreen = false }) {
  const containerStyle = fullScreen ? {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--background)',
    color: 'var(--gold)',
    gap: '1rem',
  } : {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: 'var(--gold)',
    padding: '2rem 0',
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }} className="bouncing-loader">
        <span style={{ width: '8px', height: '8px', backgroundColor: 'currentColor', borderRadius: '50%', display: 'inline-block', animation: 'bounce-dots 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}></span>
        <span style={{ width: '8px', height: '8px', backgroundColor: 'currentColor', borderRadius: '50%', display: 'inline-block', animation: 'bounce-dots 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}></span>
        <span style={{ width: '8px', height: '8px', backgroundColor: 'currentColor', borderRadius: '50%', display: 'inline-block', animation: 'bounce-dots 1.4s infinite ease-in-out both' }}></span>
      </div>
      {fullScreen && <p className="font-serif animate-pulse text-sm" style={{ color: 'var(--foreground)' }}>Loading your skincare ritual...</p>}
      <style>{`
        @keyframes bounce-dots {
          0%, 80%, 100% { 
            transform: translateY(0);
            opacity: 0.3;
          }
          40% { 
            transform: translateY(-6px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
