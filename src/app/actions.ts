'use server';

import axios from 'axios';
import { SearchParams, SearchResponse, Language } from '@/types/subtitles';

const API_BASE_URL = 'https://api.opensubtitles.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Api-Key': process.env.OPENSUBTITLES_API_KEY || '',
    'User-Agent': 'Subaba v1.0.0'
  },
});

export async function searchSubtitles(params: SearchParams): Promise<SearchResponse> {
  const { query, fileHash, languages } = params;
  const searchParams = new URLSearchParams();

  if (query) searchParams.append('query', query);
  if (fileHash) searchParams.append('moviehash', fileHash);
  if (languages?.length) searchParams.append('languages', languages.join(','));

  const response = await api.get(`/subtitles?${searchParams.toString()}`);
  const firstItem = response.data.data[0];
  console.log('searchSubtitles response first item', firstItem);
  console.log('searchSubtitles response first item files', firstItem.attributes.files);
  return response.data;
}

export async function getLanguages(): Promise<Language[]> {
  const response = await api.get('/infos/languages');
  // The API returns an object with language codes as keys
  const languagesData = response.data;
  return Object.entries(languagesData).map(([code, name]) => ({
    code,
    name: name as string
  }));
}

export async function downloadSubtitle(fileId: number): Promise<{ fileName: string; content: string }> {
  console.log('Downloading subtitle with file_id:', fileId);
  console.log('Using bearer token:', process.env.USER_BEARER_TOKEN);
  
  const requestConfig = {
    headers: {
      'Authorization': `Bearer ${process.env.USER_BEARER_TOKEN}`,
      'Accept': 'application/json',
      'Api-Key': process.env.OPENSUBTITLES_API_KEY || '',
      'User-Agent': 'Subaba v1.0.0',
    }
  };
  
  console.log('Request config:', JSON.stringify(requestConfig, null, 2));
  
  const response = await api.post('/download', 
    { file_id: fileId },
    requestConfig
  );
  
  console.log('Download response:', response.data);

  // Fetch the actual subtitle content
  const subtitleResponse = await axios.get(response.data.link, {
    responseType: 'text'
  });

  return {
    fileName: response.data.file_name,
    content: subtitleResponse.data
  };
} 