
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UploadedFile, UploadStatus } from './types';
import { DropZone } from './components/DropZone';
import { ProgressBar } from './components/ProgressBar';
import { FilePreview } from './components/FilePreview';
import { HistoryItem } from './components/HistoryItem';

const STORAGE_KEY = 'snapdrop_last_upload';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function App() {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load last upload from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFile(JSON.parse(saved));
        setStatus(UploadStatus.SUCCESS);
      } catch (e) {
        console.error("Failed to parse stored image", e);
      }
    }
  }, []);

  const handleFileUpload = (rawFile: File) => {
    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(rawFile.type)) {
      setError('Unsupported file type. Please upload a JPG, PNG, or GIF.');
      setStatus(UploadStatus.ERROR);
      return;
    }

    if (rawFile.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB limit.');
      setStatus(UploadStatus.ERROR);
      return;
    }

    // Reset state for new upload
    setError(null);
    setStatus(UploadStatus.UPLOADING);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: rawFile.name,
        size: rawFile.size,
        type: rawFile.type,
        dataUrl: dataUrl,
        timestamp: Date.now(),
      };

      // Simulate Progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 30;
        if (currentProgress >= 100) {
          currentProgress = 100;
          setProgress(100);
          clearInterval(interval);

          // Finish upload
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedFile));
          } catch (err) {
            console.error("Failed to save to localStorage:", err);
            // We don't fail the upload status, but maybe warn? 
            // For now, just logging is safe, or we could set a specific 'warning' state.
            // Given the requirements, just successfully displaying it is key.
          }
          setFile(uploadedFile);
          setStatus(UploadStatus.SUCCESS);
        } else {
          setProgress(Math.floor(currentProgress));
        }
      }, 300);
    };

    reader.onerror = () => {
      setError('Error reading file.');
      setStatus(UploadStatus.ERROR);
    };

    reader.readAsDataURL(rawFile);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileUpload(droppedFile);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileUpload(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setStatus(UploadStatus.IDLE);
    setProgress(0);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SnapDrop</h1>
          <p className="text-slate-500 mt-2">Upload your images with a simple drag and drop</p>
        </header>

        {status === UploadStatus.UPLOADING ? (
          <div className="py-12 px-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Uploading your image...</span>
              <span className="text-sm font-medium text-blue-600">{progress}%</span>
            </div>
            <ProgressBar progress={progress} />
          </div>
        ) : file && status === UploadStatus.SUCCESS ? (
          <FilePreview file={file} onClear={clearFile} />
        ) : (
          <DropZone
            isDragging={isDragging}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onFileSelect={onFileSelect}
            error={error}
          />
        )}

        <footer className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              Secure
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Fast Upload
            </span>
          </div>
        </footer>
      </div>

      {/* Persistence Hint */}
      {file && (
        <div className="mt-6 animate-bounce text-slate-400 text-sm font-medium">
          Saved to localStorage ✨
        </div>
      )}
    </div>
  );
}
