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
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        Search by File Hash
      </label>
      <div
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border rounded-lg p-6 transition-all duration-200 ease-in-out ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]' 
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={`p-3 rounded-full ${
            isDragging ? 'bg-blue-100' : 'bg-gray-100'
          } transition-colors duration-200`}>
            <ArrowUpTrayIcon className={`h-8 w-8 ${
              isDragging ? 'text-blue-500' : 'text-gray-500'
            } transition-colors duration-200`} />
          </div>
          <span className={`text-sm font-medium ${
            isDragging ? 'text-blue-600' : 'text-gray-600'
          } transition-colors duration-200`}>
            {hashCalculating ? 'Calculating hash...' : 'Drag and drop a file here'}
          </span>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`mt-4 w-full px-4 py-2.5 border rounded-md text-sm transition-all duration-200
            ${hashCalculating 
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
              : 'bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }
            outline-none shadow-sm`}
          placeholder="Or enter file hash manually..."
          readOnly={hashCalculating}
        />
      </div>
    </div>
  );
} 