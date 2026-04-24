import {
  convertGoogleBookToBookData,
  getPopularBooksFeed,
  searchBooks,
  type BookData,
} from './googleBooksApi';

export type CuratedShelfType =
  | 'trending-now'
  | 'best-of-all-time'
  | 'new-releases'
  | 'hidden-gems'
  | 'beginner-friendly'
  | 'fast-paced'
  | 'critically-acclaimed'
  | 'underrated-picks';

export interface CuratedGenreShelf {
  id: CuratedShelfType;
  title: string;
  description: string;
  books: BookData[];
}

interface DiscoveryCacheRecord<T> {
  timestamp: number;
  payload: T;
}

interface PremiumPopularOptions {
  userBooks?: Array<{
    id?: string;
    title?: string;
    author?: string;
    isbn?: string;
    status?: string;
    rating?: number;
    genre?: string;
    categories?: string[];
  }>;
  readingSessions?: Array<{ bookId?: string; pages?: number; minutes?: number; date?: string }>;
  limit?: number;
}

interface PremiumRecommendationOptions {
  userBooks: Array<{
    id?: string;
    title?: string;
    author?: string;
    isbn?: string;
    status?: string;
    rating?: number;
    genre?: string;
    categories?: string[];
    progress?: number;
  }>;
  readingSessions?: Array<{ bookId?: string; pages?: number; minutes?: number; date?: string }>;
  limit?: number;
}

const DISCOVERY_CACHE_PREFIX = 'readtrack_discovery_engine_v2:';
const DISCOVERY_CACHE_TTL_MS = 20 * 60 * 1000;
const COVER_CACHE_KEY = 'readtrack_cover_cache_v2';
const PLACEHOLDER_COVER = 'https://via.placeholder.com/400x600?text=No+Cover';

const normalizeText = (value?: string) => (value || '').toLowerCase().replace(/\s+/g, ' ').trim();
const normalizeIsbn = (value?: string) => (value || '').replace(/[^0-9x]/gi, '').toLowerCase();

const nowYear = () => new Date().getFullYear();

const getBookKey = (book: { title?: string; author?: string; isbn?: string }) => {
  const isbn = normalizeIsbn(book.isbn);
  if (isbn) return `isbn:${isbn}`;
  const title = normalizeText(book.title);
  const author = normalizeText(book.author);
  if (!title) return '';
  return `${title}::${author}`;
};

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${DISCOVERY_CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DiscoveryCacheRecord<T>;
    if (!parsed?.timestamp) return null;
    if (Date.now() - parsed.timestamp > DISCOVERY_CACHE_TTL_MS) return null;
    return parsed.payload;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, payload: T) {
  try {
    const record: DiscoveryCacheRecord<T> = {
      timestamp: Date.now(),
      payload,
    };
    localStorage.setItem(`${DISCOVERY_CACHE_PREFIX}${key}`, JSON.stringify(record));
  } catch {
    // ignore
  }
}

function readCoverCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(COVER_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function writeCoverCache(next: Record<string, string>) {
  try {
    localStorage.setItem(COVER_CACHE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

function normalizeCoverUrl(url?: string) {
  if (!url) return '';
  let next = url.trim();
  if (!next) return '';
  if (next.startsWith('http://')) next = `https://${next.slice('http://'.length)}`;
  next = next.replace('&edge=curl', '');

  if (next.includes('books.google.') || next.includes('googleusercontent')) {
    next = next.replace(/zoom=\d+/i, 'zoom=3');
    next = next.replace(/&imgtk=[^&]+/i, '');
  }

  if (next.includes('itunes.apple.com')) {
    next = next.replace('/100x100bb.', '/600x600bb.').replace('/100x100.', '/600x600.');
  }

  if (next.includes('covers.openlibrary.org') && /-[sml]\.jpg$/i.test(next)) {
    next = next.replace(/-[sml]\.jpg$/i, '-L.jpg');
  }

  return next;
}

function normalizePageCount(value?: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  const rounded = Math.round(value);
  if (rounded < 20 || rounded > 3000) return undefined;
  return rounded;
}

function normalizeRating(value?: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  if (value <= 0 || value > 5) return undefined;
  return Math.round(value * 100) / 100;
}

function normalizeRatingsCount(value?: number) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  if (value <= 0) return undefined;
  return Math.round(value);
}

function getPublishedYear(value?: string) {
  if (!value) return 0;
  const match = value.match(/\d{4}/);
  if (!match) return 0;
  const year = Number(match[0]);
  return Number.isFinite(year) ? year : 0;
}

function coverQualityScore(cover: string, isbn?: string, fromCache = false) {
  if (!cover) return -100;
  let score = 0;
  const normalizedCover = normalizeText(cover);
  const normalizedIsbn = normalizeIsbn(isbn);

  if (normalizedIsbn && normalizedCover.includes(normalizedIsbn)) score += 100;
  if (normalizedCover.includes('/b/isbn/')) score += 90;
  if (normalizedCover.includes('googleusercontent') || normalizedCover.includes('books.google')) score += 80;
  if (normalizedCover.includes('covers.openlibrary.org')) score += 70;
  if (normalizedCover.includes('placeholder') || normalizedCover.includes('no+cover')) score -= 50;
  if (normalizedCover.includes('zoom=3') || normalizedCover.includes('600x600')) score += 12;
  if (fromCache) score += 20;
  return score;
}

function chooseBestCover(input: BookData, cachedCover?: string) {
  const coverCandidates = [
    { cover: normalizeCoverUrl(input.cover), fromCache: false },
    { cover: normalizeCoverUrl(cachedCover), fromCache: true },
    { cover: normalizeCoverUrl(input.isbn ? `https://covers.openlibrary.org/b/isbn/${input.isbn}-L.jpg` : ''), fromCache: false },
  ].filter((entry) => !!entry.cover);

  if (coverCandidates.length === 0) return '';

  coverCandidates.sort((a, b) => coverQualityScore(b.cover, input.isbn, b.fromCache) - coverQualityScore(a.cover, input.isbn, a.fromCache));
  return coverCandidates[0].cover;
}

function calculatePopularityScore(
  book: BookData,
  engagementScore: number,
  searchMomentum = 0,
) {
  const ratingsCount = normalizeRatingsCount(book.ratingsCount) || 0;
  const rating = normalizeRating(book.rating) || 0;
  const publishedYear = getPublishedYear(book.publishedDate);
  const recency = publishedYear > 0 ? Math.max(0, 7 - (nowYear() - publishedYear)) : 0;
  const seasonal = [11, 0, 1].includes(new Date().getMonth()) ? 1.1 : 1;

  const score =
    Math.log10(ratingsCount + 1) * 38 +
    rating * 14 +
    recency * 3.5 +
    engagementScore * 8 +
    searchMomentum * 6;

  return Math.round(score * seasonal * 100) / 100;
}

function calculateMetadataQualityScore(book: BookData) {
  let score = 0;
  if (book.title && book.author) score += 25;
  if (book.cover && !book.cover.includes('placeholder')) score += 20;
  if (normalizePageCount(book.pages)) score += 15;
  if (normalizeRating(book.rating)) score += 15;
  if (normalizeRatingsCount(book.ratingsCount)) score += 10;
  if (book.description) score += 10;
  if (book.genre || (book.genres || []).length > 0) score += 5;
  return score;
}

function mergeRatings(entries: BookData[]) {
  const weighted = entries
    .map((entry) => ({
      rating: normalizeRating(entry.rating),
      count: normalizeRatingsCount(entry.ratingsCount) || 0,
    }))
    .filter((entry) => !!entry.rating);

  if (weighted.length === 0) {
    return { rating: undefined as number | undefined, ratingsCount: undefined as number | undefined };
  }

  const totalWeight = weighted.reduce((sum, item) => sum + Math.max(item.count, 1), 0);
  const weightedRating =
    weighted.reduce((sum, item) => sum + (item.rating || 0) * Math.max(item.count, 1), 0) / Math.max(totalWeight, 1);

  const ratingsCount = weighted.reduce((sum, item) => sum + item.count, 0);
  return {
    rating: Math.round(weightedRating * 100) / 100,
    ratingsCount: ratingsCount > 0 ? ratingsCount : undefined,
  };
}

function resolvePageCount(entries: BookData[]) {
  const valid = entries
    .map((entry) => normalizePageCount(entry.pages))
    .filter((page): page is number => typeof page === 'number');

  if (valid.length === 0) return undefined;
  valid.sort((a, b) => a - b);
  return valid[Math.floor(valid.length / 2)];
}

function enrichAndValidateBook(book: BookData, coverCache: Record<string, string>): BookData {
  const key = getBookKey(book);
  const cached = key ? coverCache[key] : '';
  const cover = chooseBestCover(book, cached);

  const next: BookData = {
    ...book,
    title: (book.title || '').trim(),
    author: (book.author || '').trim() || 'Unknown Author',
    cover: cover || '',
    pages: normalizePageCount(book.pages),
    rating: normalizeRating(book.rating),
    ratingsCount: normalizeRatingsCount(book.ratingsCount),
  };

  if (!next.title) return { ...next, cover: next.cover || PLACEHOLDER_COVER };
  return next;
}

export function optimizeDiscoveryBooks(rawBooks: BookData[]): BookData[] {
  const coverCache = readCoverCache();
  const grouped = new Map<string, BookData[]>();

  rawBooks.forEach((candidate) => {
    const enriched = enrichAndValidateBook(candidate, coverCache);
    if (!enriched.title || !enriched.author) return;
    const key = getBookKey(enriched);
    if (!key) return;
    const arr = grouped.get(key) || [];
    arr.push(enriched);
    grouped.set(key, arr);
  });

  const optimized = Array.from(grouped.values()).map((group) => {
    const primary = group[0];
    const mergedRatings = mergeRatings(group);
    const pages = resolvePageCount(group);

    const bestCover = group
      .map((book) => book.cover || '')
      .sort((a, b) => coverQualityScore(b, primary.isbn) - coverQualityScore(a, primary.isbn))[0];

    const merged: BookData = {
      ...primary,
      cover: bestCover || PLACEHOLDER_COVER,
      pages,
      rating: mergedRatings.rating,
      ratingsCount: mergedRatings.ratingsCount,
      genre: primary.genre || group.find((entry) => entry.genre)?.genre,
      genres: Array.from(
        new Set(group.flatMap((entry) => entry.genres || (entry.genre ? [entry.genre] : []))),
      ).slice(0, 6),
    };

    return merged;
  });

  const nextCache = { ...coverCache };
  optimized.forEach((book) => {
    const key = getBookKey(book);
    if (!key || !book.cover) return;
    nextCache[key] = book.cover;
  });
  writeCoverCache(nextCache);

  return optimized;
}

function buildEngagementMap(
  userBooks: PremiumPopularOptions['userBooks'] = [],
  readingSessions: PremiumPopularOptions['readingSessions'] = [],
) {
  const map = new Map<string, number>();

  userBooks.forEach((book) => {
    const key = getBookKey(book || {});
    if (!key) return;
    const statusWeight =
      book?.status === 'reading'
        ? 1.8
        : book?.status === 'finished'
          ? 1.5
          : book?.status === 'want-to-read'
            ? 1.1
            : 0.6;
    const ratingWeight = Math.max(0.5, (book?.rating || 0) / 2.5 || 0.8);
    map.set(key, (map.get(key) || 0) + statusWeight * ratingWeight);
  });

  const booksById = new Map<string, PremiumPopularOptions['userBooks'][number]>();
  userBooks.forEach((book) => {
    if (book?.id) booksById.set(String(book.id), book);
  });

  readingSessions.forEach((session) => {
    const linked = session.bookId ? booksById.get(String(session.bookId)) : undefined;
    if (!linked) return;
    const key = getBookKey(linked || {});
    if (!key) return;
    const sessionScore = Math.log10((session.pages || 0) + 1) + Math.log10((session.minutes || 0) + 1);
    map.set(key, (map.get(key) || 0) + sessionScore);
  });

  return map;
}

export async function getPremiumPopularBooks(options: PremiumPopularOptions = {}) {
  const cacheKey = `popular:${(options.limit || 24)}:${(options.userBooks || []).length}`;
  const cached = readCache<BookData[]>(cacheKey);
  if (cached && cached.length > 0) return cached.slice(0, options.limit || 24);

  const feed = await getPopularBooksFeed();
  const fallbackQuerySets = [
    'booktok trending books 2026',
    'new york times best seller fiction',
    'most read thriller books',
    'most popular romance books',
  ];

  const settled = await Promise.allSettled(
    fallbackQuerySets.map((query) => searchBooks({ query, maxResults: 16, orderBy: 'relevance' })),
  );

  const pooled: BookData[] = [...feed.books];
  settled.forEach((result) => {
    if (result.status !== 'fulfilled') return;
    pooled.push(...result.value.map(convertGoogleBookToBookData));
  });

  const optimized = optimizeDiscoveryBooks(pooled);
  const engagement = buildEngagementMap(options.userBooks, options.readingSessions);

  const ranked = optimized
    .map((book) => {
      const key = getBookKey(book);
      const engagementScore = key ? engagement.get(key) || 0 : 0;
      const metadataQuality = calculateMetadataQualityScore(book);
      const popularity = calculatePopularityScore(book, engagementScore, 1);
      return {
        ...book,
        popularityScore: popularity,
        metadataQualityScore: metadataQuality,
      };
    })
    .sort((a, b) => {
      if ((b.popularityScore || 0) !== (a.popularityScore || 0)) return (b.popularityScore || 0) - (a.popularityScore || 0);
      return (b.metadataQualityScore || 0) - (a.metadataQualityScore || 0);
    })
    .slice(0, options.limit || 24)
    .map(({ popularityScore: _popularityScore, metadataQualityScore: _metadataQualityScore, ...book }) => book);

  writeCache(cacheKey, ranked);
  return ranked;
}

function dedupeByOwnedBooks(candidates: BookData[], userBooks: PremiumRecommendationOptions['userBooks']) {
  const ownedKeys = new Set(
    userBooks
      .filter((book) => book.status === 'finished' || book.status === 'reading')
      .map((book) => getBookKey(book || {}))
      .filter(Boolean),
  );
  return candidates.filter((candidate) => {
    const key = getBookKey(candidate);
    return key && !ownedKeys.has(key);
  });
}

export async function getPremiumRecommendations(options: PremiumRecommendationOptions) {
  const { userBooks, readingSessions, limit = 18 } = options;
  const cacheKey = `recommend:${limit}:${userBooks.length}`;
  const cached = readCache<BookData[]>(cacheKey);
  if (cached && cached.length > 0) return cached.slice(0, limit);

  if (!userBooks.length) {
    const popular = await getPremiumPopularBooks({ limit, userBooks, readingSessions });
    return popular.slice(0, limit);
  }

  const authorWeights = new Map<string, number>();
  const genreWeights = new Map<string, number>();

  userBooks.forEach((book) => {
    const base =
      book.status === 'reading'
        ? 2.2
        : book.status === 'finished'
          ? 1.8
          : book.status === 'want-to-read'
            ? 1.2
            : 0.8;
    const ratingBoost = (book.rating || 0) >= 4 ? 1.4 : 1;

    if (book.author) {
      authorWeights.set(book.author, (authorWeights.get(book.author) || 0) + base * ratingBoost);
    }

    const genres = [book.genre, ...(book.categories || [])].filter(Boolean) as string[];
    genres.forEach((genre) => {
      genreWeights.set(genre, (genreWeights.get(genre) || 0) + base * ratingBoost);
    });
  });

  const topAuthors = Array.from(authorWeights.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([author]) => author);
  const topGenres = Array.from(genreWeights.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre);

  const queryPlans = [
    ...topAuthors.map((author) => ({ query: `inauthor:"${author}"`, reason: `Because you like ${author}` })),
    ...topGenres.map((genre) => ({ query: `subject:${genre} fiction`, reason: `Because you read ${genre}` })),
    { query: 'hidden gem fiction books', reason: 'Hidden gems for your taste' },
    { query: 'booktok fast paced thriller', reason: 'Addictive reads trending now' },
  ];

  const settled = await Promise.allSettled(
    queryPlans.slice(0, 10).map((plan) => searchBooks({ query: plan.query, maxResults: 18, orderBy: 'relevance' })),
  );

  const pooled: Array<BookData & { reason?: string }> = [];
  settled.forEach((result, index) => {
    if (result.status !== 'fulfilled') return;
    const reason = queryPlans[index]?.reason || 'Recommended for you';
    result.value.map(convertGoogleBookToBookData).forEach((book) => pooled.push({ ...book, reason }));
  });

  let optimized = optimizeDiscoveryBooks(pooled);
  optimized = dedupeByOwnedBooks(optimized, userBooks);

  const ranked = optimized
    .map((book) => {
      const rating = normalizeRating(book.rating) || 0;
      const ratingsCount = normalizeRatingsCount(book.ratingsCount) || 0;
      const authorAffinity = topAuthors.some((author) => normalizeText(author) === normalizeText(book.author)) ? 1 : 0;
      const genreAffinity = topGenres.some((genre) =>
        normalizeText(`${book.genre || ''} ${(book.genres || []).join(' ')}`).includes(normalizeText(genre)),
      )
        ? 1
        : 0;
      const hiddenGemBoost = ratingsCount > 500 && ratingsCount < 12000 && rating >= 4.1 ? 1.4 : 1;
      const score =
        rating * 20 +
        Math.log10(ratingsCount + 1) * 12 +
        authorAffinity * 22 +
        genreAffinity * 18;
      return {
        ...book,
        recommendationScore: score * hiddenGemBoost,
      };
    })
    .sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0))
    .slice(0, limit)
    .map(({ recommendationScore: _recommendationScore, ...book }) => book);

  writeCache(cacheKey, ranked);
  return ranked;
}

const GENRE_CURATED_QUERY_MAP: Record<string, Record<CuratedShelfType, string[]>> = {
  Fantasy: {
    'trending-now': ['fantasy booktok trending', 'subject:fantasy bestseller'],
    'best-of-all-time': ['best fantasy novels all time', 'epic fantasy classics'],
    'new-releases': ['fantasy novels 2026', 'new fantasy release'],
    'hidden-gems': ['underrated fantasy novels', 'hidden gem fantasy'],
    'beginner-friendly': ['beginner fantasy books', 'easy to read fantasy'],
    'fast-paced': ['fast paced fantasy thriller', 'page turning fantasy'],
    'critically-acclaimed': ['award winning fantasy novels', 'critically acclaimed fantasy'],
    'underrated-picks': ['underhyped fantasy books', 'low key fantasy favorites'],
  },
  Romance: {
    'trending-now': ['romance booktok trending', 'subject:romance bestseller'],
    'best-of-all-time': ['best romance novels all time', 'iconic romance books'],
    'new-releases': ['romance novels 2026', 'new romance releases'],
    'hidden-gems': ['underrated romance novels', 'hidden gem romance'],
    'beginner-friendly': ['beginner romance books', 'starter romance novels'],
    'fast-paced': ['fast paced romance books', 'addictive romance novels'],
    'critically-acclaimed': ['award winning romance novels', 'critically acclaimed romance'],
    'underrated-picks': ['underrated romance picks', 'romance books nobody talks about'],
  },
};

const DEFAULT_CURATED_QUERIES: Record<CuratedShelfType, string[]> = {
  'trending-now': ['booktok trending books', 'most popular fiction books'],
  'best-of-all-time': ['best novels of all time', 'modern classics fiction'],
  'new-releases': ['new fiction releases 2026', 'new books this year'],
  'hidden-gems': ['hidden gem fiction books', 'underrated novels'],
  'beginner-friendly': ['easy to read fiction', 'beginner friendly novels'],
  'fast-paced': ['fast paced books', 'addictive page turners'],
  'critically-acclaimed': ['award winning novels', 'critically acclaimed fiction'],
  'underrated-picks': ['underrated books', 'lesser known great novels'],
};

const CURATED_SHELF_META: Record<CuratedShelfType, { title: string; description: string }> = {
  'trending-now': { title: 'Trending Now', description: 'Most active and talked-about picks right now.' },
  'best-of-all-time': { title: 'Best of All Time', description: 'Timeless favorites with long-term acclaim.' },
  'new-releases': { title: 'New Releases', description: 'Fresh launches and recent standouts.' },
  'hidden-gems': { title: 'Hidden Gems', description: 'Excellent books that deserve more attention.' },
  'beginner-friendly': { title: 'Beginner Friendly', description: 'Great entry points with easy momentum.' },
  'fast-paced': { title: 'Fast Paced / Addictive', description: 'Page-turners that hook you quickly.' },
  'critically-acclaimed': { title: 'Critically Acclaimed', description: 'High-quality books with strong reviews.' },
  'underrated-picks': { title: 'Underrated Picks', description: 'Lower-hype books with strong reader love.' },
};

function rankShelfBooks(books: BookData[], shelf: CuratedShelfType) {
  const ranked = [...books];
  ranked.sort((a, b) => {
    const ar = normalizeRating(a.rating) || 0;
    const br = normalizeRating(b.rating) || 0;
    const ac = normalizeRatingsCount(a.ratingsCount) || 0;
    const bc = normalizeRatingsCount(b.ratingsCount) || 0;
    const ay = getPublishedYear(a.publishedDate);
    const by = getPublishedYear(b.publishedDate);
    const ap = normalizePageCount(a.pages) || 0;
    const bp = normalizePageCount(b.pages) || 0;

    switch (shelf) {
      case 'new-releases':
        if (by !== ay) return by - ay;
        return bc - ac;
      case 'hidden-gems':
      case 'underrated-picks': {
        const aGem = (ar * 25) - Math.log10(ac + 1) * 8;
        const bGem = (br * 25) - Math.log10(bc + 1) * 8;
        return bGem - aGem;
      }
      case 'beginner-friendly': {
        const aScore = ar * 15 - Math.max(0, ap - 380) / 10;
        const bScore = br * 15 - Math.max(0, bp - 380) / 10;
        return bScore - aScore;
      }
      case 'fast-paced': {
        const aScore = ar * 14 + Math.max(0, 450 - ap) / 12;
        const bScore = br * 14 + Math.max(0, 450 - bp) / 12;
        return bScore - aScore;
      }
      case 'critically-acclaimed':
        return (br * 20 + Math.log10(bc + 1) * 10) - (ar * 20 + Math.log10(ac + 1) * 10);
      case 'best-of-all-time':
        return (br * 18 + Math.log10(bc + 1) * 14) - (ar * 18 + Math.log10(ac + 1) * 14);
      case 'trending-now':
      default:
        return (bc * 0.01 + br * 6 + by) - (ac * 0.01 + ar * 6 + ay);
    }
  });
  return ranked;
}

export async function getCuratedGenreShelves(genre: string, perShelfLimit = 12): Promise<CuratedGenreShelf[]> {
  const cacheKey = `genre-shelves:${genre}:${perShelfLimit}`;
  const cached = readCache<CuratedGenreShelf[]>(cacheKey);
  if (cached && cached.length > 0) return cached;

  const configured = GENRE_CURATED_QUERY_MAP[genre] || DEFAULT_CURATED_QUERIES;
  const shelfIds = Object.keys(CURATED_SHELF_META) as CuratedShelfType[];

  const shelfResults = await Promise.all(
    shelfIds.map(async (shelfId) => {
      const queries = configured[shelfId] || DEFAULT_CURATED_QUERIES[shelfId];
      const settled = await Promise.allSettled(
        queries.slice(0, 3).map((query) => searchBooks({ query, maxResults: 26, orderBy: 'relevance' })),
      );

      const pooled: BookData[] = [];
      settled.forEach((result) => {
        if (result.status !== 'fulfilled') return;
        pooled.push(...result.value.map(convertGoogleBookToBookData));
      });

      const optimized = optimizeDiscoveryBooks(pooled);
      const ranked = rankShelfBooks(optimized, shelfId).slice(0, perShelfLimit);
      const meta = CURATED_SHELF_META[shelfId];
      return {
        id: shelfId,
        title: meta.title,
        description: meta.description,
        books: ranked,
      };
    }),
  );

  writeCache(cacheKey, shelfResults);
  return shelfResults;
}

interface PremiumSearchOptions {
  query: string;
  maxResults?: number;
  orderBy?: 'relevance' | 'newest';
}

export async function searchPremiumBooks(options: PremiumSearchOptions): Promise<BookData[]> {
  const query = (options.query || '').trim();
  if (!query) return [];

  const maxResults = Math.min(Math.max(options.maxResults || 24, 1), 60);
  const cacheKey = `search:${query.toLowerCase()}:${maxResults}:${options.orderBy || 'relevance'}`;
  const cached = readCache<BookData[]>(cacheKey);
  if (cached && cached.length > 0) return cached.slice(0, maxResults);

  const provider = await searchBooks({
    query,
    maxResults,
    orderBy: options.orderBy || 'relevance',
  });

  const optimized = optimizeDiscoveryBooks(provider.map(convertGoogleBookToBookData)).slice(0, maxResults);
  writeCache(cacheKey, optimized);
  return optimized;
}

export async function searchPremiumBooksByTitle(title: string): Promise<BookData[]> {
  return searchPremiumBooks({
    query: title,
    maxResults: 30,
    orderBy: 'relevance',
  });
}

export async function searchPremiumBooksByAuthor(author: string): Promise<BookData[]> {
  return searchPremiumBooks({
    query: `inauthor:"${author}"`,
    maxResults: 48,
    orderBy: 'relevance',
  });
}

export async function searchPremiumBookByIsbn(isbn: string): Promise<BookData | null> {
  const cleanIsbn = normalizeIsbn(isbn);
  if (!cleanIsbn) return null;

  const results = await searchPremiumBooks({
    query: `isbn:${cleanIsbn}`,
    maxResults: 12,
    orderBy: 'relevance',
  });

  const exact = results.find((book) => normalizeIsbn(book.isbn) === cleanIsbn);
  return exact || results[0] || null;
}
