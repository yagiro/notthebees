'use client';

import { useState, useEffect } from 'react';
import { searchSubtitles, getLanguages, downloadSubtitle } from './actions';
import { Subtitle, Language } from '@/types/subtitles';
import { LanguageSelector } from '@/components/LanguageSelector';
import { FileHashInput } from '@/components/FileHashInput';
import { SearchResults } from '@/components/SearchResults';

export default function Home() {
  const [query, setQuery] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
  const [results, setResults] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      const languagesData = await getLanguages();
      setLanguages(languagesData);
    };
    fetchLanguages();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--secondary)]/10">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">SubSync</h1>
          <p className="text-lg text-[var(--text-secondary)] font-mono">Your smart companion for finding the perfect subtitles in any language</p>
        </div>
        
        <div className="comic-box bg-[var(--form-background)] p-8 space-y-6">
          {/* Text Search */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Search by Text
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-[var(--text-primary)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors bg-[var(--input-background)] text-white"
              placeholder="Enter movie or TV show title..."
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>

          {/* File Hash Input */}
          <FileHashInput
            value={fileHash}
            onChange={setFileHash}
          />

          {/* Language Selector */}
          <LanguageSelector
            languages={languages}
            selectedLanguages={selectedLanguages}
            onSelectionChange={setSelectedLanguages}
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="comic-button w-full cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : 'Search'}
          </button>

          {/* Search Results */}
          <SearchResults
            results={results}
            loading={loading}
            downloading={downloading}
            onDownload={handleDownload}
            hasSearched={hasSearched}
            languages={languages}
          />
        </div>
      </div>
    </main>
  );
}
