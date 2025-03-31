import { Subtitle } from '@/types/subtitles';

interface SearchResultsProps {
  results: Subtitle[];
  loading: boolean;
  downloading: number | null;
  onDownload: (fileId: number) => void;
}

export function SearchResults({ results, loading, downloading, onDownload }: SearchResultsProps) {
  return (
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
                onClick={() => onDownload(subtitle.attributes.files[0].file_id)}
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
  );
} 