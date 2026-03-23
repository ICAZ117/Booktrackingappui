export interface AuthorBook {
  title: string;
  author: string;
  cover?: string;
  isbn?: string;
  pages?: number;
  status: string | null;
  inUserLibrary: boolean;
  userBookId?: string;
  publishedDate?: string;
  series?: string;
  seriesPosition?: number;
  googleBooksId?: string;
}

export interface AuthorData {
  name: string;
  books: AuthorBook[];
  booksRead: number;
  totalBooks: number;
  bio?: string;
  image?: string;
}

export interface SeriesData {
  name: string;
  author: string;
  books: AuthorBook[];
  booksRead: number;
  totalBooks: number;
}

const STORAGE_KEY = "readtrack_google_books_api_key";

const fallbackAuthors: AuthorData[] = [
  {
    name: "Rebecca Yarros",
    booksRead: 1,
    totalBooks: 2,
    books: [
      {
        title: "Fourth Wing",
        author: "Rebecca Yarros",
        inUserLibrary: true,
        status: "reading",
        googleBooksId: "mock-fourth-wing",
        series: "The Empyrean",
        seriesPosition: 1,
      },
      {
        title: "Iron Flame",
        author: "Rebecca Yarros",
        inUserLibrary: true,
        status: "want-to-read",
        googleBooksId: "mock-iron-flame",
        series: "The Empyrean",
        seriesPosition: 2,
      },
    ],
    bio: "Mock data for UI-only preview mode.",
    image: "",
  },
  {
    name: "Andy Weir",
    booksRead: 1,
    totalBooks: 1,
    books: [
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        inUserLibrary: true,
        status: "finished",
        googleBooksId: "mock-project-hail-mary",
      },
    ],
    bio: "Mock data for UI-only preview mode.",
    image: "",
  },
];

export function getAllCachedAuthors(): AuthorData[] {
  return fallbackAuthors;
}

export async function addOrUpdateAuthor(
  authorName: string,
  books: Array<{ id: string; title: string; author?: string; status?: string; cover?: string; isbn?: string; pages?: number; yearPublished?: string; series?: string; seriesPosition?: number }>,
  _forceRefresh = false,
): Promise<AuthorData | null> {
  const matching = books.filter((book) => (book.author || "").toLowerCase().includes(authorName.toLowerCase()));
  if (matching.length === 0) {
    return fallbackAuthors.find((author) => author.name.toLowerCase() === authorName.toLowerCase()) || null;
  }

  const mappedBooks: AuthorBook[] = matching.map((book) => ({
    title: book.title,
    author: book.author || authorName,
    cover: book.cover,
    isbn: book.isbn,
    pages: book.pages,
    status: book.status || null,
    inUserLibrary: true,
    userBookId: book.id,
    publishedDate: book.yearPublished,
    series: book.series,
    seriesPosition: book.seriesPosition,
    googleBooksId: `mock-${book.id}`,
  }));

  return {
    name: authorName,
    books: mappedBooks,
    booksRead: mappedBooks.filter((book) => book.status === "finished").length,
    totalBooks: mappedBooks.length,
    bio: `${authorName} mock profile for UI-only mode.`,
    image: "",
  };
}

export async function batchUpdateAuthors(
  authorNames: string[],
  books: Array<{ id: string; title: string; author?: string; status?: string; cover?: string; isbn?: string; pages?: number; yearPublished?: string; series?: string; seriesPosition?: number }>,
  onProgress?: (current: number, total: number, authorName: string) => void,
): Promise<AuthorData[]> {
  const results: AuthorData[] = [];

  for (let index = 0; index < authorNames.length; index += 1) {
    const authorName = authorNames[index];
    onProgress?.(index + 1, authorNames.length, authorName);
    const author = await addOrUpdateAuthor(authorName, books, true);
    if (author) {
      results.push(author);
    }
  }

  return results;
}

export function extractSeries(author: AuthorData): SeriesData[] {
  const grouped = new Map<string, AuthorBook[]>();

  for (const book of author.books) {
    if (!book.series) continue;
    const existing = grouped.get(book.series) || [];
    existing.push(book);
    grouped.set(book.series, existing);
  }

  return [...grouped.entries()].map(([name, books]) => ({
    name,
    author: author.name,
    books,
    booksRead: books.filter((book) => book.status === "finished").length,
    totalBooks: books.length,
  }));
}

export function searchAuthors(query: string): AuthorData[] {
  if (!query.trim()) return getAllCachedAuthors();
  const normalized = query.toLowerCase();
  return getAllCachedAuthors().filter((author) => author.name.toLowerCase().includes(normalized));
}

export function setGoogleBooksApiKey(apiKey: string) {
  try {
    localStorage.setItem(STORAGE_KEY, apiKey);
  } catch {
    // Ignore in non-browser contexts.
  }
}

export function getGoogleBooksApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function clearGoogleBooksApiKey() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore in non-browser contexts.
  }
}

export function hasApiKey() {
  return getGoogleBooksApiKey().trim().length > 0;
}
