import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import SearchBar from './SearchBar';
import LanguageOptions from './LanguageOptions';
import TrendingSearches from './TrendingSearches';
import SkeletonLoader from './SkeletonLoader';
import { mockData } from './Data';

interface ApiResponse {
  success: boolean;
  data?: Array<{
    title: string;
    content: string;
    score: number;
  }>;
  error?: string;
}

interface SearchProps {
  removeChange: boolean;
}

const Search: React.FC<SearchProps> = ({ removeChange }) => {
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [showTrending, setShowTrending] = useState(false);
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAiSearch = async (query: string) => {
    setIsLoading(true)
    try {
      const response: AxiosResponse<ApiResponse> = await axios.get('http://localhost:3000/api/v1/search', {
        params: { q: query },
      });
      setResponseData(response.data);
      setError(null);
      setSearchResult(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else {
        setError('An unknown error occurred');
      }
      setResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const trimmedQuery = query.toLowerCase().trim();
    const result = mockData.find(item => item.query.toLowerCase() === trimmedQuery);
    setSearchResult(result ? result.info : 'No results found');
    setResponseData(null);
    setError(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTrending(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4">
      <SearchBar onAiSearch={handleAiSearch} />

      {removeChange && <LanguageOptions />}

      {isLoading && (
        <SkeletonLoader count={4} height="20px" width="95%" />
        )}
      
      {searchResult && (
        <div className="mt-4 text-gray-800 dark:text-white">
          {searchResult}
        </div>
      )}

      {responseData?.data?.length ? (
        <div className="mt-4 text-gray-800 dark:text-white">
          {responseData.data[0].content}
        </div>
      ) : null
      }
      
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}

      {removeChange && showTrending && (
        <TrendingSearches searches={mockData} onSearchClick={handleSearch} />
      )}
    </div>
  );
};

export default Search;