import { useEffect, useState } from 'react';

// Jikan API interfaces
export interface AnimeCharacter {
  mal_id: number;
  name: string;
  name_kanji?: string;
  nicknames: string[];
  about?: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  favorites: number;
}

export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  type?: string;
  episodes?: number;
  status: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  synopsis?: string;
  year?: number;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  genres: Array<{
    mal_id: number;
    name: string;
    type: string;
  }>;
}

interface JikanResponse<T> {
  data: T[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

// Hook for paginated anime data
export function usePaginatedAnime(page: number = 1) {
  const [data, setData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    totalItems: 0
  });

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      setError(null);

      try {
        // Using top anime endpoint with pagination
        const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=10`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: JikanResponse<Anime> = await response.json();

        setData(result.data);
        setPagination({
          currentPage: result.pagination.current_page,
          totalPages: result.pagination.last_visible_page,
          hasNextPage: result.pagination.has_next_page,
          totalItems: result.pagination.items.total
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch anime data');
        console.error('Error fetching anime:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [page]);

  return { data, loading, error, pagination };
}

// Hook for infinite scroll characters
export function useInfiniteCharacters() {
  const [data, setData] = useState<AnimeCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      // Using top characters endpoint
      const response = await fetch(`https://api.jikan.moe/v4/top/characters?page=${page}&limit=10`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: JikanResponse<AnimeCharacter> = await response.json();

      if (page === 1) {
        setData(result.data);
      } else {
        setData(prev => [...prev, ...result.data]);
      }

      setHasMore(result.pagination.has_next_page);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch characters');
      console.error('Error fetching characters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://api.jikan.moe/v4/top/characters?page=1&limit=10`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: JikanResponse<AnimeCharacter> = await response.json();

        setData(result.data);
        setHasMore(result.pagination.has_next_page);
        setPage(2); // Next page to load
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch characters');
        console.error('Error fetching characters:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // Only load initial data

  return { data, loading, error, hasMore, loadMore };
}
