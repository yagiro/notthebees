import { useCallback, useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import { calculateHash } from '@/utils/hash';

interface FileHashInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function FileHashInput({ value, onChange }: FileHashInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hashCalculating, setHashCalculating] = useState(false);

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    setHashCalculating(true);
    
    try {
      const hash = await calculateHash(file);
      onChange(hash);
      console.log('Calculated hash:', hash);
    } catch (error) {
      console.error('Error calculating hash:', error);
    } finally {
      setHashCalculating(false);
    }
  }, [onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
        Search by File Hash
      </label>
      <div
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`comic-box relative p-6 transition-all duration-200 ease-in-out ${
          isDragging 
            ? 'bg-[var(--primary)]/10 border-[var(--primary)]' 
            : 'bg-[var(--form-background)] hover:bg-[var(--secondary)]/5'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={`p-3 rounded-full ${
            isDragging ? 'bg-[var(--primary)]/20' : 'bg-[var(--secondary)]/20'
          } transition-colors duration-200`}>
            <ArrowUpTrayIcon className={`h-8 w-8 ${
              isDragging ? 'text-[var(--primary)]' : 'text-[var(--secondary)]'
            } transition-colors duration-200`} />
          </div>
          <span className={`text-sm font-medium ${
            isDragging ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'
          } transition-colors duration-200`}>
            {hashCalculating ? 'Calculating hash...' : 'Drag and drop a file here'}
          </span>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`mt-4 w-full px-4 py-2.5 border-2 border-[var(--text-primary)] rounded-lg text-sm transition-all duration-200
            ${hashCalculating 
              ? 'bg-[var(--secondary)]/10 text-[var(--text-muted)] cursor-not-allowed' 
              : 'bg-[var(--input-background)] text-white hover:border-[var(--primary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20'
            }
            outline-none`}
          placeholder="Or enter file hash manually..."
          readOnly={hashCalculating}
        />
      </div>
    </div>
  );
} 