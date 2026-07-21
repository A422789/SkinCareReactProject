import React from 'react';

export default function Loader({ className = "" }) {
  return (
    <div className={`bouncing-loader ${className}`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
