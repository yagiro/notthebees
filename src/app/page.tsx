'use client';

import { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { searchSubtitles, getLanguages, downloadSubtitle } from './actions';
import { Subtitle, Language } from '@/types/subtitles';

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

          {/* File Hash Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by File Hash
            </label>
            <input
              type="text"
              value={fileHash}
              onChange={(e) => setFileHash(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter file hash..."
            />
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Languages
            </label>
            <Listbox value={selectedLanguages} onChange={setSelectedLanguages} multiple>
              <div className="relative">
                <Listbox.Button className="w-full px-4 py-2 border rounded-md text-left">
                  <span className="block truncate">
                    {selectedLanguages.length > 0
                      ? selectedLanguages.map(lang => lang.name).join(', ')
                      : 'Select languages...'}
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
                  {languages.map((language) => (
                    <Listbox.Option
                      key={language.code}
                      value={language}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {language.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
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
