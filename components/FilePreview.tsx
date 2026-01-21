
import React from 'react';
import { UploadedFile } from '../types';

interface FilePreviewProps {
  file: UploadedFile;
  onClear: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onClear }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="relative group overflow-hidden rounded-2xl aspect-video border border-slate-200 bg-slate-100 flex items-center justify-center">
        <img 
          src={file.dataUrl} 
          alt={file.name} 
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={() => window.open(file.dataUrl, '_blank')}
            className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-all"
          >
            View Full Size
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <h3 className="font-semibold text-slate-800 truncate max-w-[200px]">{file.name}</h3>
            <p className="text-xs text-slate-400 font-medium">
              {formatSize(file.size)} • {new Date(file.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onClear}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Remove image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <button
        onClick={onClear}
        className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98]"
      >
        Upload New Image
      </button>
    </div>
  );
};
