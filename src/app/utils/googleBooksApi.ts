export interface SearchBooksParams {
  query: string;
  maxResults?: number;
  startIndex?: number;
  orderBy?: 'relevance' | 'newest';
}

export interface GoogleBookVolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  pageCount?: number;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
  publishedDate?: string;
  printType?: string;
}

export interface GoogleBook {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

export interface BookData {
  id?: string;
  googleBooksId?: string;
  title: string;
  author: string;
  cover: string;
  pages?: number;
  genre?: string;
  genres?: string[];
  rating?: number;
  ratingsCount?: number;
  description?: string;
  isbn?: string;
  publishedDate?: string;
  status?: string;
  format?: string;
}

interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  isbn?: string[];
  number_of_pages_median?: number;
  first_publish_year?: number;
  subject?: string[];
}

interface OpenLibraryAuthorDoc {
  key?: string;
  name?: string;
}

interface OpenLibraryWorkDoc {
  key?: string;
  title?: string;
  covers?: number[];
  subject?: string[];
  first_publish_year?: number;
  authors?: Array<{ author?: { key?: string } }>;
}

interface ItunesAudiobookResult {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  releaseDate?: string;
  artworkUrl100?: string;
  primaryGenreName?: string;
  description?: string;
}

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
const OPEN_LIBRARY_SEARCH_API_URL = 'https://openlibrary.org/search.json';
const OPEN_LIBRARY_AUTHOR_SEARCH_API_URL = 'https://openlibrary.org/search/authors.json';
const ITUNES_SEARCH_API_URL = 'https://itunes.apple.com/search';
const customSearchEndpoint = import.meta.env.VITE_BOOK_SEARCH_ENDPOINT || '';
const googleBooksApiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || '';
const SEARCH_CACHE_TTL_MS = 15 * 60 * 1000;
const SEARCH_CACHE_PREFIX = 'readtrack_search_cache_v6:';

function ensureHttps(url?: string) {
  if (!url) return '';
  return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
}

function buildGoogleUrl(params: SearchBooksParams) {
  const url = new URL(GOOGLE_BOOKS_API_URL);
  url.searchParams.set('q', params.query);
  url.searchParams.set('maxResults', String(Math.min(params.maxResults || 20, 40)));
  url.searchParams.set('startIndex', String(params.startIndex || 0));
  url.searchParams.set('orderBy', params.orderBy || 'relevance');
  url.searchParams.set('printType', 'all');
  if (googleBooksApiKey) {
    url.searchParams.set('key', googleBooksApiKey);
  }
  return url.toString();
}

function normalizeText(value?: string) {
  return (value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function looksLikeAuthorQuery(query: string) {
  const q = normalizeText(query);
  if (!q || q.includes(':') || q.includes('"')) return false;
  const words = q.split(' ').filter(Boolean);
  return words.length >= 2 && words.length <= 4;
}

function openLibraryCoverByIsbn(isbn?: string) {
  if (!isbn) return '';
  const clean = isbn.replace(/[^0-9X]/gi, '');
  if (!clean) return '';
  return `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`;
}

async function fetchGoogleBooks(params: SearchBooksParams): Promise<GoogleBook[]> {
  const response = await fetch(buildGoogleUrl(params));
  if (!response.ok) {
    throw new Error(`Google Books request failed (${response.status})`);
  }

  const payload = await response.json();
  if (!payload?.items || !Array.isArray(payload.items)) return [];
  return payload.items as GoogleBook[];
}

async function fetchOpenLibraryBooks(query: string, limit = 20): Promise<GoogleBook[]> {
  const url = new URL(OPEN_LIBRARY_SEARCH_API_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(Math.min(limit, 50)));

  const response = await fetch(url.toString());
  if (!response.ok) return [];

  const payload = await response.json();
  const docs: OpenLibraryDoc[] = payload?.docs || [];
  return docs.map((doc, index) => convertOpenLibraryDocToGoogleBook(doc, `${query}-${index}`));
}

async function fetchOpenLibraryByAuthor(author: string, limit = 20): Promise<GoogleBook[]> {
  const url = new URL(OPEN_LIBRARY_SEARCH_API_URL);
  url.searchParams.set('author', author);
  url.searchParams.set('limit', String(Math.min(limit, 50)));

  const response = await fetch(url.toString());
  if (!response.ok) return [];

  const payload = await response.json();
  const docs: OpenLibraryDoc[] = payload?.docs || [];
  return docs.map((doc, index) => convertOpenLibraryDocToGoogleBook(doc, `author-${author}-${index}`));
}

async function fetchOpenLibraryAuthorWorks(author: string, limit = 80): Promise<GoogleBook[]> {
  try {
    const authorSearchUrl = new URL(OPEN_LIBRARY_AUTHOR_SEARCH_API_URL);
    authorSearchUrl.searchParams.set('q', author);
    authorSearchUrl.searchParams.set('limit', '10');

    const searchResponse = await fetch(authorSearchUrl.toString());
    if (!searchResponse.ok) return [];

    const searchPayload = await searchResponse.json();
    const authorDocs: OpenLibraryAuthorDoc[] = searchPayload?.docs || [];
    if (!authorDocs.length) return [];

    const normalizedAuthor = normalizeText(author);
    const bestAuthor =
      authorDocs.find((doc) => normalizeText(doc.name) === normalizedAuthor) ||
      authorDocs.find((doc) => normalizeText(doc.name).includes(normalizedAuthor)) ||
      authorDocs[0];

    if (!bestAuthor?.key) return [];

    const worksUrl = new URL(`https://openlibrary.org${bestAuthor.key}/works.json`);
    worksUrl.searchParams.set('limit', String(Math.min(limit, 200)));

    const worksResponse = await fetch(worksUrl.toString());
    if (!worksResponse.ok) return [];

    const worksPayload = await worksResponse.json();
    const works: OpenLibraryWorkDoc[] = worksPayload?.entries || [];

    return works.map((work, index) => ({
      id: work.key || `openlib-work-${index}`,
      volumeInfo: {
        title: work.title || 'Untitled',
        authors: [bestAuthor.name || author],
        categories: work.subject?.slice(0, 5),
        publishedDate: work.first_publish_year ? String(work.first_publish_year) : undefined,
        imageLinks: work.covers?.[0]
          ? {
              thumbnail: `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg`,
              smallThumbnail: `https://covers.openlibrary.org/b/id/${work.covers[0]}-M.jpg`,
            }
          : undefined,
        printType: 'BOOK',
      },
    }));
  } catch {
    return [];
  }
}

async function fetchItunesAudiobooks(query: string, limit = 40): Promise<GoogleBook[]> {
  try {
    const url = new URL(ITUNES_SEARCH_API_URL);
    url.searchParams.set('term', query);
    url.searchParams.set('entity', 'audiobook');
    url.searchParams.set('limit', String(Math.min(limit, 50)));

    const response = await fetch(url.toString());
    if (!response.ok) return [];
    const payload = await response.json();
    const results: ItunesAudiobookResult[] = payload?.results || [];

    return results.map((item, index) => {
      const coverBase = item.artworkUrl100 || '';
      const cover = coverBase
        ? coverBase
            .replace('/100x100bb.', '/600x600bb.')
            .replace('/100x100.', '/600x600.')
        : undefined;

      return {
        id: item.trackId ? `itunes-audio-${item.trackId}` : `itunes-audio-${index}`,
        volumeInfo: {
          title: item.trackName || 'Untitled',
          authors: item.artistName ? [item.artistName] : ['Unknown Author'],
          categories: item.primaryGenreName ? [item.primaryGenreName] : undefined,
          description: item.description,
          publishedDate: item.releaseDate,
          imageLinks: cover
            ? {
                thumbnail: cover,
                smallThumbnail: cover,
              }
            : undefined,
          printType: 'AUDIOBOOK',
        },
      };
    });
  } catch {
    return [];
  }
}

async function fetchFromCustomEndpoint(params: SearchBooksParams): Promise<GoogleBook[] | null> {
  if (!customSearchEndpoint) return null;

  try {
    const url = new URL(customSearchEndpoint);
    url.searchParams.set('q', params.query);
    url.searchParams.set('limit', String(params.maxResults || 20));
    if (params.startIndex !== undefined) {
      url.searchParams.set('offset', String(params.startIndex));
    }
    if (params.orderBy) {
      url.searchParams.set('orderBy', params.orderBy);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Book search endpoint failed (${response.status})`);
    }

    const payload = await response.json();
    if (!payload) return [];

    if (Array.isArray(payload.items)) {
      return payload.items as GoogleBook[];
    }

    if (Array.isArray(payload.results)) {
      return payload.results as GoogleBook[];
    }

    if (Array.isArray(payload)) {
      return payload as GoogleBook[];
    }

    return [];
  } catch (error) {
    console.warn('Custom search endpoint unavailable; using provider fallback.', error);
    return null;
  }
}

function pickIsbn(identifiers?: Array<{ type: string; identifier: string }>) {
  if (!identifiers) return undefined;
  const isbn13 = identifiers.find((entry) => entry.type === 'ISBN_13');
  if (isbn13) return isbn13.identifier;
  const isbn = identifiers.find((entry) => entry.type.includes('ISBN'));
  return isbn?.identifier;
}

function convertOpenLibraryDocToGoogleBook(doc: OpenLibraryDoc, fallbackId: string): GoogleBook {
  const cover = doc.cover_i
    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
    : openLibraryCoverByIsbn(doc.isbn?.[0]) || undefined;
  const isbn = doc.isbn?.[0];

  return {
    id: doc.key || `openlib-${fallbackId}`,
    volumeInfo: {
      title: doc.title || 'Untitled',
      authors: doc.author_name || ['Unknown Author'],
      categories: doc.subject?.slice(0, 5),
      pageCount: doc.number_of_pages_median,
      publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
      industryIdentifiers: isbn ? [{ type: 'ISBN_13', identifier: isbn }] : undefined,
      imageLinks: {
        thumbnail: cover,
        smallThumbnail: cover,
      },
      printType: 'BOOK',
    },
  };
}

function dedupeBooks(books: GoogleBook[]) {
  const map = new Map<string, GoogleBook>();
  for (const book of books) {
    const info = book.volumeInfo;
    const key = `${(info.title || '').toLowerCase()}::${(info.authors?.[0] || '').toLowerCase()}`;
    if (!map.has(key)) {
      map.set(key, book);
    }
  }
  return Array.from(map.values());
}

function getCacheKey(params: SearchBooksParams) {
  return `${SEARCH_CACHE_PREFIX}${JSON.stringify({
    q: params.query,
    maxResults: params.maxResults || 20,
    startIndex: params.startIndex || 0,
    orderBy: params.orderBy || 'relevance',
  })}`;
}

function readCachedSearch(params: SearchBooksParams): GoogleBook[] | null {
  try {
    const key = getCacheKey(params);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timestamp: number; items: GoogleBook[] };
    if (!parsed?.timestamp || !Array.isArray(parsed.items)) return null;
    if (Date.now() - parsed.timestamp > SEARCH_CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.items;
  } catch {
    return null;
  }
}

function writeCachedSearch(params: SearchBooksParams, items: GoogleBook[]) {
  try {
    const key = getCacheKey(params);
    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        items,
      }),
    );
  } catch {
    // Ignore cache write failures (private mode / quota, etc).
  }
}

function computeRelevanceScore(book: GoogleBook, query: string) {
  const normalizedQuery = normalizeText(query);
  const tokens = normalizedQuery.split(' ').filter(Boolean);
  const title = normalizeText(book.volumeInfo.title);
  const author = normalizeText(book.volumeInfo.authors?.[0]);
  const allAuthors = normalizeText((book.volumeInfo.authors || []).join(' '));
  const published = normalizeText(book.volumeInfo.publishedDate);

  let score = 0;

  if (author && normalizedQuery && author === normalizedQuery) score += 120;
  if (author && normalizedQuery && author.includes(normalizedQuery)) score += 80;
  if (allAuthors && normalizedQuery && allAuthors.includes(normalizedQuery)) score += 50;
  if (title && normalizedQuery && title.includes(normalizedQuery)) score += 35;

  for (const token of tokens) {
    if (author.includes(token)) score += 18;
    if (title.includes(token)) score += 10;
  }

  // Small bonus for richer metadata (usually better catalog quality).
  if (book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail) score += 5;
  if (book.volumeInfo.pageCount) score += 2;
  if (published) {
    const year = Number(published.slice(0, 4));
    if (!Number.isNaN(year) && year >= 2025) score += 8;
    if (!Number.isNaN(year) && year >= 2026) score += 6;
  }

  return score;
}

function rankAndFilterBooks(books: GoogleBook[], query: string) {
  const authorMode = looksLikeAuthorQuery(query);
  const normalizedQuery = normalizeText(query);

  const scored = books
    .map((book) => ({
      book,
      score: computeRelevanceScore(book, query),
    }))
    .filter(({ book, score }) => {
      if (score < 18) return false;
      if (!authorMode) return true;

      const author = normalizeText(book.volumeInfo.authors?.[0]);
      const allAuthors = normalizeText((book.volumeInfo.authors || []).join(' '));
      const title = normalizeText(book.volumeInfo.title);

      return author.includes(normalizedQuery) || allAuthors.includes(normalizedQuery);
    })
    .sort((a, b) => b.score - a.score);

  return scored.map(({ book }) => book);
}

export async function searchBooks(params: SearchBooksParams): Promise<GoogleBook[]> {
  const cached = readCachedSearch(params);
  if (cached && cached.length > 0) {
    return cached;
  }

  const endpointResult = await fetchFromCustomEndpoint(params);
  if (endpointResult) {
    const deduped = dedupeBooks(endpointResult).slice(0, params.maxResults || 20);
    writeCachedSearch(params, deduped);
    return deduped;
  }

  const authorMode = looksLikeAuthorQuery(params.query);
  const authorQuery = `inauthor:"${params.query}"`;

  const [
    googleResults,
    googleAuthorResults,
    googleAuthorNewestResults,
    googleAuthorNewestResultsPage2,
    openLibraryResults,
    openLibraryAuthorResults,
    openLibraryAuthorWorks,
    itunesAudiobookResults,
  ] = await Promise.all([
    fetchGoogleBooks(params).catch((error) => {
      console.warn('Google Books search failed', error);
      return [] as GoogleBook[];
    }),
    authorMode
      ? fetchGoogleBooks({ ...params, query: authorQuery }).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
    authorMode
      ? fetchGoogleBooks({
          ...params,
          query: authorQuery,
          orderBy: 'newest',
          maxResults: Math.max(params.maxResults || 20, 40),
          startIndex: 0,
        }).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
    authorMode
      ? fetchGoogleBooks({
          ...params,
          query: authorQuery,
          orderBy: 'newest',
          maxResults: 40,
          startIndex: 40,
        }).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
    fetchOpenLibraryBooks(params.query, params.maxResults || 20).catch(() => [] as GoogleBook[]),
    authorMode
      ? fetchOpenLibraryByAuthor(params.query, Math.max(params.maxResults || 20, 50)).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
    authorMode
      ? fetchOpenLibraryAuthorWorks(params.query, 100).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
    authorMode
      ? fetchItunesAudiobooks(params.query, 50).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
  ]);

  const merged = dedupeBooks([
    ...googleAuthorNewestResults,
    ...googleAuthorNewestResultsPage2,
    ...googleAuthorResults,
    ...googleResults,
    ...openLibraryAuthorWorks,
    ...openLibraryAuthorResults,
    ...openLibraryResults,
    ...itunesAudiobookResults,
  ]);
  const ranked = rankAndFilterBooks(merged, params.query);
  const deduped = ranked.slice(0, params.maxResults || 20);
  writeCachedSearch(params, deduped);
  return deduped;
}

export async function getTrendingBooks(genre?: string): Promise<GoogleBook[]> {
  const genreQuery = genre ? `subject:${genre}` : 'subject:fiction bestseller';
  return searchBooks({
    query: genreQuery,
    maxResults: 24,
    orderBy: 'newest',
  });
}

export async function getBookByISBN(isbn: string): Promise<GoogleBook | null> {
  const cleaned = isbn.replace(/[^0-9X]/gi, '');
  if (!cleaned) return null;

  const results = await searchBooks({
    query: `isbn:${cleaned}`,
    maxResults: 5,
  });

  const exactMatch =
    results.find((book) =>
      (book.volumeInfo.industryIdentifiers || []).some(
        (identifier) => identifier.identifier.replace(/[^0-9X]/gi, '') === cleaned,
      ),
    ) || null;

  return exactMatch;
}

export function convertGoogleBookToBookData(googleBook: GoogleBook): BookData {
  const info = googleBook.volumeInfo;
  const isbn = pickIsbn(info.industryIdentifiers);
  const cover =
    ensureHttps(info.imageLinks?.thumbnail) ||
    ensureHttps(info.imageLinks?.smallThumbnail) ||
    openLibraryCoverByIsbn(isbn) ||
    '';
  const printType = (info.printType || '').toLowerCase();

  return {
    id: googleBook.id,
    googleBooksId: googleBook.id,
    title: info.title,
    author: info.authors?.[0] || 'Unknown Author',
    cover,
    pages: info.pageCount,
    genre: info.categories?.[0],
    genres: info.categories,
    rating: info.averageRating,
    ratingsCount: info.ratingsCount,
    description: info.description,
    isbn,
    publishedDate: info.publishedDate,
    format: printType.includes('audio') ? 'audiobook' : 'physical',
  };
}

export async function searchBooksByTitle(title: string): Promise<BookData[]> {
  const results = await searchBooks({ query: title, maxResults: 20 });
  return results.map(convertGoogleBookToBookData);
}

export async function searchBooksByAuthor(author: string): Promise<BookData[]> {
  const results = await searchBooks({ query: `inauthor:${author}`, maxResults: 20 });
  return results.map(convertGoogleBookToBookData);
}

export async function getNewReleases(): Promise<BookData[]> {
  const results = await searchBooks({
    query: 'subject:fiction',
    maxResults: 20,
    orderBy: 'newest',
  });
  return results.map(convertGoogleBookToBookData);
}
