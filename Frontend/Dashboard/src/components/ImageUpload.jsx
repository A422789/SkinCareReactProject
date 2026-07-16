import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

export default function ImageUpload({ value, onChange, label = 'Image', compact = false }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => onChange(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{label}</label>}

      <div
        className={`drop-zone ${compact ? 'p-4' : 'p-6'} text-center cursor-pointer ${dragOver ? 'drag-over' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {value ? (
          <div className="flex items-center gap-4">
            <img
              src={value}
              alt="Preview"
              className={`${compact ? 'w-14 h-14' : 'w-20 h-20'} rounded-xl object-cover`}
              style={{ border: '1px solid var(--border)' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>Image selected</p>
              <p className="text-xs mt-1" style={{ color: 'var(--foreground-muted)' }}>Click or drag to replace</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="p-2 rounded-lg flex-shrink-0"
              style={{ color: 'var(--destructive)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} mx-auto mb-2`} style={{ color: 'var(--foreground-muted)' }} />
            <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
              Drag & drop an image, or click to browse
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--foreground-muted)' }}>PNG, JPG up to 5MB</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}
