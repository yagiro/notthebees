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
  console.log('Searching subtitles with params:', params);
  
  try {
    const searchParams = new URLSearchParams();

    if (params.query) searchParams.append('query', params.query);
    if (params.fileHash) searchParams.append('moviehash', params.fileHash);
    if (params.languages?.length) searchParams.append('languages', params.languages.join(','));

    console.log('Making API request with params:', searchParams.toString());
    
    const response = await api.get(`/subtitles?${searchParams.toString()}`);
    const firstItem = response.data.data[0];
    console.log('searchSubtitles response first item', firstItem);
    console.log('searchSubtitles response first item files', firstItem?.attributes?.files);
    return response.data;
  } catch (error) {
    console.error('Error searching subtitles:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
}

interface ILang {
  language_code: string;
  language_name: string;
}

export async function getLanguages(): Promise<Language[]> {
  console.log('Fetching languages');
  
  try {
    const response = await api.get('/infos/languages');
    // console.log('Languages API response:', response.data);
    // The API returns an object with a data property containing the array of languages
    return response.data.data.map((lang: ILang) => ({
      code: lang.language_code,
      name: lang.language_name
    }));
  } catch (error) {
    console.error('Error fetching languages:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    throw error;
  }
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