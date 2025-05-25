import { useState, useRef, useEffect } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    lang.code.toLowerCase().includes(languageSearch.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        Select Languages
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-left bg-[var(--input-background)] hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <span className="block truncate text-white/50">
            {selectedLanguages.length > 0
              ? <span className="block truncate text-white">{selectedLanguages.map(lang => lang.name).join(', ')}</span>
              : <span className="block truncate text-white/50">Select languages...</span>}
          </span>
        </button>
        
        {isOpen && (
          <div ref={menuRef} className="absolute z-20 mt-1 w-full bg-[var(--input-background)] shadow-lg rounded-lg border border-gray-200">
            {/* Language Search Input */}
            <div className="sticky top-0 px-3 py-2 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  className="w-full text-white bg-[var(--input-background)] pl-9 pr-3 py-2 text-sm border border-[var(--text-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                  placeholder="Search languages..."
                />
              </div>
            </div>
            
            {/* Language Options */}
            <div className="max-h-60 overflow-auto py-1">
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
                  className={`relative cursor-pointer select-none py-2 pl-10 pr-4 bg-[var(--input-background)] hover:bg-[var(--input-background)]/90 text-white ${
                    selectedLanguages.some(lang => lang.code === language.code)
                      ? 'bg-[var(--input-background)]/70'
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
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
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