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
import { searchBooksByAuthor } from "../utils/googleBooksApi";

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

type LibraryBook = ReturnType<typeof useBooks>["books"][number];

const normalizeText = (value?: string) => (value || "").toLowerCase().replace(/\s+/g, " ").trim();
const normalizeIsbn = (value?: string) => (value || "").replace(/[^0-9x]/gi, "").toLowerCase();

function isLikelyAuthorMatch(candidateAuthorRaw: string | undefined, targetAuthorRaw: string): boolean {
  const candidate = normalizeText(candidateAuthorRaw);
  const target = normalizeText(targetAuthorRaw);
  if (!candidate || !target) return false;

  if (candidate === target) return true;
  if (candidate.includes(target) || target.includes(candidate)) return true;

  const candidateTokens = candidate.split(" ").filter(Boolean);
  const targetTokens = target.split(" ").filter(Boolean);
  if (candidateTokens.length === 0 || targetTokens.length === 0) return false;

  const candidateLast = candidateTokens[candidateTokens.length - 1];
  const targetLast = targetTokens[targetTokens.length - 1];
  const lastNameMatches = candidateLast === targetLast;
  const firstNameMatches = targetTokens.some((token) => token.length > 2 && candidateTokens.includes(token));

  return lastNameMatches && firstNameMatches;
}

function isLikelyRealBookTitle(titleRaw: string | undefined, targetAuthorRaw: string): boolean {
  const title = normalizeText(titleRaw);
  if (!title) return false;

  const bannedPatterns = [
    "study guide",
    "summary",
    "supersummary",
    "sneak peek",
    "episode",
    "podcast",
    "workbook",
    "analysis",
    "key takeaways",
    "who am i",
    "book summary",
    "quick review",
  ];

  if (bannedPatterns.some((pattern) => title.includes(pattern))) return false;

  // Blocks obvious author-profile pseudo books like "ALICE FEENEY MEMOIR".
  const targetAuthor = normalizeText(targetAuthorRaw);
  if (title.includes(targetAuthor) && (title.includes("memoir") || title.includes("biography"))) {
    return false;
  }

  return true;
}

function buildAuthorsFromBooks(books: LibraryBook[]): AuthorData[] {
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

function toAuthorBookFromLibrary(book: LibraryBook, authorName: string) {
  return {
    title: book.title,
    author: authorName,
    cover: book.cover,
    isbn: book.isbn,
    pages: book.pages,
    status: book.status ?? null,
    inUserLibrary: true,
    userBookId: book.id,
    publishedDate: book.yearPublished,
    series: (book as any).series,
    seriesPosition: (book as any).seriesPosition,
    googleBooksId: `library-${book.id}`,
  };
}

function mergeAuthorCatalog(authorName: string, libraryBooks: LibraryBook[], providerBooks: any[]): AuthorData {
  const merged = new Map<string, AuthorData["books"][number]>();
  const libraryByIsbn = new Map<string, LibraryBook>();
  const libraryByTitle = new Map<string, LibraryBook>();

  const canonicalTitleKey = (titleRaw?: string, authorRaw?: string) =>
    `title:${normalizeText(titleRaw)}::${normalizeText(authorRaw || authorName)}`;

  libraryBooks.forEach((book) => {
    const isbnKey = normalizeIsbn(book.isbn);
    const titleKey = canonicalTitleKey(book.title, book.author || authorName);
    if (isbnKey) libraryByIsbn.set(isbnKey, book);
    libraryByTitle.set(titleKey, book);
  });

  providerBooks.forEach((book) => {
    const isbnKey = normalizeIsbn(book.isbn);
    const titleKey = canonicalTitleKey(book.title, book.author || authorName);
    const inLibrary = (isbnKey ? libraryByIsbn.get(isbnKey) : undefined) || libraryByTitle.get(titleKey);
    const key = titleKey;

    const existing = merged.get(key);
    const next = {
      title: book.title,
      author: book.author || authorName,
      cover: inLibrary?.cover || existing?.cover || book.cover,
      isbn: inLibrary?.isbn || existing?.isbn || book.isbn,
      pages: inLibrary?.pages || existing?.pages || book.pages,
      status: inLibrary?.status || existing?.status || null,
      inUserLibrary: Boolean(inLibrary) || Boolean(existing?.inUserLibrary),
      userBookId: inLibrary?.id || existing?.userBookId,
      publishedDate: inLibrary?.yearPublished || existing?.publishedDate || book.publishedDate,
      series: (inLibrary as any)?.series,
      seriesPosition: (inLibrary as any)?.seriesPosition,
      googleBooksId: book.id || book.googleBooksId,
    } as AuthorData["books"][number];
    merged.set(key, next);
  });

  // Ensure all local books exist even if provider misses them.
  libraryBooks.forEach((book) => {
    const key = canonicalTitleKey(book.title, book.author || authorName);
    const existing = merged.get(key);
    const local = toAuthorBookFromLibrary(book, authorName);
    if (!existing) {
      merged.set(key, local);
      return;
    }
    // Prefer local-library truth for status/user linkage.
    merged.set(key, {
      ...existing,
      cover: local.cover || existing.cover,
      isbn: local.isbn || existing.isbn,
      pages: local.pages || existing.pages,
      status: local.status || existing.status,
      inUserLibrary: true,
      userBookId: local.userBookId,
      publishedDate: local.publishedDate || existing.publishedDate,
    });
  });

  const books = Array.from(merged.values()).sort((a, b) => normalizeText(a.title).localeCompare(normalizeText(b.title)));
  const booksRead = books.filter((book) => book.inUserLibrary && book.status === "finished").length;

  return {
    name: authorName,
    books,
    booksRead,
    totalBooks: books.length,
    bio: `${authorName} bibliography merged with your library.`,
    image: "",
  };
}

async function buildAuthorsWithBibliography(
  books: LibraryBook[],
  onProgress?: (current: number, total: number, authorName: string) => void,
): Promise<AuthorData[]> {
  if (books.length === 0) return getAllCachedAuthors();

  const authorNames = Array.from(
    new Set(
      books
        .map((book) => book.author?.trim())
        .filter((name): name is string => Boolean(name)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const results: AuthorData[] = [];

  for (let index = 0; index < authorNames.length; index += 1) {
    const authorName = authorNames[index];
    onProgress?.(index + 1, authorNames.length, authorName);

    const libraryBooks = books.filter((book) => normalizeText(book.author) === normalizeText(authorName));

    try {
      const providerBooks = await searchBooksByAuthor(authorName);
      const filteredProviderBooks = (providerBooks || []).filter((providerBook) => {
        return (
          isLikelyAuthorMatch(providerBook.author, authorName) &&
          isLikelyRealBookTitle(providerBook.title, authorName)
        );
      });
      const merged = mergeAuthorCatalog(authorName, libraryBooks, filteredProviderBooks);
      results.push(merged);
    } catch (error) {
      console.warn(`Failed to enrich author "${authorName}"`, error);
      results.push({
        name: authorName,
        books: libraryBooks.map((book) => toAuthorBookFromLibrary(book, authorName)),
        booksRead: libraryBooks.filter((book) => book.status === "finished").length,
        totalBooks: libraryBooks.length,
        bio: `${authorName} (library only)`,
        image: "",
      });
    }
  }

  return results.sort((a, b) => b.booksRead - a.booksRead || b.totalBooks - a.totalBooks);
}

export function AuthorProvider({ children }: { children: ReactNode }) {
  const { books } = useBooks();
  const [authors, setAuthors] = useState<AuthorData[]>(() => buildAuthorsFromBooks(books));
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number; authorName: string } | null>(null);

  useEffect(() => {
    setAuthors(buildAuthorsFromBooks(books));
  }, [books]);

  const runFullSync = useCallback(async () => {
    if (books.length === 0) {
      setAuthors([]);
      return;
    }

    setIsLoading(true);
    setIsSyncing(true);
    setSyncProgress(null);

    try {
      const enriched = await buildAuthorsWithBibliography(books, (current, total, authorName) => {
        setSyncProgress({ current, total, authorName });
      });
      setAuthors(enriched);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
      setSyncProgress(null);
    }
  }, [books]);

  const refreshAuthor = useCallback(
    async (authorName: string) => {
      const normalizedName = normalizeText(authorName);
      const libraryBooks = books.filter((book) => normalizeText(book.author) === normalizedName);
      if (libraryBooks.length === 0) return;

      try {
        setIsSyncing(true);
        setSyncProgress({ current: 1, total: 1, authorName });
        const providerBooks = await searchBooksByAuthor(authorName);
        const filteredProviderBooks = (providerBooks || []).filter((providerBook) => {
          return (
            isLikelyAuthorMatch(providerBook.author, authorName) &&
            isLikelyRealBookTitle(providerBook.title, authorName)
          );
        });
        const merged = mergeAuthorCatalog(authorName, libraryBooks, filteredProviderBooks);

        setAuthors((prev) => {
          const filtered = prev.filter((author) => normalizeText(author.name) !== normalizedName);
          return [...filtered, merged].sort((a, b) => b.booksRead - a.booksRead || b.totalBooks - a.totalBooks);
        });
      } finally {
        setIsSyncing(false);
        setSyncProgress(null);
      }
    },
    [books],
  );

  const refreshAllAuthors = useCallback(async () => {
    await runFullSync();
  }, [runFullSync]);

  const loadNewAuthors = useCallback(async () => {
    await runFullSync();
  }, [runFullSync]);

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
      isLoading,
      isSyncing,
      syncProgress,
      refreshAuthor,
      refreshAllAuthors,
      loadNewAuthors,
      searchAuthors,
      getAuthorByName,
      getAllSeries,
      isLoaded: true,
    }),
    [authors, isLoading, isSyncing, syncProgress, refreshAuthor, refreshAllAuthors, loadNewAuthors, searchAuthors, getAuthorByName, getAllSeries],
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
