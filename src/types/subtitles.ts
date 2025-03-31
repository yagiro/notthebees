export interface Subtitle {
  id: string;
  type: string;
  attributes: {
    subtitle_id: string;
    language: string;
    download_count: number;
    release: string;
    upload_date: string;
    files: Array<{
      file_id: number;
      file_name: string;
      cd_number: number;
    }>;
    feature_details?: {
      feature_id: number;
      feature_type: string;
      year: number;
      title: string;
      movie_name: string;
      imdb_id: number;
      tmdb_id: number;
    };
  };
}

export interface SearchResponse {
  data: Subtitle[];
  total: number;
}

export interface Language {
  code: string;
  name: string;
}

export interface SearchParams {
  query?: string;
  fileHash?: string;
  languages?: string[];
} 