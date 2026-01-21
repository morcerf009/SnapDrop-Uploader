
import React, { useRef } from 'react';

interface DropZoneProps {
  isDragging: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
}

export const DropZone: React.FC<DropZoneProps> = ({ 
  isDragging, 
  onDrop, 
  onDragOver, 
  onDragLeave, 
  onFileSelect,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={`
        relative group cursor-pointer
        flex flex-col items-center justify-center
        w-full h-64 border-2 border-dashed rounded-2xl
        transition-all duration-300 ease-in-out
        ${isDragging 
          ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' 
          : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'}
      `}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={onFileSelect}
        className="hidden" 
        accept="image/png, image/jpeg, image/gif"
      />
      
      <div className={`
        p-4 rounded-full transition-colors duration-300
        ${isDragging ? 'bg-blue-100' : 'bg-slate-100 group-hover:bg-blue-50'}
      `}>
        <svg 
          className={`w-10 h-10 ${isDragging ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>

      <div className="mt-4 text-center">
        <p className="text-lg font-medium text-slate-700">
          {isDragging ? 'Drop to upload' : 'Drag & drop image here'}
        </p>
        <p className="text-sm text-slate-400 mt-1">
          or <span className="text-blue-600 font-semibold underline underline-offset-4 decoration-2">browse files</span>
        </p>
      </div>

      <p className="absolute bottom-6 text-xs text-slate-400 uppercase tracking-widest font-bold">
        PNG, JPG, GIF up to 5MB
      </p>

      {error && (
        <div className="absolute -bottom-10 left-0 right-0 text-center text-red-500 text-sm font-medium animate-pulse">
          {error}
        </div>
      )}
    </div>
  );
};
