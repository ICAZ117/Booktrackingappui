import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Book as AppBook, Shelf } from "../types/book";

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

const MOCK_BOOKS: Book[] = [
  {
    id: "book-1",
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    cover: "https://covers.openlibrary.org/b/isbn/9781649374042-L.jpg",
    status: "reading",
    progress: 67,
    pages: 600,
    currentPage: 402,
    genre: "Fantasy",
    startDate: "Feb 10, 2026",
    isbn: "9781649374042",
    format: "physical",
  },
  {
    id: "book-2",
    title: "The Housemaid",
    author: "Freida McFadden",
    cover: "https://covers.openlibrary.org/b/isbn/9781538742570-L.jpg",
    status: "reading",
    progress: 23,
    pages: 336,
    currentPage: 77,
    genre: "Thriller",
    startDate: "Mar 2, 2026",
    isbn: "9781538742570",
  },
  {
    id: "book-3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg",
    status: "finished",
    progress: 100,
    pages: 500,
    currentPage: 500,
    genre: "Sci-Fi",
    rating: 5,
    finishDate: "2026-02-11",
    isbn: "9780593135204",
  },
  {
    id: "book-4",
    title: "Happy Place",
    author: "Emily Henry",
    cover: "https://covers.openlibrary.org/b/isbn/9780593441275-L.jpg",
    status: "want-to-read",
    progress: 0,
    pages: 400,
    genre: "Romance",
    isbn: "9780593441275",
  },
  {
    id: "book-5",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    cover: "https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg",
    status: "finished",
    progress: 100,
    pages: 336,
    currentPage: 336,
    genre: "Mystery",
    finishDate: "2026-01-20",
    rating: 4,
    isbn: "9781250301697",
  },
  {
    id: "book-6",
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg",
    status: "reading",
    progress: 41,
    pages: 304,
    currentPage: 125,
    genre: "Fiction",
    isbn: "9780525559474",
  },
  {
    id: "book-7",
    title: "Iron Flame",
    author: "Rebecca Yarros",
    cover: "https://covers.openlibrary.org/b/isbn/9781649374172-L.jpg",
    status: "want-to-read",
    progress: 0,
    pages: 640,
    genre: "Fantasy",
    isbn: "9781649374172",
  },
  {
    id: "book-8",
    title: "Dark Matter",
    author: "Blake Crouch",
    cover: "https://covers.openlibrary.org/b/isbn/9781101904220-L.jpg",
    status: "finished",
    progress: 100,
    pages: 352,
    currentPage: 352,
    genre: "Sci-Fi",
    rating: 5,
    finishDate: "2026-03-01",
    isbn: "9781101904220",
  },
];

const MOCK_SESSIONS: ReadingSession[] = [
  { id: "session-1", bookId: "book-1", pages: 24, minutes: 35, date: "2026-03-18" },
  { id: "session-2", bookId: "book-2", pages: 31, minutes: 42, date: "2026-03-19" },
  { id: "session-3", bookId: "book-1", pages: 18, minutes: 28, date: "2026-03-20" },
  { id: "session-4", bookId: "book-6", pages: 27, minutes: 33, date: "2026-03-21" },
  { id: "session-5", bookId: "book-1", pages: 22, minutes: 30, date: "2026-03-22" },
];

const DEFAULT_SHELVES: Shelf[] = [
  { id: "favorites", name: "Favorites", bookIds: ["book-3", "book-8"] },
  { id: "best-of-2026", name: "Best Reads of 2026", bookIds: ["book-3", "book-8"] },
  { id: "want-to-read", name: "Want to Read", bookIds: ["book-4", "book-7"] },
  { id: "dnf", name: "DNF", bookIds: [] },
  { id: "recently-read", name: "Recently Read", bookIds: [] },
];

export { BooksContext };

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books] = useState<Book[]>(MOCK_BOOKS);
  const [readingSessions] = useState<ReadingSession[]>(MOCK_SESSIONS);
  const [bookshelves] = useState<Shelf[]>(DEFAULT_SHELVES);

  const readOnlyNotice = () => {
    console.info("UI-only mode: data actions are disabled in this repository.");
  };

  const addBook = async (_book: Book) => readOnlyNotice();
  const updateBook = async (_id: string, _updates: Partial<Book>) => readOnlyNotice();
  const deleteBook = async (_id: string) => readOnlyNotice();
  const logReadingSession = async (_session: ReadingSession) => readOnlyNotice();
  const updateBookshelves = async (_newBookshelves: Shelf[]) => readOnlyNotice();
  const refreshBooks = async () => Promise.resolve();
  const fetchMissingCovers = async () => Promise.resolve();
  const refetchAllCovers = async () => ({ success: 0, failed: 0 });
  const restoreCoversFromBackup = () => ({ restored: 0, total: 0 });
  const emergencyRecovery = () => 0;

  const getBooksInShelf = (shelfId: string) => {
    if (shelfId === "recently-read") {
      return books
        .filter((book) => book.status === "finished")
        .sort((a, b) => (b.finishDate || "").localeCompare(a.finishDate || ""));
    }

    if (shelfId === "want-to-read") {
      return books.filter((book) => book.status === "want-to-read" || book.status === "on-hold");
    }

    const shelf = bookshelves.find((entry) => entry.id === shelfId);
    if (!shelf) return [];

    return books.filter((book) => shelf.bookIds.includes(book.id));
  };

  const getCurrentlyReading = () =>
    books.filter((book) => book.status === "reading" || book.status === "on-hold");

  const getFinishedBooks = () => books.filter((book) => book.status === "finished");

  const getWantToRead = () => books.filter((book) => book.status === "want-to-read");

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
      isLoaded: true,
    }),
    [books, readingSessions, bookshelves],
  );

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks must be used within BooksProvider");
  }
  return context;
}
