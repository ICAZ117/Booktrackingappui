import { Search, TrendingUp, Star, Sparkles, Library } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';
import { BookCover } from './BookCover';
import { LoadingSpinner } from './LoadingSpinner';
import {
  BookData,
  getPopularBooksFeed,
  getNytBestSellerBooks,
  getNytBestSellerLists,
  type NytBestSellerListSummary,
} from '../utils/googleBooksApi';
import {
  getCuratedGenreShelves,
  getPremiumRecommendations,
  optimizeDiscoveryBooks,
  searchPremiumBooks,
  type CuratedGenreShelf,
} from '../utils/discoveryEngine';
import { trackCatalogBookEvent, trackCatalogSearchResults } from '../services/catalogService';

type BrowseMode = 'nyt' | 'trending' | 'for-you';

const browseModes: { id: BrowseMode; label: string; icon: typeof Star }[] = [
  { id: 'nyt', label: 'NYT Best Sellers', icon: Star },
  { id: 'trending', label: 'Trending by Genre', icon: TrendingUp },
  { id: 'for-you', label: 'For You', icon: Sparkles },
];

const genres = ['All', 'Fantasy', 'Romance', 'Thriller', 'Sci-Fi', 'Contemporary', 'Mystery', 'Historical'];

const normalizeText = (value?: string) => (value || '').toLowerCase().replace(/\s+/g, ' ').trim();
const normalizeIsbn = (value?: string) => (value || '').replace(/[^0-9x]/gi, '').toLowerCase();

const getBookKey = (book: { title?: string; author?: string; isbn?: string }) => {
  const isbn = normalizeIsbn(book.isbn);
  if (isbn) return `isbn:${isbn}`;
  const title = normalizeText(book.title);
  const author = normalizeText(book.author);
  if (!title) return '';
  return `${title}::${author}`;
};

export function Browse({ onBookSelect }: { onBookSelect?: (book: any) => void }) {
  const { currentTheme } = useTheme();
  const { books } = useBooks();

  const [mode, setMode] = useState<BrowseMode>('nyt');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [externalSearchResults, setExternalSearchResults] = useState<BookData[]>([]);

  const [nytLists, setNytLists] = useState<NytBestSellerListSummary[]>([]);
  const [selectedNytList, setSelectedNytList] = useState<string>('');
  const [nytBooks, setNytBooks] = useState<BookData[]>([]);
  const [isLoadingNytLists, setIsLoadingNytLists] = useState(false);
  const [isLoadingNytBooks, setIsLoadingNytBooks] = useState(false);
  const [isUsingNytFallback, setIsUsingNytFallback] = useState(false);

  const [trendingBooks, setTrendingBooks] = useState<BookData[]>([]);
  const [trendingShelves, setTrendingShelves] = useState<CuratedGenreShelf[]>([]);
  const [selectedTrendingShelf, setSelectedTrendingShelf] = useState<string>('trending-now');
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);

  const [personalizedBooks, setPersonalizedBooks] = useState<BookData[]>([]);
  const [isLoadingPersonalized, setIsLoadingPersonalized] = useState(false);

  const searchRequestIdRef = useRef(0);

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  const handleBookClick = (book: any) => {
    void trackCatalogBookEvent(book, 'open');
    onBookSelect?.(book);
  };

  const looksLikeAuthorQuery = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q || q.includes(':') || q.includes('"')) return false;
    const words = q.split(/\s+/).filter(Boolean);
    return words.length >= 2 && words.length <= 4;
  };

  useEffect(() => {
    let isActive = true;

    const fetchNytLists = async () => {
      setIsLoadingNytLists(true);
      try {
        const lists = await getNytBestSellerLists();
        if (!isActive) return;

        setNytLists(lists);
        setIsUsingNytFallback(false);

        if (!selectedNytList && lists.length > 0) {
          const preferred =
            lists.find((list) => list.encodedName === 'hardcover-fiction') ||
            lists.find((list) => list.encodedName === 'combined-print-and-e-book-fiction') ||
            lists[0];
          setSelectedNytList(preferred?.encodedName || '');
        }
      } finally {
        if (isActive) {
          setIsLoadingNytLists(false);
        }
      }
    };

    fetchNytLists();
    return () => {
      isActive = false;
    };
  }, [selectedNytList]);

  useEffect(() => {
    if (!selectedNytList || mode !== 'nyt') return;

    let isActive = true;
    const fetchNytBooks = async () => {
      setIsLoadingNytBooks(true);
      try {
        const results = await getNytBestSellerBooks(selectedNytList);
        if (!isActive) return;
        setNytBooks(results);
      } finally {
        if (isActive) {
          setIsLoadingNytBooks(false);
        }
      }
    };

    fetchNytBooks();
    return () => {
      isActive = false;
    };
  }, [selectedNytList, mode]);

  useEffect(() => {
    if (mode !== 'nyt' || isLoadingNytLists || nytLists.length > 0) return;

    let isActive = true;
    const fetchNytFallback = async () => {
      setIsLoadingNytBooks(true);
      try {
        const fallbackFeed = await getPopularBooksFeed();
        if (!isActive) return;
        setNytBooks(fallbackFeed.books.slice(0, 24));
        setIsUsingNytFallback(true);
      } finally {
        if (isActive) {
          setIsLoadingNytBooks(false);
        }
      }
    };

    fetchNytFallback();
    return () => {
      isActive = false;
    };
  }, [mode, nytLists.length, isLoadingNytLists]);

  useEffect(() => {
    if (mode !== 'trending') return;

    let isActive = true;
    const fetchTrending = async () => {
      setIsLoadingTrending(true);
      try {
        const shelves = await getCuratedGenreShelves(selectedGenre, 24);
        if (!isActive) return;
        setTrendingShelves(shelves);
        const preferredShelf = shelves.find((shelf) => shelf.id === selectedTrendingShelf) || shelves[0];
        setSelectedTrendingShelf(preferredShelf?.id || 'trending-now');
        setTrendingBooks(preferredShelf?.books || []);
      } finally {
        if (isActive) {
          setIsLoadingTrending(false);
        }
      }
    };

    fetchTrending();
    return () => {
      isActive = false;
    };
  }, [mode, selectedGenre, selectedTrendingShelf]);

  useEffect(() => {
    if (mode !== 'for-you' || books.length === 0) return;

    let isActive = true;

    const fetchPersonalized = async () => {
      setIsLoadingPersonalized(true);
      try {
        const recommendations = await getPremiumRecommendations({
          userBooks: books,
          limit: 24,
        });
        if (isActive) setPersonalizedBooks(recommendations);
      } finally {
        if (isActive) {
          setIsLoadingPersonalized(false);
        }
      }
    };

    fetchPersonalized();
    return () => {
      isActive = false;
    };
  }, [mode, books]);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      searchRequestIdRef.current += 1;
      setIsSearching(false);
      setExternalSearchResults([]);
      return;
    }

    const requestId = ++searchRequestIdRef.current;
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const authorSearch = looksLikeAuthorQuery(searchQuery);
        const results = await searchPremiumBooks({
          query: searchQuery,
          maxResults: authorSearch ? 50 : 24,
        });

        if (searchRequestIdRef.current !== requestId) return;
        const optimizedResults = optimizeDiscoveryBooks(results);
        setExternalSearchResults(optimizedResults);
        void trackCatalogSearchResults(optimizedResults, 20);
      } catch (error) {
        if (searchRequestIdRef.current !== requestId) return;
        console.error('Browse search failed', error);
        setExternalSearchResults([]);
      } finally {
        if (searchRequestIdRef.current !== requestId) return;
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const local = books.filter((book: any) => {
      return (
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query)
      );
    });

    const localTitles = new Set(local.map((book: any) => normalizeText(book.title)));
    const external = externalSearchResults.filter((book) => !localTitles.has(normalizeText(book.title)));

    return [...local, ...external];
  }, [books, externalSearchResults, searchQuery]);

  const activeResults = useMemo(() => {
    if (searchQuery.trim().length > 0) return searchResults;
    if (mode === 'nyt') return nytBooks;
    if (mode === 'trending') {
      const currentShelf = trendingShelves.find((shelf) => shelf.id === selectedTrendingShelf);
      return currentShelf?.books || trendingBooks;
    }
    return personalizedBooks;
  }, [searchQuery, searchResults, mode, nytBooks, trendingBooks, trendingShelves, selectedTrendingShelf, personalizedBooks]);

  const showSearchResults = searchQuery.trim().length > 0;
  const showForYouLocked = mode === 'for-you' && books.length === 0 && !showSearchResults;
  const isLoadingMode =
    (!showSearchResults && mode === 'nyt' && (isLoadingNytLists || isLoadingNytBooks)) ||
    (!showSearchResults && mode === 'trending' && isLoadingTrending) ||
    (!showSearchResults && mode === 'for-you' && isLoadingPersonalized);

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
        >
          Discover Books
        </h1>
        <p
          className="text-sm"
          style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
        >
          NYT trends + live catalog + smart recommendations
        </p>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
        />
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-3 rounded-xl focus:outline-none focus:ring-2 text-sm"
          style={{
            backgroundColor: currentTheme.cardColor,
            borderColor: currentTheme.borderColor,
            borderWidth: '1px',
            color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
          }}
        />
      </div>

      {!showSearchResults && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {browseModes.map((item) => {
            const Icon = item.icon;
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className="px-4 py-2 rounded-xl font-semibold text-xs whitespace-nowrap flex items-center gap-2"
                style={{
                  background: active ? getGradientBg() : currentTheme.cardColor,
                  borderColor: active ? 'transparent' : currentTheme.borderColor,
                  borderWidth: active ? '0' : '1px',
                  color: active ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {!showSearchResults && mode === 'nyt' && nytLists.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {nytLists.slice(0, 12).map((list) => {
            const active = selectedNytList === list.encodedName;
            return (
              <button
                key={list.encodedName}
                onClick={() => setSelectedNytList(list.encodedName)}
                className="px-4 py-2 rounded-xl font-semibold text-xs whitespace-nowrap"
                style={{
                  background: active ? getGradientBg() : currentTheme.cardColor,
                  borderColor: active ? 'transparent' : currentTheme.borderColor,
                  borderWidth: active ? '0' : '1px',
                  color: active ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
                }}
              >
                {list.displayName}
              </button>
            );
          })}
        </div>
      )}

      {!showSearchResults && mode === 'trending' && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {genres.map((genre) => {
              const active = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className="px-4 py-2 rounded-xl font-semibold text-xs whitespace-nowrap"
                  style={{
                    background: active ? getGradientBg() : currentTheme.cardColor,
                    borderColor: active ? 'transparent' : currentTheme.borderColor,
                    borderWidth: active ? '0' : '1px',
                    color: active ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
                  }}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          {trendingShelves.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {trendingShelves.map((shelf) => {
                const active = selectedTrendingShelf === shelf.id;
                return (
                  <button
                    key={shelf.id}
                    onClick={() => setSelectedTrendingShelf(shelf.id)}
                    className="px-4 py-2 rounded-xl font-semibold text-xs whitespace-nowrap"
                    style={{
                      background: active ? getGradientBg() : currentTheme.cardColor,
                      borderColor: active ? 'transparent' : currentTheme.borderColor,
                      borderWidth: active ? '0' : '1px',
                      color: active ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
                    }}
                  >
                    {shelf.title}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-bold"
          style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
        >
          {showSearchResults
            ? 'Search Results'
            : mode === 'nyt'
            ? 'NYT Best Sellers'
            : mode === 'trending'
            ? (() => {
                const shelf = trendingShelves.find((entry) => entry.id === selectedTrendingShelf);
                return `${selectedGenre} • ${shelf?.title || 'Trending'}`;
              })()
            : 'Recommended for You'}
        </h2>
        <span
          className="text-sm"
          style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
        >
          {activeResults.length} {activeResults.length === 1 ? 'book' : 'books'}
        </span>
      </div>
      {!showSearchResults && mode === 'nyt' && isUsingNytFallback && (
        <p
          className="text-xs -mt-3"
          style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
        >
          NYT lists unavailable right now, showing live popular fallback.
        </p>
      )}

      {showForYouLocked && (
        <div
          className="rounded-xl p-6 text-center"
          style={{ backgroundColor: currentTheme.cardColor, border: `1px solid ${currentTheme.borderColor}` }}
        >
          <Library className="w-10 h-10 mx-auto mb-3" style={{ color: currentTheme.accentColor }} />
          <p className="text-sm font-semibold" style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}>
            Add a few books first
          </p>
          <p className="text-xs mt-1" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
            We unlock For You recommendations once you import or add books.
          </p>
        </div>
      )}

      {isLoadingMode && !showForYouLocked && (
        <div className="text-center py-8">
          <LoadingSpinner text="Loading books..." />
        </div>
      )}

      {!isLoadingMode && !showForYouLocked && activeResults.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {activeResults.map((book: any, index: number) => (
            <div
              key={book.isbn || book.googleBooksId || `${book.id || 'book'}-${index}`}
              className="cursor-pointer"
              onClick={() => handleBookClick(book)}
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md mb-2 relative">
                <BookCover
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {book.rating && (
                  <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span className="text-[9px] font-bold text-white">{book.rating}</span>
                  </div>
                )}
              </div>
              <h3
                className="text-xs font-semibold line-clamp-2 mb-0.5"
                style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
              >
                {book.title}
              </h3>
              <p
                className="text-[10px] line-clamp-1"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                {book.author}
              </p>
            </div>
          ))}
        </div>
      )}

      {!isLoadingMode && !showForYouLocked && activeResults.length === 0 && (
        <div
          className="text-center py-12 rounded-xl"
          style={{ backgroundColor: currentTheme.cardColor }}
        >
          <Search
            className="w-12 h-12 mx-auto mb-3"
            style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
          />
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: currentTheme.textColor === 'light' ? '#d1d5db' : '#374151' }}
          >
            No books found
          </p>
          <p
            className="text-xs"
            style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
          >
            Try a broader search or switch tabs.
          </p>
        </div>
      )}
    </div>
  );
}
