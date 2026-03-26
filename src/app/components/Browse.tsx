import { Search, TrendingUp, Filter, Star } from 'lucide-react';
import { BookCard } from './BookCard';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';
import { BookCover } from './BookCover';
import { LoadingSpinner } from './LoadingSpinner';
import { getTrendingBooks, convertGoogleBookToBookData, BookData, searchBooks } from '../utils/googleBooksApi';

const genres = ['All', 'Fantasy', 'Romance', 'Thriller', 'Sci-Fi', 'Contemporary', 'Mystery', 'Historical'];
const CURATED_QUERY_LIMIT = 8;
const CURATED_QUERY_CONCURRENCY = 4;
const SEARCH_TIMEOUT_MS = 8000;

const popularLists = [
  {
    title: "Top Fantasy of 2026",
    books: 24,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Best Romance Novels",
    books: 32,
    gradient: "from-pink-500 to-rose-500"
  },
  {
    title: "Must-Read Thrillers",
    books: 18,
    gradient: "from-red-500 to-orange-500"
  },
  {
    title: "Sci-Fi Masterpieces",
    books: 15,
    gradient: "from-blue-500 to-cyan-500"
  }
];

export function Browse({ onBookSelect }: { onBookSelect?: (book: any) => void }) {
  const { currentTheme } = useTheme();
  const { books } = useBooks();
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingBooks, setTrendingBooks] = useState<BookData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [externalSearchResults, setExternalSearchResults] = useState<BookData[]>([]);
  const [genreBooks, setGenreBooks] = useState<BookData[]>([]);
  const [isLoadingGenre, setIsLoadingGenre] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [listBooks, setListBooks] = useState<BookData[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const searchRequestIdRef = useRef(0);

  const looksLikeAuthorQuery = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q || q.includes(':') || q.includes('"')) return false;
    const words = q.split(/\s+/).filter(Boolean);
    return words.length >= 2 && words.length <= 4;
  };

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  const handleBookClick = (book: any) => {
    if (onBookSelect) {
      onBookSelect(book);
    }
  };

  const searchBooksWithTimeout = async (query: string, maxResults = 4) => {
    const timeoutPromise = new Promise<[]>(
      (resolve) => setTimeout(() => resolve([]), SEARCH_TIMEOUT_MS),
    );

    const results = await Promise.race([
      searchBooks({ query, maxResults }),
      timeoutPromise,
    ]);

    return results.map(convertGoogleBookToBookData);
  };

  const fetchCuratedBooks = async (queries: string[]) => {
    const trimmedQueries = queries.slice(0, CURATED_QUERY_LIMIT);
    const allBooks: BookData[] = [];

    for (let index = 0; index < trimmedQueries.length; index += CURATED_QUERY_CONCURRENCY) {
      const chunk = trimmedQueries.slice(index, index + CURATED_QUERY_CONCURRENCY);
      const settled = await Promise.allSettled(
        chunk.map((query) => searchBooksWithTimeout(query, 4)),
      );

      settled.forEach((result) => {
        if (result.status === 'fulfilled') {
          allBooks.push(...result.value);
        }
      });
    }

    return Array.from(
      new Map(allBooks.map((book) => [book.title.toLowerCase(), book])).values(),
    );
  };

  // When genre is selected, fetch books from that genre
  useEffect(() => {
    if (selectedGenre !== 'All') {
      // Reset selected list when genre is changed
      setSelectedList(null);
      let isActive = true;
      
      const fetchGenreBooks = async () => {
        setIsLoadingGenre(true);
        try {
          // Curated search queries for popular books in each genre - EXPANDED for 25-50 recs
          const genreQueries: { [key: string]: string[] } = {
            'Fantasy': [
              'Brandon Sanderson', 'Sarah J Maas', 'Rebecca Yarros Fourth Wing', 'Holly Black', 'Mistborn',
              'Leigh Bardugo Six of Crows', 'V.E. Schwab', 'Cassandra Clare', 'Throne of Glass',
              'A Court of Thorns and Roses', 'The Cruel Prince', 'Red Queen Victoria Aveyard',
              'Shadow and Bone', 'The Name of the Wind', 'Stormlight Archive'
            ],
            'Romance': [
              'Colleen Hoover It Ends With Us', 'Emily Henry Beach Read', 'Book Lovers', 'Red White Royal Blue', 'The Love Hypothesis',
              'Ali Hazelwood', 'Christina Lauren', 'People We Meet on Vacation', 'The Spanish Love Deception',
              'Happy Place Emily Henry', 'Verity Colleen Hoover', 'The Hating Game', 'Beach Read',
              'One Day in December', 'The Flat Share', 'Casey McQuiston'
            ],
            'Thriller': [
              'The Housemaid Freida McFadden', 'The Guest List Lucy Foley', 'The Silent Patient', 'Gone Girl', 'The Woman in the Window',
              'Riley Sager', 'Ruth Ware', 'Lisa Jewell', 'The Couple Next Door', 'Behind Closed Doors',
              'The Girl on the Train', 'Big Little Lies', 'Sharp Objects', 'Dark Places Gillian Flynn',
              'The Last Mrs Parrish', 'The Wife Between Us', 'Karin Slaughter', 'Then She Was Gone'
            ],
            'Sci-Fi': [
              'Project Hail Mary Andy Weir', 'Dark Matter Blake Crouch', 'Red Rising Pierce Brown', 'The Three Body Problem', 'Dune',
              'The Martian Andy Weir', 'Recursion Blake Crouch', 'Enders Game', 'Foundation Isaac Asimov',
              'Neuromancer', 'Snow Crash', 'Ready Player One', 'The Expanse', 'Hyperion Dan Simmons',
              'Becky Chambers', 'NK Jemisin Broken Earth'
            ],
            'Contemporary': [
              'The Seven Husbands of Evelyn Hugo', 'A Man Called Ove', 'The Midnight Library', 'Little Fires Everywhere', 'Eleanor Oliphant',
              'Where the Crawdads Sing', 'The Great Alone', 'Lessons in Chemistry', 'Tomorrow and Tomorrow and Tomorrow',
              'Daisy Jones and The Six', 'Malibu Rising', 'Circe Madeline Miller', 'The Song of Achilles',
              'Educated Tara Westover', 'Maybe You Should Talk to Someone', 'Anxious People Fredrik Backman'
            ],
            'Mystery': [
              'Murder on the Orient Express', 'And Then There Were None', 'The Thursday Murder Club', 'Big Little Lies', 'The Guest List',
              'The Silent Patient', 'In the Woods Tana French', 'Louise Penny Three Pines', 'Anthony Horowitz',
              'The 7 1/2 Deaths of Evelyn Hardcastle', 'One by One Ruth Ware', 'The Woman in Cabin 10',
              'The Dry Jane Harper', 'The Hunting Party', 'Robert Galbraith Strike series'
            ],
            'Historical': [
              'The Nightingale Kristin Hannah', 'All the Light We Cannot See', 'The Book Thief', 'The Pillars of the Earth', 'The Alice Network',
              'The Four Winds Kristin Hannah', 'The Tattooist of Auschwitz', 'Pachinko Min Jin Lee', 'The Help Kathryn Stockett',
              'Wolf Hall Hilary Mantel', 'Kate Quinn', 'The Rose Code', 'Code Name Verity',
              'The Invisible Woman', 'The Paris Library', 'The Lost Girls of Paris'
            ]
          };
          
          const queries = genreQueries[selectedGenre] || [`${selectedGenre} bestseller`];
          
          console.log(
            `📚 Fetching popular ${selectedGenre} books with ${Math.min(queries.length, CURATED_QUERY_LIMIT)} curated queries`,
          );
          const uniqueBooks = await fetchCuratedBooks(queries);
          
          console.log(`✅ Found ${uniqueBooks.length} popular ${selectedGenre} books`);
          if (isActive) {
            setGenreBooks(uniqueBooks);
          }
        } catch (error) {
          console.error('Genre search error:', error);
          if (isActive) {
            setGenreBooks([]);
          }
        } finally {
          if (isActive) {
            setIsLoadingGenre(false);
          }
        }
      };
      fetchGenreBooks();
      return () => {
        isActive = false;
      };
    } else {
      setGenreBooks([]);
    }
  }, [selectedGenre]);

  // When a popular list is clicked, fetch books for that list
  useEffect(() => {
    if (selectedList) {
      let isActive = true;
      const fetchListBooks = async () => {
        setIsLoadingList(true);
        try {
          // Curated queries for each popular list - EXPANDED for 25-50 recs
          const listQueries: { [key: string]: string[] } = {
            'Top Fantasy of 2026': [
              'Fourth Wing Rebecca Yarros', 'Iron Flame', 'Sarah J Maas House of Flame and Shadow',
              'Brandon Sanderson Wind and Truth', 'Holly Black Stolen Heir', 'Leigh Bardugo',
              'House of Sky and Breath', 'A Court of Silver Flames', 'Empire of the Vampire'
            ],
            'Best Romance Novels': [
              'Colleen Hoover It Ends With Us', 'Emily Henry Happy Place', 'Book Lovers',
              'Ali Hazelwood Love Hypothesis', 'Red White Royal Blue', 'Beach Read',
              'People We Meet on Vacation', 'The Spanish Love Deception', 'The Hating Game',
              'One Day in December', 'In a Holidaze', 'The Flat Share'
            ],
            'Must-Read Thrillers': [
              'The Housemaid Freida McFadden', 'Gone Girl Gillian Flynn', 'The Silent Patient',
              'The Guest List Lucy Foley', 'The Woman in the Window', 'Behind Closed Doors',
              'The Girl on the Train', 'Sharp Objects', 'Big Little Lies',
              'The Couple Next Door', 'The Last Mrs Parrish', 'Then She Was Gone Lisa Jewell'
            ],
            'Sci-Fi Masterpieces': [
              'Project Hail Mary Andy Weir', 'Dune Frank Herbert', 'The Martian',
              'Dark Matter Blake Crouch', 'Red Rising Pierce Brown', 'Foundation Isaac Asimov',
              'Enders Game', 'Neuromancer', 'The Three Body Problem', 'Hyperion',
              'Snow Crash', 'The Expanse'
            ]
          };
          
          const queries = listQueries[selectedList] || [`${selectedList} bestseller`];
          
          console.log(`📚 Fetching ${selectedList} with ${queries.length} curated queries`);
          const uniqueBooks = await fetchCuratedBooks(queries);
          
          console.log(`✅ Found ${uniqueBooks.length} books for ${selectedList}`);
          if (isActive) {
            setListBooks(uniqueBooks);
          }
        } catch (error) {
          console.error('List search error:', error);
          if (isActive) {
            setListBooks([]);
          }
        } finally {
          if (isActive) {
            setIsLoadingList(false);
          }
        }
      };
      fetchListBooks();
      return () => {
        isActive = false;
      };
    }
  }, [selectedList]);

  // Filter library books by search query and genre
  const filteredLibraryBooks = useMemo(() => {
    return books.filter((book: any) => {
      // Genre filter
      if (selectedGenre !== 'All' && book.genre !== selectedGenre) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [books, selectedGenre, searchQuery]);

  // Perform external search when user types
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const requestId = ++searchRequestIdRef.current;
      const timeoutId = setTimeout(async () => {
        setIsSearching(true);
        try {
          const isAuthorSearch = looksLikeAuthorQuery(searchQuery);
          const results = await searchBooks({
            query: searchQuery,
            maxResults: isAuthorSearch ? 60 : 20,
          });
          if (searchRequestIdRef.current !== requestId) return;
          const bookData = results.map(convertGoogleBookToBookData);
          setExternalSearchResults(bookData);
        } catch (error) {
          if (searchRequestIdRef.current !== requestId) return;
          console.error('Search error:', error);
          setExternalSearchResults([]);
        } finally {
          if (searchRequestIdRef.current !== requestId) return;
          setIsSearching(false);
        }
      }, 500); // Debounce search

      return () => clearTimeout(timeoutId);
    } else {
      searchRequestIdRef.current += 1;
      setIsSearching(false);
      setExternalSearchResults([]);
    }
  }, [searchQuery]);

  // Combine library books and external search results (removing duplicates)
  const allSearchResults = useMemo(() => {
    // If viewing a popular list, show those books
    if (selectedList && listBooks.length > 0) {
      return listBooks;
    }
    
    // If a genre is selected (not "All"), show genre books from API
    if (selectedGenre !== 'All' && !searchQuery) {
      return genreBooks;
    }
    
    // If searching, combine library and external results
    if (!searchQuery) return filteredLibraryBooks;
    
    // Create a set of book titles from library for deduplication
    const libraryTitles = new Set(filteredLibraryBooks.map((b: any) => b.title.toLowerCase()));
    
    // Filter out external results that are already in library
    const uniqueExternalResults = externalSearchResults.filter(
      book => !libraryTitles.has(book.title.toLowerCase())
    );
    
    // Combine: library books first, then external results
    return [...filteredLibraryBooks, ...uniqueExternalResults];
  }, [filteredLibraryBooks, externalSearchResults, searchQuery, selectedGenre, genreBooks, selectedList, listBooks]);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      const books = await getTrendingBooks();
      setTrendingBooks(books.map(convertGoogleBookToBookData));
    };
    fetchTrendingBooks();
  }, []);

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
          Find your next read
        </p>
      </div>

      {/* Search Bar */}
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
        <button 
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-white"
          style={{
            background: getGradientBg(),
          }}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Genre Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className="px-4 py-2 rounded-xl font-semibold text-xs whitespace-nowrap flex-shrink-0 transition-all"
            style={{
              background: selectedGenre === genre ? getGradientBg() : currentTheme.cardColor,
              borderColor: selectedGenre === genre ? 'transparent' : currentTheme.borderColor,
              borderWidth: selectedGenre === genre ? '0' : '1px',
              color: selectedGenre === genre ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
              boxShadow: selectedGenre === genre ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Search Results - Show when user is searching or filtering */}
      {(searchQuery || selectedGenre !== 'All' || selectedList) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-lg font-bold"
              style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
            >
              {selectedList ? selectedList : searchQuery ? 'Search Results' : `${selectedGenre} Books`}
            </h2>
            <span 
              className="text-sm"
              style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
            >
              {allSearchResults.length} {allSearchResults.length === 1 ? 'book' : 'books'}
            </span>
          </div>
          
          {(isSearching || isLoadingGenre || isLoadingList) && allSearchResults.length === 0 && (
            <div className="text-center py-8">
              <LoadingSpinner text="Loading books..." />
            </div>
          )}
          {isSearching && allSearchResults.length > 0 && (
            <p
              className="text-xs mb-3"
              style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
            >
              Updating results...
            </p>
          )}
          
          {!isSearching && allSearchResults.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {allSearchResults.map((book: any, index: number) => (
                <div 
                  key={`search-${book.id || book.isbn || book.googleBooksId}-${index}`} 
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
                    {book.status === 'reading' && (
                      <div className="absolute top-1.5 left-1.5 bg-emerald-500 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                        <span className="text-[9px] font-bold text-white">Reading</span>
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
          ) : !isSearching ? (
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
                className="text-xs mb-3"
                style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
              >
                Try searching for popular books like "Harry Potter", "Fourth Wing", or "The Great Gatsby"
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Popular Lists */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-[#f83aef]" />
          <h2 
            className="text-lg font-bold"
            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
          >
            Popular Lists
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {popularLists.map((list, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${list.gradient} rounded-xl p-4 text-white cursor-pointer active:scale-95 transition-transform shadow-md`}
              onClick={() => {
                setSelectedList(list.title);
                setSelectedGenre('All'); // Reset genre when list is selected
              }}
            >
              <h3 className="font-bold text-sm mb-1">{list.title}</h3>
              <p className="text-white/80 text-xs">{list.books} books</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Books */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#3298ff]" />
          <h2 
            className="text-lg font-bold"
            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
          >
            Trending This Week
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {trendingBooks.map((book, index) => (
            <div 
              key={book.isbn || book.googleBooksId || `trending-${book.title}-${index}`} 
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
      </div>

      {/* Browse by Year */}
      <div>
        <h2 
          className="text-lg font-bold mb-4"
          style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
        >
          Browse by Year
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[2026, 2025, 2024, 2023].map((year) => (
            <div
              key={year}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm cursor-pointer active:scale-95 transition-transform text-center"
            >
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{year}</div>
              <div className="text-xs text-gray-600">Browse books</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
