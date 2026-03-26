import {
  buildCatalogUniqueKey,
  searchCatalogBooks,
  upsertCatalogBooks,
  type CatalogBookRecord,
} from '../services/catalogService';

export interface SearchBooksParams {
  query: string;
  maxResults?: number;
  startIndex?: number;
  orderBy?: 'relevance' | 'newest';
  langRestrict?: string;
}

export interface GoogleBookVolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  categories?: string[];
  language?: string;
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
  language?: Array<{ key?: string } | string>;
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
  country?: string;
}

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
const OPEN_LIBRARY_SEARCH_API_URL = 'https://openlibrary.org/search.json';
const OPEN_LIBRARY_AUTHOR_SEARCH_API_URL = 'https://openlibrary.org/search/authors.json';
const ITUNES_SEARCH_API_URL = 'https://itunes.apple.com/search';
const customSearchEndpoint = import.meta.env.VITE_BOOK_SEARCH_ENDPOINT || '';
const googleBooksApiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || '';
const nytBooksApiKey = import.meta.env.VITE_NYT_BOOKS_API_KEY || '';
const SEARCH_CACHE_TTL_MS = 15 * 60 * 1000;
const SEARCH_CACHE_PREFIX = 'readtrack_search_cache_v15:';
const PROVIDER_FETCH_TIMEOUT_MS = 7000;

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
  if (params.langRestrict) {
    url.searchParams.set('langRestrict', params.langRestrict);
  }
  if (googleBooksApiKey) {
    url.searchParams.set('key', googleBooksApiKey);
  }
  return url.toString();
}

function normalizeText(value?: string) {
  return (value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizeIsbn(value?: string) {
  return (value || '').replace(/[^0-9x]/gi, '').toLowerCase();
}

function isUntitledTitle(title?: string) {
  const normalized = normalizeText(title);
  return !normalized || normalized === 'untitled' || normalized === 'unknown title';
}

function isSampleOrExcerptTitle(title?: string) {
  const normalized = normalizeText(title);
  return (
    normalized.includes('extrait') ||
    normalized.includes('excerpt') ||
    normalized.includes('sample') ||
    normalized.includes(' abridged') ||
    normalized.includes('offert')
  );
}

function isBoxSetOrCollectionTitle(title?: string) {
  const normalized = normalizeText(title);
  if (!normalized) return false;

  return (
    normalized.includes('box set') ||
    normalized.includes('boxed set') ||
    normalized.includes('book set') ||
    normalized.includes('booked set') ||
    normalized.includes('omnibus') ||
    normalized.includes('collection') ||
    normalized.includes('bundle') ||
    normalized.includes('complete series') ||
    normalized.includes('complete set') ||
    normalized.includes('3 book') ||
    normalized.includes('4 book') ||
    normalized.includes('5 book')
  );
}

function isLikelyNonEnglishTitle(title?: string) {
  const raw = (title || '').trim();
  const normalized = normalizeText(title);
  if (!normalized) return false;

  if (/[à-ÿ]/i.test(raw)) return true;

  const tokens = normalized.split(' ').filter(Boolean);
  if (tokens.length === 0) return false;

  const firstToken = tokens[0];
  const nonEnglishArticles = new Set(['la', 'el', 'los', 'las', 'le', 'les', 'il', 'lo', 'der', 'die', 'das', 'un', 'una', 'une']);
  if (nonEnglishArticles.has(firstToken) && tokens.length >= 2) {
    return true;
  }

  const nonEnglishPhrases = [' de la ', ' de los ', ' de las ', ' en el ', ' en la ', ' y el ', ' y la ', ' et ', ' und '];
  return nonEnglishPhrases.some((phrase) => ` ${normalized} `.includes(phrase));
}

function extractOpenLibraryLanguage(doc: OpenLibraryDoc): string | undefined {
  const first = doc.language?.[0];
  if (!first) return undefined;
  if (typeof first === 'string') return first;
  const key = first.key || '';
  const tail = key.split('/').pop() || '';
  if (tail === 'eng') return 'en';
  return tail || undefined;
}

function looksLikeAuthorQuery(query: string) {
  const q = normalizeText(query);
  if (!q || q.includes(':') || q.includes('"')) return false;
  const words = q.split(' ').filter(Boolean);
  if (words.length < 2 || words.length > 4) return false;

  // Avoid expensive author-mode fanout for sentence-like queries.
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'to', 'for', 'with', 'of', 'in', 'on', 'at', 'from', 'this', 'that', 'not', 'my']);
  const stopWordCount = words.filter((word) => stopWords.has(word)).length;
  return stopWordCount <= 1;
}

function openLibraryCoverByIsbn(isbn?: string) {
  if (!isbn) return '';
  const clean = isbn.replace(/[^0-9X]/gi, '');
  if (!clean) return '';
  return `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`;
}

async function fetchWithTimeout(input: string, timeoutMs = PROVIDER_FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchGoogleBooks(params: SearchBooksParams): Promise<GoogleBook[]> {
  const response = await fetchWithTimeout(buildGoogleUrl(params));
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

  const response = await fetchWithTimeout(url.toString());
  if (!response.ok) return [];

  const payload = await response.json();
  const docs: OpenLibraryDoc[] = payload?.docs || [];
  return docs.map((doc, index) => convertOpenLibraryDocToGoogleBook(doc, `${query}-${index}`));
}

async function fetchOpenLibraryByTitle(title: string, limit = 40): Promise<GoogleBook[]> {
  const url = new URL(OPEN_LIBRARY_SEARCH_API_URL);
  url.searchParams.set('title', title);
  url.searchParams.set('limit', String(Math.min(limit, 100)));

  const response = await fetchWithTimeout(url.toString());
  if (!response.ok) return [];

  const payload = await response.json();
  const docs: OpenLibraryDoc[] = payload?.docs || [];
  return docs.map((doc, index) => convertOpenLibraryDocToGoogleBook(doc, `title-${title}-${index}`));
}

async function fetchOpenLibraryByAuthor(author: string, limit = 20): Promise<GoogleBook[]> {
  const url = new URL(OPEN_LIBRARY_SEARCH_API_URL);
  url.searchParams.set('author', author);
  url.searchParams.set('limit', String(Math.min(limit, 50)));

  const response = await fetchWithTimeout(url.toString());
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

    const searchResponse = await fetchWithTimeout(authorSearchUrl.toString());
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

    const worksResponse = await fetchWithTimeout(worksUrl.toString());
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

    const response = await fetchWithTimeout(url.toString());
    if (!response.ok) return [];
    const payload = await response.json();
    const results: ItunesAudiobookResult[] = payload?.results || [];

    return results
      .map((item, index) => {
      if (isUntitledTitle(item.trackName) || isSampleOrExcerptTitle(item.trackName)) {
        return null;
      }

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
          language: item.country === 'US' ? 'en' : undefined,
          imageLinks: cover
            ? {
                thumbnail: cover,
                smallThumbnail: cover,
              }
            : undefined,
          printType: 'AUDIOBOOK',
        },
      };
      })
      .filter((book): book is GoogleBook => Boolean(book));
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

    const response = await fetchWithTimeout(url.toString());
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
      language: extractOpenLibraryLanguage(doc),
      industryIdentifiers: isbn ? [{ type: 'ISBN_13', identifier: isbn }] : undefined,
      imageLinks: {
        thumbnail: cover,
        smallThumbnail: cover,
      },
      printType: 'BOOK',
    },
  };
}

function getSourceRank(bookId: string) {
  const id = normalizeText(bookId);
  if (id.startsWith('catalog-')) return 2;
  if (id.startsWith('openlib')) return 2;
  if (id.startsWith('itunes-audio')) return 1;
  return 3; // Prefer Google/provider-default items first.
}

function isGoogleSource(book: GoogleBook) {
  return getSourceRank(book.id) === 3;
}

function isPreferredLanguage(book: GoogleBook, preferredLanguage = 'en') {
  const language = normalizeText(book.volumeInfo.language);
  if (!language) return false;
  return language.startsWith(preferredLanguage);
}

function hasKnownNonPreferredLanguage(book: GoogleBook, preferredLanguage = 'en') {
  const language = normalizeText(book.volumeInfo.language);
  if (!language) return false;
  return !language.startsWith(preferredLanguage);
}

function hasCover(book: GoogleBook) {
  return Boolean(book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail);
}

function getEditionQuality(book: GoogleBook, preferredLanguage = 'en') {
  let score = getSourceRank(book.id) * 10;
  if (isGoogleSource(book)) score += 8;
  if (isPreferredLanguage(book, preferredLanguage)) score += 20;
  if (hasKnownNonPreferredLanguage(book, preferredLanguage)) score -= 20;
  if (hasCover(book)) score += 3;
  if (book.volumeInfo.pageCount) score += 1;
  return score;
}

function chooseBetterEdition(existing: GoogleBook, candidate: GoogleBook, preferredLanguage = 'en') {
  const existingIsGoogle = isGoogleSource(existing);
  const candidateIsGoogle = isGoogleSource(candidate);
  const existingPreferred = isPreferredLanguage(existing, preferredLanguage);
  const candidatePreferred = isPreferredLanguage(candidate, preferredLanguage);
  const existingNonPreferred = hasKnownNonPreferredLanguage(existing, preferredLanguage);
  const candidateNonPreferred = hasKnownNonPreferredLanguage(candidate, preferredLanguage);

  if (existingNonPreferred && !candidateNonPreferred) return candidate;
  if (candidateNonPreferred && !existingNonPreferred) return existing;

  if (existingIsGoogle !== candidateIsGoogle) {
    if (existingIsGoogle && existingPreferred && hasCover(existing)) return existing;
    if (candidateIsGoogle && candidatePreferred && hasCover(candidate)) return candidate;

    if (existingIsGoogle && existingPreferred) return existing;
    if (candidateIsGoogle && candidatePreferred) return candidate;

    if (existingIsGoogle && hasCover(existing) && !hasCover(candidate)) return existing;
    if (candidateIsGoogle && hasCover(candidate) && !hasCover(existing)) return candidate;
  }

  const existingScore = getEditionQuality(existing, preferredLanguage);
  const candidateScore = getEditionQuality(candidate, preferredLanguage);
  return candidateScore > existingScore ? candidate : existing;
}

function dedupeBooks(books: GoogleBook[], preferredLanguage = 'en') {
  const map = new Map<string, GoogleBook>();
  for (const book of books) {
    const info = book.volumeInfo;
    const key = `${(info.title || '').toLowerCase()}::${(info.authors?.[0] || '').toLowerCase()}`;
    if (!map.has(key)) {
      map.set(key, book);
      continue;
    }

    const existing = map.get(key)!;
    map.set(key, chooseBetterEdition(existing, book, preferredLanguage));
  }
  return Array.from(map.values());
}

function catalogRecordToGoogleBook(record: CatalogBookRecord, fallbackIndex: number): GoogleBook {
  return {
    id: record.external_id || record.id || `catalog-${fallbackIndex}`,
    volumeInfo: {
      title: record.title,
      authors: [record.author],
      description: record.description,
      categories: record.genres || (record.genre ? [record.genre] : undefined),
      averageRating: record.rating,
      ratingsCount: record.ratings_count,
      pageCount: record.pages,
      publishedDate: record.published_date,
      language: record.language,
      imageLinks: record.cover
        ? {
            thumbnail: record.cover,
            smallThumbnail: record.cover,
          }
        : undefined,
      industryIdentifiers: record.isbn ? [{ type: 'ISBN_13', identifier: record.isbn }] : undefined,
      printType: record.format === 'audiobook' ? 'AUDIOBOOK' : 'BOOK',
    },
  };
}

function googleBookToCatalogRecord(book: GoogleBook): CatalogBookRecord {
  const info = book.volumeInfo;
  const title = info.title || 'Untitled';
  const author = info.authors?.[0] || 'Unknown Author';
  const uniqueKey = buildCatalogUniqueKey(title, author);
  const isbn = pickIsbn(info.industryIdentifiers);
  const normalizedTitle = normalizeText(title);

  return {
    unique_key: uniqueKey,
    title,
    author,
    cover: ensureHttps(info.imageLinks?.thumbnail) || ensureHttps(info.imageLinks?.smallThumbnail) || undefined,
    description: info.description,
    genre: info.categories?.[0],
    genres: info.categories,
    published_date: info.publishedDate,
    language: info.language,
    isbn,
    format: normalizeText(info.printType).includes('audio') ? 'audiobook' : 'physical',
    source: 'provider',
    external_id: book.id,
    rating: info.averageRating,
    ratings_count: info.ratingsCount,
    pages: info.pageCount,
    is_box_set: isBoxSetOrCollectionTitle(title),
    is_sample: isSampleOrExcerptTitle(title),
  };
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

  if (title && normalizedQuery && title === normalizedQuery) score += 180;
  if (title && normalizedQuery && title.startsWith(normalizedQuery)) score += 120;
  if (author && normalizedQuery && author === normalizedQuery) score += 120;
  if (author && normalizedQuery && author.includes(normalizedQuery)) score += 80;
  if (allAuthors && normalizedQuery && allAuthors.includes(normalizedQuery)) score += 50;
  if (tokens.length > 1 && tokens.every((token) => allAuthors.includes(token))) score += 70;
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

function authorMatchesQueryTokens(authors: string[] | undefined, query: string) {
  const combined = normalizeText((authors || []).join(' '));
  if (!combined) return false;
  const tokens = normalizeText(query)
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length > 1);

  if (tokens.length === 0) return false;
  return tokens.every((token) => combined.includes(token));
}

function rankAndFilterBooks(books: GoogleBook[], query: string) {
  const authorMode = looksLikeAuthorQuery(query);
  const normalizedQuery = normalizeText(query);
  const preferredLanguage = normalizeText(
    (typeof navigator !== 'undefined' ? navigator.language : 'en') || 'en',
  ).slice(0, 2);
  const minScore = authorMode ? 18 : 8;

  const scored = books
    .map((book) => ({
      book,
      score: computeRelevanceScore(book, query),
    }))
    .filter(({ book, score }) => {
      if (score < minScore) return false;
      if (isUntitledTitle(book.volumeInfo.title)) return false;
      if (isSampleOrExcerptTitle(book.volumeInfo.title)) return false;
      if (isBoxSetOrCollectionTitle(book.volumeInfo.title)) return false;

      const lang = normalizeText(book.volumeInfo.language);
      if (preferredLanguage === 'en' && lang && !lang.startsWith('en')) {
        return false;
      }

      if (authorMode && preferredLanguage === 'en' && !lang && !isGoogleSource(book)) {
        return false;
      }

      if (authorMode && preferredLanguage === 'en' && isLikelyNonEnglishTitle(book.volumeInfo.title)) {
        return false;
      }

      if (authorMode && !hasCover(book)) {
        return false;
      }

      if (!authorMode) return true;

      const author = normalizeText(book.volumeInfo.authors?.[0]);
      const allAuthors = normalizeText((book.volumeInfo.authors || []).join(' '));
      const tokenAuthorMatch = authorMatchesQueryTokens(book.volumeInfo.authors, query);

      return author.includes(normalizedQuery) || allAuthors.includes(normalizedQuery) || tokenAuthorMatch;
    })
    .sort((a, b) => b.score - a.score);

  return scored.map(({ book }) => book);
}

export async function searchBooks(params: SearchBooksParams): Promise<GoogleBook[]> {
  const preferredLanguage = normalizeText(
    (typeof navigator !== 'undefined' ? navigator.language : 'en') || 'en',
  ).slice(0, 2);

  const cached = readCachedSearch(params);
  if (cached && cached.length > 0) {
    return cached;
  }

  const catalogRecords = await searchCatalogBooks(params.query, 200);
  const filteredCatalogRecords =
    preferredLanguage === 'en'
      ? catalogRecords.filter((record) => {
          const language = normalizeText(record.language);
          return !language || language.startsWith('en');
        })
      : catalogRecords;
  const catalogBooks = filteredCatalogRecords.map((record, index) => catalogRecordToGoogleBook(record, index));

  const endpointResult = await fetchFromCustomEndpoint(params);
  if (endpointResult) {
    const authorMode = looksLikeAuthorQuery(params.query);
    const targetCount = authorMode ? Math.max(params.maxResults || 20, 40) : params.maxResults || 20;
    const deduped = dedupeBooks(endpointResult).slice(0, targetCount);
    writeCachedSearch(params, deduped);
    return deduped;
  }

  const authorMode = looksLikeAuthorQuery(params.query);
  const targetCount = authorMode ? Math.max(params.maxResults || 20, 60) : params.maxResults || 20;
  const authorQuery = `inauthor:"${params.query}"`;

  const [
    googleResults,
    googleResultsPage2,
    googleResultsPage3,
    googleLanguagePreferredResults,
    googleTitleResults,
    googleAuthorResults,
    googleAuthorResultsPage2,
    googleAuthorResultsPage3,
    googleAuthorLangResults,
    googleAuthorLangResultsPage2,
    googleAuthorNewestResults,
    googleAuthorNewestResultsPage2,
    googleAuthorNewestResultsPage3,
    openLibraryResults,
    openLibraryTitleResults,
    openLibraryAuthorResults,
    openLibraryAuthorWorks,
    itunesAudiobookResults,
  ] = await Promise.all([
    fetchGoogleBooks(params).catch((error) => {
      console.warn('Google Books search failed', error);
      return [] as GoogleBook[];
    }),
    fetchGoogleBooks({
      ...params,
      maxResults: Math.max(targetCount, 40),
      startIndex: 40,
    }).catch(() => [] as GoogleBook[]),
    fetchGoogleBooks({
      ...params,
      maxResults: Math.max(targetCount, 40),
      startIndex: 80,
    }).catch(() => [] as GoogleBook[]),
    fetchGoogleBooks({
      ...params,
      maxResults: Math.max(targetCount, 40),
      startIndex: 0,
      langRestrict: preferredLanguage || 'en',
    }).catch(() => [] as GoogleBook[]),
    fetchGoogleBooks({
      ...params,
      query: `intitle:"${params.query}"`,
      maxResults: Math.max(targetCount, 40),
      startIndex: 0,
    }).catch(() => [] as GoogleBook[]),
    authorMode
      ? fetchGoogleBooks({ ...params, query: authorQuery }).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
    authorMode
      ? fetchGoogleBooks({
          ...params,
          query: authorQuery,
          maxResults: Math.max(targetCount, 40),
          startIndex: 40,
        }).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
    authorMode
      ? fetchGoogleBooks({
          ...params,
          query: authorQuery,
          maxResults: Math.max(targetCount, 40),
          startIndex: 80,
        }).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
    authorMode
      ? fetchGoogleBooks({
          ...params,
          query: authorQuery,
          maxResults: Math.max(targetCount, 40),
          startIndex: 0,
          langRestrict: preferredLanguage || 'en',
        }).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
    authorMode
      ? fetchGoogleBooks({
          ...params,
          query: authorQuery,
          maxResults: Math.max(targetCount, 40),
          startIndex: 40,
          langRestrict: preferredLanguage || 'en',
        }).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
    authorMode
      ? fetchGoogleBooks({
          ...params,
          query: authorQuery,
          orderBy: 'newest',
          maxResults: Math.max(targetCount, 40),
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
    authorMode
      ? fetchGoogleBooks({
          ...params,
          query: authorQuery,
          orderBy: 'newest',
          maxResults: 40,
          startIndex: 80,
        }).catch(() => [] as GoogleBook[])
      : Promise.resolve([] as GoogleBook[]),
    fetchOpenLibraryBooks(params.query, params.maxResults || 20).catch(() => [] as GoogleBook[]),
    fetchOpenLibraryByTitle(params.query, Math.max(params.maxResults || 20, 60)).catch(() => [] as GoogleBook[]),
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
    ...catalogBooks,
    ...googleLanguagePreferredResults,
    ...googleAuthorLangResults,
    ...googleAuthorLangResultsPage2,
    ...googleTitleResults,
    ...googleAuthorNewestResults,
    ...googleAuthorNewestResultsPage2,
    ...googleAuthorNewestResultsPage3,
    ...googleAuthorResults,
    ...googleAuthorResultsPage2,
    ...googleAuthorResultsPage3,
    ...googleResults,
    ...googleResultsPage2,
    ...googleResultsPage3,
    ...openLibraryTitleResults,
    ...openLibraryAuthorWorks,
    ...openLibraryAuthorResults,
    ...openLibraryResults,
    ...itunesAudiobookResults,
  ], preferredLanguage || 'en');
  const ranked = rankAndFilterBooks(merged, params.query);
  const deduped = ranked.slice(0, targetCount);
  void upsertCatalogBooks(deduped.map(googleBookToCatalogRecord));
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

const GENRE_DISCOVERY_TERMS: Record<string, string[]> = {
  Fantasy: ['fantasy', 'epic fantasy', 'urban fantasy'],
  Romance: ['romance', 'contemporary romance', 'rom-com'],
  Thriller: ['thriller', 'psychological thriller', 'suspense'],
  'Sci-Fi': ['science fiction', 'space opera', 'dystopian'],
  Contemporary: ['contemporary fiction', 'literary fiction', 'women fiction'],
  Mystery: ['mystery', 'detective fiction', 'crime fiction'],
  Historical: ['historical fiction', 'historical romance', 'war fiction'],
};

const GENRE_MATCH_KEYWORDS: Record<string, string[]> = {
  Fantasy: ['fantasy', 'magic', 'dragon', 'fae', 'sword'],
  Romance: ['romance', 'romantic', 'love', 'relationship', 'heart'],
  Thriller: ['thriller', 'suspense', 'crime', 'murder', 'psychological'],
  'Sci-Fi': ['science fiction', 'sci-fi', 'space', 'dystopian', 'future'],
  Contemporary: ['contemporary', 'literary', 'family', 'friendship', 'coming-of-age'],
  Mystery: ['mystery', 'detective', 'investigation', 'whodunit', 'crime'],
  Historical: ['historical', 'period', 'world war', 'victorian', 'century'],
};

const scoreGenreDiscoveryBook = (book: BookData, genre: string) => {
  const keywords = GENRE_MATCH_KEYWORDS[genre] || [genre.toLowerCase()];
  const haystack = normalizeText(
    `${book.genre || ''} ${(book.genres || []).join(' ')} ${book.title || ''} ${book.description || ''}`,
  );

  let relevance = 0;
  keywords.forEach((keywordRaw) => {
    const keyword = normalizeText(keywordRaw);
    if (!keyword) return;
    if (haystack.includes(keyword)) relevance += 1;
  });

  // Popularity tie-breakers.
  const ratingsCount = book.ratingsCount || 0;
  const rating = book.rating || 0;
  return relevance * 10 + Math.log10(ratingsCount + 1) * 4 + rating;
};

export async function getGenreDiscoveryBooks(genre: string): Promise<BookData[]> {
  if (!genre || genre === 'All') {
    const fallback = await getPopularBooks();
    return fallback.slice(0, 36);
  }

  const terms = GENRE_DISCOVERY_TERMS[genre] || [genre.toLowerCase()];
  const queryVariants = Array.from(
    new Set(
      terms.flatMap((term) => [
        `subject:${term}`,
        `${term} fiction`,
        `${term} bestseller`,
      ]),
    ),
  );

  const settled = await Promise.allSettled(
    queryVariants.slice(0, 9).map(async (query) => {
      const [google, openLibrary] = await Promise.all([
        fetchGoogleBooks({
          query,
          maxResults: 40,
          orderBy: 'relevance',
        }).catch(() => [] as GoogleBook[]),
        fetchOpenLibraryBooks(query, 40).catch(() => [] as GoogleBook[]),
      ]);

      return [...google, ...openLibrary].map(convertGoogleBookToBookData);
    }),
  );

  const deduped = new Map<string, BookData>();
  settled.forEach((result) => {
    if (result.status !== 'fulfilled') return;
    result.value.forEach((book) => {
      if (!book.title || !book.author) return;
      const key =
        normalizeIsbn(book.isbn) ||
        `${normalizeText(book.title)}::${normalizeText(book.author)}`;
      const existing = deduped.get(key);
      if (!existing || scoreGenreDiscoveryBook(book, genre) > scoreGenreDiscoveryBook(existing, genre)) {
        deduped.set(key, book);
      }
    });
  });

  const ranked = Array.from(deduped.values())
    .sort((a, b) => scoreGenreDiscoveryBook(b, genre) - scoreGenreDiscoveryBook(a, genre));

  return ranked.slice(0, 36);
}

function toTitleCase(value?: string) {
  if (!value) return '';
  const lower = value.toLowerCase();
  return lower.replace(/\b\w/g, (match) => match.toUpperCase());
}

interface NytBestSellerEntry {
  title?: string;
  author?: string;
  contributor?: string;
  book_image?: string;
  description?: string;
  primary_isbn13?: string;
  publisher?: string;
}

interface NytBestSellerList {
  list_name?: string;
  list_name_encoded?: string;
  display_name?: string;
  books?: NytBestSellerEntry[];
}

interface NytOverviewResponse {
  results?: {
    lists?: NytBestSellerList[];
  };
}

interface NytListsResponse {
  results?: Array<{
    list_name?: string;
    list_name_encoded?: string;
    display_name?: string;
  }>;
}

interface NytListBooksResponse {
  results?: {
    books?: NytBestSellerEntry[];
  };
}

export interface NytBestSellerListSummary {
  name: string;
  encodedName: string;
  displayName: string;
}

export interface PopularBooksFeed {
  books: BookData[];
  source: 'nyt' | 'live-trending';
  fetchedAt: string;
}

function getBookKey(book: { title?: string; author?: string; isbn?: string }) {
  const normalizedIsbn = (book.isbn || '').replace(/[^0-9x]/gi, '').toLowerCase();
  if (normalizedIsbn) return `isbn:${normalizedIsbn}`;
  return `${normalizeText(book.title)}::${normalizeText(book.author)}`;
}

function getPublishedYear(value?: string) {
  if (!value) return 0;
  const match = value.match(/\d{4}/);
  if (!match) return 0;
  const year = Number(match[0]);
  if (!Number.isFinite(year)) return 0;
  return year;
}

function scorePopularBook(book: BookData) {
  const rating = book.rating || 0;
  const ratingsCount = Math.max(0, book.ratingsCount || 0);
  const year = getPublishedYear(book.publishedDate);
  const currentYear = new Date().getFullYear();
  const recency = year > 0 ? Math.max(0, 6 - (currentYear - year)) : 0;

  // Prioritize books with strong social proof while still rewarding quality and freshness.
  return Math.log10(ratingsCount + 1) * 30 + rating * 10 + recency;
}

async function getFallbackPopularBooks(): Promise<BookData[]> {
  const trendingQueries = [
    'subject:fiction bestseller',
    'subject:mystery bestseller',
    'subject:romance bestseller',
    'subject:fantasy bestseller',
    'subject:thriller bestseller',
    'subject:science fiction bestseller',
    'new york times best seller fiction',
    'booktok popular books',
  ];

  const settled = await Promise.allSettled(
    trendingQueries.map((query) =>
      searchBooks({
        query,
        maxResults: 20,
        orderBy: 'relevance',
      }),
    ),
  );

  const deduped = new Map<string, BookData>();
  settled.forEach((result) => {
    if (result.status !== 'fulfilled') return;
    result.value
      .map(convertGoogleBookToBookData)
      .forEach((book) => {
        if (!book.title || !book.author) return;
        const key = getBookKey(book);
        if (!key) return;
        const existing = deduped.get(key);
        if (!existing || scorePopularBook(book) > scorePopularBook(existing)) {
          deduped.set(key, book);
        }
      });
  });

  return Array.from(deduped.values())
    .sort((a, b) => scorePopularBook(b) - scorePopularBook(a))
    .slice(0, 24);
}

export async function getPopularBooksFeed(): Promise<PopularBooksFeed> {
  const fetchedAt = new Date().toISOString();
  if (!nytBooksApiKey) {
    const fallback = await getFallbackPopularBooks();
    return {
      books: fallback,
      source: 'live-trending',
      fetchedAt,
    };
  }

  try {
    const url = new URL('https://api.nytimes.com/svc/books/v3/lists/overview.json');
    url.searchParams.set('api-key', nytBooksApiKey);

    const response = await fetchWithTimeout(url.toString());
    if (!response.ok) {
      throw new Error(`NYT overview request failed (${response.status})`);
    }

    const payload = (await response.json()) as NytOverviewResponse;
    const allBooks =
      payload.results?.lists?.flatMap((list) => list.books || []) || [];

    const deduped = new Map<string, BookData>();
    allBooks.forEach((book, index) => {
      const title = toTitleCase(book.title);
      const author = toTitleCase(book.author || book.contributor || 'Unknown Author');
      if (!title) return;

      const isbn = book.primary_isbn13 || '';
      const key = isbn || `${normalizeText(title)}::${normalizeText(author)}::${index}`;
      if (deduped.has(key)) return;

      deduped.set(key, {
        id: isbn || `nyt-${index}`,
        googleBooksId: undefined,
        title,
        author,
        cover: ensureHttps(book.book_image) || openLibraryCoverByIsbn(isbn) || '',
        description: book.description,
        isbn,
      });
    });

    const nytBooks = Array.from(deduped.values()).slice(0, 24);
    if (nytBooks.length > 0) {
      return {
        books: nytBooks,
        source: 'nyt',
        fetchedAt,
      };
    }

    const fallback = await getFallbackPopularBooks();
    return {
      books: fallback,
      source: 'live-trending',
      fetchedAt,
    };
  } catch (error) {
    console.warn('NYT bestseller fetch failed, using trending fallback.', error);
    const fallback = await getFallbackPopularBooks();
    return {
      books: fallback,
      source: 'live-trending',
      fetchedAt,
    };
  }
}

export async function getPopularBooks(): Promise<BookData[]> {
  const feed = await getPopularBooksFeed();
  return feed.books;
}

export async function getNytBestSellerLists(): Promise<NytBestSellerListSummary[]> {
  if (!nytBooksApiKey) return [];

  try {
    const url = new URL('https://api.nytimes.com/svc/books/v3/lists/names.json');
    url.searchParams.set('api-key', nytBooksApiKey);
    const response = await fetchWithTimeout(url.toString());
    if (!response.ok) {
      throw new Error(`NYT lists names request failed (${response.status})`);
    }

    const payload = (await response.json()) as NytListsResponse;
    const lists = payload.results || [];

    return lists
      .filter((list) => list.list_name_encoded && list.list_name)
      .map((list) => ({
        name: list.list_name || '',
        encodedName: list.list_name_encoded || '',
        displayName: list.display_name || list.list_name || '',
      }))
      .slice(0, 40);
  } catch (error) {
    console.warn('Failed to fetch NYT bestseller list names', error);
    return [];
  }
}

export async function getNytBestSellerBooks(listEncodedName: string): Promise<BookData[]> {
  if (!nytBooksApiKey || !listEncodedName) return [];

  try {
    const url = new URL(`https://api.nytimes.com/svc/books/v3/lists/current/${listEncodedName}.json`);
    url.searchParams.set('api-key', nytBooksApiKey);
    const response = await fetchWithTimeout(url.toString());
    if (!response.ok) {
      throw new Error(`NYT list books request failed (${response.status})`);
    }

    const payload = (await response.json()) as NytListBooksResponse;
    const books = payload.results?.books || [];
    const deduped = new Map<string, BookData>();

    books.forEach((book, index) => {
      const title = toTitleCase(book.title);
      const author = toTitleCase(book.author || book.contributor || 'Unknown Author');
      if (!title) return;

      const isbn = book.primary_isbn13 || '';
      const key = isbn || `${normalizeText(title)}::${normalizeText(author)}::${index}`;
      if (deduped.has(key)) return;

      deduped.set(key, {
        id: isbn || `nyt-list-${listEncodedName}-${index}`,
        title,
        author,
        cover: ensureHttps(book.book_image) || openLibraryCoverByIsbn(isbn) || '',
        description: book.description,
        isbn,
      });
    });

    return Array.from(deduped.values()).slice(0, 24);
  } catch (error) {
    console.warn('Failed to fetch NYT bestseller list books', error);
    return [];
  }
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
