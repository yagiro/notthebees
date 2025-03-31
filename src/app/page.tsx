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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          {/* Search Results */}
          <SearchResults
            results={results}
            loading={loading}
            downloading={downloading}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </main>
  );
}
