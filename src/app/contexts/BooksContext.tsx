import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Book as AppBook, Shelf } from '../types/book';
import { useAuth } from './AuthContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export type Book = AppBook;

export interface ReadingSession {
  id: string;
  bookId: string;
  pages: number;
  minutes: number;
  date: string;
}

interface BooksContextType {
  books: Book[];
  readingSessions: ReadingSession[];
  bookshelves: Shelf[];
  addBook: (book: Book) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  logReadingSession: (session: ReadingSession) => Promise<void>;
  updateBookshelves: (bookshelves: Shelf[]) => Promise<void>;
  getBooksInShelf: (shelfId: string) => Book[];
  getCurrentlyReading: () => Book[];
  getFinishedBooks: () => Book[];
  getWantToRead: () => Book[];
  refreshBooks: () => Promise<void>;
  fetchMissingCovers: () => Promise<void>;
  refetchAllCovers: () => Promise<{ success: number; failed: number }>;
  restoreCoversFromBackup: () => { restored: number; total: number };
  emergencyRecovery: () => number;
  isLoaded: boolean;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

const DEFAULT_SHELVES: Shelf[] = [
  { id: 'favorites', name: 'Favorites', bookIds: [] },
  { id: 'best-of-2026', name: 'Best Reads of 2026', bookIds: [] },
  { id: 'want-to-read', name: 'Want to Read', bookIds: [] },
  { id: 'dnf', name: 'DNF', bookIds: [] },
  { id: 'recently-read', name: 'Recently Read', bookIds: [] },
];

const STORAGE_KEYS = {
  books: 'readtrack_books',
  sessions: 'readtrack_sessions',
  legacySessions: 'readingSessions',
  shelves: 'readtrack_shelves',
} as const;

type BookRow = {
  user_id: string;
  id: string;
  title: string;
  author: string;
  cover: string;
  status?: Book['status'];
  rating?: number;
  progress?: number;
  pages?: number;
  current_page?: number;
  current_minutes?: number;
  audio_duration?: number;
  start_date?: string;
  finish_date?: string;
  date_read?: string;
  genre?: string;
  notes?: string;
  review?: string;
  format?: string;
  publisher?: string;
  year_published?: string;
  description?: string;
  categories?: string[];
  average_rating?: number;
  ratings_count?: number;
  isbn?: string;
  stats?: Book['stats'];
};

type SessionRow = {
  user_id: string;
  id: string;
  book_id: string;
  pages: number;
  minutes: number;
  date: string;
};

type ShelfRow = { user_id: string; id: string; name: string; book_ids: string[] };

const parseStoredJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to parse localStorage key "${key}"`, error);
    return fallback;
  }
};

const normalizeBook = (book: Partial<Book>): Book | null => {
  if (!book.id || !book.title) return null;

  return {
    id: String(book.id),
    title: String(book.title),
    author: book.author ? String(book.author) : 'Unknown Author',
    cover: book.cover ? String(book.cover) : '',
    status: book.status,
    rating: book.rating,
    progress: book.progress,
    pages: book.pages,
    currentPage: book.currentPage,
    currentMinutes: book.currentMinutes,
    audioDuration: book.audioDuration,
    startDate: book.startDate,
    finishDate: book.finishDate,
    dateRead: book.dateRead,
    genre: book.genre,
    notes: book.notes,
    review: book.review,
    format: book.format,
    publisher: book.publisher,
    yearPublished: book.yearPublished,
    description: book.description,
    categories: book.categories,
    averageRating: book.averageRating,
    ratingsCount: book.ratingsCount,
    isbn: book.isbn,
    stats: book.stats,
  };
};

const loadBooksFromStorage = () => {
  const stored = parseStoredJSON<Partial<Book>[]>(STORAGE_KEYS.books, []);
  return stored.map(normalizeBook).filter((book): book is Book => book !== null);
};

const loadSessionsFromStorage = () => {
  const stored = parseStoredJSON<ReadingSession[]>(STORAGE_KEYS.sessions, []);
  if (stored.length > 0) return stored;
  return parseStoredJSON<ReadingSession[]>(STORAGE_KEYS.legacySessions, []);
};

const loadShelvesFromStorage = () => {
  const stored = parseStoredJSON<Shelf[]>(STORAGE_KEYS.shelves, []);
  if (!Array.isArray(stored) || stored.length === 0) return DEFAULT_SHELVES;
  return stored;
};

const dedupeById = <T extends { id: string }>(items: T[]) => {
  const map = new Map<string, T>();
  items.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
};

const rowToBook = (row: BookRow): Book => ({
  id: row.id,
  title: row.title,
  author: row.author,
  cover: row.cover,
  status: row.status,
  rating: row.rating,
  progress: row.progress,
  pages: row.pages,
  currentPage: row.current_page,
  currentMinutes: row.current_minutes,
  audioDuration: row.audio_duration,
  startDate: row.start_date,
  finishDate: row.finish_date,
  dateRead: row.date_read,
  genre: row.genre,
  notes: row.notes,
  review: row.review,
  format: row.format,
  publisher: row.publisher,
  yearPublished: row.year_published,
  description: row.description,
  categories: row.categories,
  averageRating: row.average_rating,
  ratingsCount: row.ratings_count,
  isbn: row.isbn,
  stats: row.stats,
});

const bookToRow = (book: Book, userId: string): BookRow => ({
  user_id: userId,
  id: book.id,
  title: book.title,
  author: book.author,
  cover: book.cover,
  status: book.status,
  rating: book.rating,
  progress: book.progress,
  pages: book.pages,
  current_page: book.currentPage,
  current_minutes: book.currentMinutes,
  audio_duration: book.audioDuration,
  start_date: book.startDate,
  finish_date: book.finishDate,
  date_read: book.dateRead,
  genre: book.genre,
  notes: book.notes,
  review: book.review,
  format: book.format,
  publisher: book.publisher,
  year_published: book.yearPublished,
  description: book.description,
  categories: book.categories,
  average_rating: book.averageRating,
  ratings_count: book.ratingsCount,
  isbn: book.isbn,
  stats: book.stats,
});

export { BooksContext };

export function BooksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);
  const [bookshelves, setBookshelves] = useState<Shelf[]>(DEFAULT_SHELVES);
  const [isLoaded, setIsLoaded] = useState(false);

  const useSupabase = Boolean(isSupabaseConfigured && supabase && user);

  const persistLocalState = useCallback((next: { books?: Book[]; readingSessions?: ReadingSession[]; bookshelves?: Shelf[] }) => {
    if (next.books) {
      localStorage.setItem(STORAGE_KEYS.books, JSON.stringify(next.books));
    }
    if (next.readingSessions) {
      const serialized = JSON.stringify(next.readingSessions);
      localStorage.setItem(STORAGE_KEYS.sessions, serialized);
      localStorage.setItem(STORAGE_KEYS.legacySessions, serialized);
    }
    if (next.bookshelves) {
      localStorage.setItem(STORAGE_KEYS.shelves, JSON.stringify(next.bookshelves));
    }
  }, []);

  const hydrateFromSupabase = useCallback(async () => {
    if (!supabase || !user) return;

    setIsLoaded(false);

    const [booksResult, sessionsResult, shelvesResult] = await Promise.all([
      supabase.from('books').select('*').eq('user_id', user.id),
      supabase.from('reading_sessions').select('*').eq('user_id', user.id),
      supabase.from('bookshelves').select('*').eq('user_id', user.id),
    ]);

    if (booksResult.error) {
      console.error('Failed to fetch books', booksResult.error);
    }
    if (sessionsResult.error) {
      console.error('Failed to fetch reading sessions', sessionsResult.error);
    }
    if (shelvesResult.error) {
      console.error('Failed to fetch shelves', shelvesResult.error);
    }

    const fetchedBooks = (booksResult.data || [])
      .map((row) => normalizeBook(rowToBook(row as BookRow)))
      .filter((book): book is Book => book !== null);

    const fetchedSessions = ((sessionsResult.data || []) as SessionRow[]).map((row) => ({
      id: row.id,
      bookId: row.book_id,
      pages: row.pages,
      minutes: row.minutes,
      date: row.date,
    }));

    const mappedShelves = ((shelvesResult.data || []) as ShelfRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      bookIds: row.book_ids || [],
    }));

    const fetchedShelves = mappedShelves.length
      ? mappedShelves
      : DEFAULT_SHELVES;

    const uniqueBooks = dedupeById(fetchedBooks);
    const uniqueSessions = dedupeById(fetchedSessions);
    const uniqueShelves = dedupeById(fetchedShelves);

    setBooks(uniqueBooks);
    setReadingSessions(uniqueSessions);
    setBookshelves(uniqueShelves);
    persistLocalState({
      books: uniqueBooks,
      readingSessions: uniqueSessions,
      bookshelves: uniqueShelves,
    });
    setIsLoaded(true);
  }, [persistLocalState, user]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      if (!useSupabase) {
        const localBooks = loadBooksFromStorage();
        const localSessions = loadSessionsFromStorage();
        const localShelves = loadShelvesFromStorage();
        if (!isActive) return;
        setBooks(localBooks);
        setReadingSessions(localSessions);
        setBookshelves(localShelves);
        setIsLoaded(true);
        return;
      }

      await hydrateFromSupabase();
    };

    load();
    return () => {
      isActive = false;
    };
  }, [hydrateFromSupabase, useSupabase]);

  const addBook = async (book: Book) => {
    const normalized = normalizeBook(book);
    if (!normalized) return;

    setBooks((prev) => {
      const exists = prev.some((entry) => entry.id === normalized.id);
      const next = exists
        ? prev.map((entry) => (entry.id === normalized.id ? normalized : entry))
        : [...prev, normalized];
      persistLocalState({ books: next });
      return next;
    });

    if (useSupabase && supabase && user) {
      const row = bookToRow(normalized, user.id);
      const { error } = await supabase.from('books').upsert(row, { onConflict: 'user_id,id' });
      if (error) {
        console.error('Failed to add book', error);
      }
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    let mergedForDb: Book | null = null;

    setBooks((prev) => {
      const next = prev.map((book) => {
        if (book.id !== id) return book;
        const merged = normalizeBook({ ...book, ...updates });
        mergedForDb = merged;
        return merged || book;
      });
      persistLocalState({ books: next });
      return next;
    });

    if (useSupabase && supabase && user && mergedForDb) {
      const row = bookToRow(mergedForDb, user.id);
      const { error } = await supabase.from('books').upsert(row, { onConflict: 'user_id,id' });
      if (error) {
        console.error('Failed to update book', error);
      }
    }
  };

  const deleteBook = async (id: string) => {
    setBooks((prev) => {
      const next = prev.filter((book) => book.id !== id);
      persistLocalState({ books: next });
      return next;
    });
    setReadingSessions((prev) => {
      const next = prev.filter((session) => session.bookId !== id);
      persistLocalState({ readingSessions: next });
      return next;
    });
    setBookshelves((prev) => {
      const next = prev.map((shelf) => ({ ...shelf, bookIds: shelf.bookIds.filter((bookId) => bookId !== id) }));
      persistLocalState({ bookshelves: next });
      return next;
    });

    if (useSupabase && supabase && user) {
      const { error } = await supabase.from('books').delete().eq('user_id', user.id).eq('id', id);
      if (error) {
        console.error('Failed to delete book', error);
      }
    }
  };

  const logReadingSession = async (session: ReadingSession) => {
    setReadingSessions((prev) => {
      const next = [...prev, session];
      persistLocalState({ readingSessions: next });
      return next;
    });

    if (useSupabase && supabase && user) {
      const row: SessionRow = {
        user_id: user.id,
        id: session.id,
        book_id: session.bookId,
        pages: session.pages,
        minutes: session.minutes,
        date: session.date,
      };
      const { error } = await supabase.from('reading_sessions').upsert(row, { onConflict: 'user_id,id' });
      if (error) {
        console.error('Failed to add reading session', error);
      }
    }
  };

  const updateBookshelves = async (newBookshelves: Shelf[]) => {
    setBookshelves(newBookshelves);
    persistLocalState({ bookshelves: newBookshelves });

    if (useSupabase && supabase && user) {
      const rows: ShelfRow[] = newBookshelves.map((shelf) => ({
        user_id: user.id,
        id: shelf.id,
        name: shelf.name,
        book_ids: shelf.bookIds || [],
      }));

      const { error: deleteError } = await supabase.from('bookshelves').delete().eq('user_id', user.id);
      if (deleteError) {
        console.error('Failed to reset shelves', deleteError);
        return;
      }

      if (rows.length > 0) {
        const { error: upsertError } = await supabase.from('bookshelves').upsert(rows, { onConflict: 'user_id,id' });
        if (upsertError) {
          console.error('Failed to update shelves', upsertError);
        }
      }
    }
  };

  const refreshBooks = async () => {
    if (useSupabase) {
      await hydrateFromSupabase();
      return;
    }

    setBooks(loadBooksFromStorage());
    setReadingSessions(loadSessionsFromStorage());
    setBookshelves(loadShelvesFromStorage());
  };

  const fetchMissingCovers = async () => Promise.resolve();
  const refetchAllCovers = async () => ({ success: 0, failed: 0 });
  const restoreCoversFromBackup = () => ({ restored: 0, total: 0 });
  const emergencyRecovery = () => 0;

  const getBooksInShelf = (shelfId: string) => {
    if (shelfId === 'recently-read') {
      return books
        .filter((book) => book.status === 'finished')
        .sort((a, b) => (b.finishDate || '').localeCompare(a.finishDate || ''));
    }

    if (shelfId === 'want-to-read') {
      return books.filter((book) => book.status === 'want-to-read' || book.status === 'on-hold');
    }

    const shelf = bookshelves.find((entry) => entry.id === shelfId);
    if (!shelf) return [];

    return books.filter((book) => shelf.bookIds.includes(book.id));
  };

  const getCurrentlyReading = () => books.filter((book) => book.status === 'reading' || book.status === 'on-hold');
  const getFinishedBooks = () => books.filter((book) => book.status === 'finished');
  const getWantToRead = () => books.filter((book) => book.status === 'want-to-read');

  const value = useMemo<BooksContextType>(
    () => ({
      books,
      readingSessions,
      bookshelves,
      addBook,
      updateBook,
      deleteBook,
      logReadingSession,
      updateBookshelves,
      getBooksInShelf,
      getCurrentlyReading,
      getFinishedBooks,
      getWantToRead,
      refreshBooks,
      fetchMissingCovers,
      refetchAllCovers,
      restoreCoversFromBackup,
      emergencyRecovery,
      isLoaded,
    }),
    [books, readingSessions, bookshelves, isLoaded],
  );

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within BooksProvider');
  }
  return context;
}
