import { Subtitle } from '@/types/subtitles';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';

interface SearchResultsProps {
  results: Subtitle[];
  loading: boolean;
  downloading: number | null;
  onDownload: (fileId: number) => void;
}

export function SearchResults({ results, loading, downloading, onDownload }: SearchResultsProps) {
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

  if (results.length === 0) {
    return (
      <div className="mt-8 text-center py-8">
        <p className="text-[var(--text-secondary)]">No results found</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Search Results</h2>
      <div className="space-y-4">
        {results.map((subtitle) => (
          <div 
            key={subtitle.id} 
            className="comic-box bg-white p-4 hover:bg-[var(--secondary)]/5 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-medium text-[var(--text-primary)]">{subtitle.attributes.release}</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-[var(--text-secondary)]">
                    Language: {subtitle.attributes.language}
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    File: {subtitle.attributes.files[0].file_name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDownload(subtitle.attributes.files[0].file_id)}
                disabled={downloading === subtitle.attributes.files[0].file_id}
                className="comic-button text-sm px-3 py-2"
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