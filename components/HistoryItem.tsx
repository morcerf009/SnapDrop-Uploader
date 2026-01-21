
import React from 'react';
import { UploadedFile } from '../types';

interface HistoryItemProps {
  file: UploadedFile;
  onClick: (file: UploadedFile) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ file, onClick }) => {
  return (
    <div 
      onClick={() => onClick(file)}
      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
    >
      <img src={file.dataUrl} className="w-10 h-10 rounded object-cover border border-slate-200" alt="" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
      </div>
    </div>
  );
};
