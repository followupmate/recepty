'use client';

import { useRef, useState } from 'react';

export default function UploadEntryCard({ onFileSelected, title = 'Pridať recept z fotky', subtitle = 'Ťukni sem alebo sem pretiahni obrázok.' }) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const pickFile = () => fileInputRef.current?.click();

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div
      className={`upload-entry ${dragging ? 'upload-entry--drag' : ''}`}
      onClick={pickFile}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => event.key === 'Enter' && pickFile()}
    >
      <p className="upload-entry__title">{title}</p>
      <p className="upload-entry__subtitle">{subtitle}</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelected(file);
        }}
        hidden
      />
    </div>
  );
}
