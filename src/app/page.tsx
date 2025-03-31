'use client';

import { useState, useEffect, useCallback } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, MagnifyingGlassIcon, ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import { searchSubtitles, getLanguages, downloadSubtitle } from './actions';
import { Subtitle, Language } from '@/types/subtitles';
import { calculateHash } from '@/utils/hash';

// Function to calculate file hash (first and last 8KB)
async function calculateFileHash(file: File): Promise<string> {
  try {
    const hash = await calculateHash(file);
    return hash;
  } catch (error) {
    console.error('Error calculating hash:', error);
    throw error;
  }
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
  const [results, setResults] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [languageSearch, setLanguageSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hashCalculating, setHashCalculating] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      const languagesData = await getLanguages();
      setLanguages(languagesData);
    };
    fetchLanguages();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await searchSubtitles({
        query,
        fileHash,
        languages: selectedLanguages.map(lang => lang.code),
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error searching subtitles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId: number) => {
    setDownloading(fileId);
    try {
      const { fileName, content } = await downloadSubtitle(fileId);
      
      // Create a blob from the content
      const blob = new Blob([content], { type: 'text/plain' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading subtitle:', error);
    } finally {
      setDownloading(null);
    }
  };

  const handleFileDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    setHashCalculating(true);
    
    try {
      const hash = await calculateFileHash(file);
      setFileHash(hash);
      console.log('Calculated hash:', hash);
    } catch (error) {
      console.error('Error calculating hash:', error);
    } finally {
      setHashCalculating(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    lang.code.toLowerCase().includes(languageSearch.toLowerCase())
  );

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Subtitle Search</h1>
        
        <div className="space-y-6">
          {/* Text Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Text
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter search text..."
            />
          </div>

          {/* File Hash Search with Drag & Drop */}
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
                value={fileHash}
                onChange={(e) => setFileHash(e.target.value)}
                className="mt-2 w-full px-4 py-2 border rounded-md"
                placeholder="Or enter file hash manually..."
                readOnly={hashCalculating}
              />
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Languages
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 border rounded-md text-left"
              >
                <span className="block truncate">
                  {selectedLanguages.length > 0
                    ? selectedLanguages.map(lang => lang.name).join(', ')
                    : 'Select languages...'}
                </span>
              </button>
              
              {isOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-md">
                  {/* Language Search Input */}
                  <div className="sticky top-0 bg-white px-3 py-2 border-b">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={languageSearch}
                        onChange={(e) => setLanguageSearch(e.target.value)}
                        className="w-full text-gray-800 pl-9 pr-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search languages..."
                      />
                    </div>
                  </div>
                  
                  {/* Language Options */}
                  <div className="max-h-60 overflow-auto">
                    {filteredLanguages.map((language) => (
                      <div
                        key={language.code}
                        onClick={() => {
                          const isSelected = selectedLanguages.some(lang => lang.code === language.code);
                          if (isSelected) {
                            setSelectedLanguages(selectedLanguages.filter(lang => lang.code !== language.code));
                          } else {
                            setSelectedLanguages([...selectedLanguages, language]);
                          }
                        }}
                        className={`relative cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-blue-100 ${
                          selectedLanguages.some(lang => lang.code === language.code)
                            ? 'bg-blue-50 text-blue-900'
                            : 'text-gray-900'
                        }`}
                      >
                        <span className={`block truncate ${
                          selectedLanguages.some(lang => lang.code === language.code)
                            ? 'font-medium'
                            : 'font-normal'
                        }`}>
                          {language.name}
                        </span>
                        {selectedLanguages.some(lang => lang.code === language.code) && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    ))}
                    {filteredLanguages.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No languages found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          {/* Results */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="space-y-4">
              {results.map((subtitle) => (
                <div key={subtitle.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{subtitle.attributes.release}</h3>
                      <p className="text-sm text-gray-600">
                        Language: {subtitle.attributes.language}
                      </p>
                      <p className="text-sm text-gray-600">
                        File: {subtitle.attributes.files[0].file_name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(subtitle.attributes.files[0].file_id)}
                      disabled={downloading === subtitle.attributes.files[0].file_id}
                      className="text-blue-600 hover:text-blue-800 disabled:text-blue-300"
                    >
                      {downloading === subtitle.attributes.files[0].file_id ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                </div>
              ))}
              {results.length === 0 && !loading && (
                <p className="text-gray-500">No results found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
