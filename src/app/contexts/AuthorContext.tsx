import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useBooks } from "./BooksContext";
import type { AuthorData, SeriesData } from "../utils/authorDatabase";
import { extractSeries, getAllCachedAuthors } from "../utils/authorDatabase";

interface AuthorContextType {
  authors: AuthorData[];
  isLoading: boolean;
  isSyncing: boolean;
  syncProgress: { current: number; total: number; authorName: string } | null;
  refreshAuthor: (authorName: string) => Promise<void>;
  refreshAllAuthors: () => Promise<void>;
  loadNewAuthors: () => Promise<void>;
  searchAuthors: (query: string) => AuthorData[];
  getAuthorByName: (name: string) => AuthorData | undefined;
  getAllSeries: () => SeriesData[];
  isLoaded: boolean;
}

const AuthorContext = createContext<AuthorContextType | undefined>(undefined);

function buildAuthorsFromBooks(books: ReturnType<typeof useBooks>["books"]): AuthorData[] {
  if (books.length === 0) return getAllCachedAuthors();

  const grouped = new Map<string, AuthorData>();

  for (const book of books) {
    if (!book.author) continue;

    const name = book.author.trim();
    const existing = grouped.get(name);
    const authorBook = {
      title: book.title,
      author: name,
      cover: book.cover,
      isbn: book.isbn,
      pages: book.pages,
      status: book.status ?? null,
      inUserLibrary: true,
      userBookId: book.id,
      publishedDate: book.yearPublished,
      series: (book as any).series,
      seriesPosition: (book as any).seriesPosition,
      googleBooksId: `mock-${book.id}`,
    };

    if (!existing) {
      grouped.set(name, {
        name,
        books: [authorBook],
        booksRead: book.status === "finished" ? 1 : 0,
        totalBooks: 1,
        bio: `${name} mock profile for UI preview.`,
        image: "",
      });
      continue;
    }

    existing.books.push(authorBook);
    existing.totalBooks += 1;
    if (book.status === "finished") {
      existing.booksRead += 1;
    }
  }

  return [...grouped.values()].sort((a, b) => b.booksRead - a.booksRead);
}

export function AuthorProvider({ children }: { children: ReactNode }) {
  const { books } = useBooks();
  const [authors, setAuthors] = useState<AuthorData[]>(() => buildAuthorsFromBooks(books));

  useEffect(() => {
    setAuthors(buildAuthorsFromBooks(books));
  }, [books]);

  const refreshAuthor = useCallback(
    async (authorName: string) => {
      setAuthors((prev) => {
        const next = buildAuthorsFromBooks(books);
        const requested = next.find((author) => author.name.toLowerCase() === authorName.toLowerCase());
        if (!requested) return prev;
        const filtered = prev.filter((author) => author.name.toLowerCase() !== authorName.toLowerCase());
        return [...filtered, requested].sort((a, b) => b.booksRead - a.booksRead);
      });
    },
    [books],
  );

  const refreshAllAuthors = useCallback(async () => {
    setAuthors(buildAuthorsFromBooks(books));
  }, [books]);

  const loadNewAuthors = useCallback(async () => {
    setAuthors(buildAuthorsFromBooks(books));
  }, [books]);

  const searchAuthors = useCallback(
    (query: string) => {
      if (!query.trim()) return authors;
      const normalized = query.toLowerCase();
      return authors.filter((author) => author.name.toLowerCase().includes(normalized));
    },
    [authors],
  );

  const getAuthorByName = useCallback(
    (name: string) => authors.find((author) => author.name.toLowerCase() === name.toLowerCase()),
    [authors],
  );

  const getAllSeries = useCallback(() => {
    const series = authors.flatMap((author) => extractSeries(author));
    return series.sort((a, b) => b.booksRead - a.booksRead);
  }, [authors]);

  const value = useMemo<AuthorContextType>(
    () => ({
      authors,
      isLoading: false,
      isSyncing: false,
      syncProgress: null,
      refreshAuthor,
      refreshAllAuthors,
      loadNewAuthors,
      searchAuthors,
      getAuthorByName,
      getAllSeries,
      isLoaded: true,
    }),
    [authors, refreshAuthor, refreshAllAuthors, loadNewAuthors, searchAuthors, getAuthorByName, getAllSeries],
  );

  return <AuthorContext.Provider value={value}>{children}</AuthorContext.Provider>;
}

export function useAuthors() {
  const context = useContext(AuthorContext);
  if (!context) {
    throw new Error("useAuthors must be used within AuthorProvider");
  }
  return context;
}
