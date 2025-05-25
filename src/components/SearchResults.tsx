import { Subtitle, Language } from '@/types/subtitles';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';

interface SearchResultsProps {
  results: Subtitle[];
  loading: boolean;
  downloading: number | null;
  onDownload: (fileId: number) => void;
  hasSearched: boolean;
  languages: Language[];
}

export function SearchResults({ results, loading, downloading, onDownload, hasSearched, languages }: SearchResultsProps) {
  const getLanguageName = (code: string) => {
    const language = languages.find(lang => lang.code === code);
    return language?.name || code;
  };

  if (loading) {
    return (
      <div className="mt-8 text-center py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[var(--secondary)]/10 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="mt-8 text-center py-8">
        <p className="text-[var(--text-secondary)]">No results found</p>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Search Results</h2>
      <div className="space-y-4">
        {results.map((subtitle) => (
          <div 
            key={subtitle.id} 
            className="comic-box bg-[var(--form-background)] p-4 hover:bg-[var(--secondary)]/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1 max-w-7/10">
                <h3 className="font-medium text-[var(--text-primary)]">{subtitle.attributes.release}</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border-2 border-[var(--primary)] bg-[var(--primary)]/20 text-[var(--primary)] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                    {getLanguageName(subtitle.attributes.language)}
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    File: {subtitle.attributes.files[0].file_name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDownload(subtitle.attributes.files[0].file_id)}
                disabled={downloading === subtitle.attributes.files[0].file_id}
                className="comic-button shrink-0 text-sm px-3 py-2 cursor-pointer"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-1.5 inline" />
                {downloading === subtitle.attributes.files[0].file_id ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 