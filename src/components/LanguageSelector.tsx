import { useState, useCallback } from 'react';
import { CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Language } from '@/types/subtitles';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguages: Language[];
  onSelectionChange: (languages: Language[]) => void;
}

export function LanguageSelector({ languages, selectedLanguages, onSelectionChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    lang.code.toLowerCase().includes(languageSearch.toLowerCase())
  );

  return (
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
                      onSelectionChange(selectedLanguages.filter(lang => lang.code !== language.code));
                    } else {
                      onSelectionChange([...selectedLanguages, language]);
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
  );
} 