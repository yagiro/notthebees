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
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Search by File Hash
      </label>
      <div
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-md p-4 transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <ArrowUpTrayIcon className="h-6 w-6 text-gray-400" />
          <span className="text-sm text-gray-500">
            {hashCalculating ? 'Calculating hash...' : 'Drag and drop a file here'}
          </span>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full px-4 py-2 border rounded-md"
          placeholder="Or enter file hash manually..."
          readOnly={hashCalculating}
        />
      </div>
    </div>
  );
} 