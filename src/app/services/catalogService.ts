import { isSupabaseConfigured, supabase } from '../lib/supabase';

export interface CatalogBookRecord {
  id?: string;
  unique_key: string;
  title: string;
  author: string;
  cover?: string;
  description?: string;
  genre?: string;
  genres?: string[];
  published_date?: string;
  language?: string;
  isbn?: string;
  format?: string;
  source?: string;
  external_id?: string;
  rating?: number;
  ratings_count?: number;
  pages?: number;
  is_box_set?: boolean;
  is_sample?: boolean;
  search_hits?: number;
  open_hits?: number;
  save_hits?: number;
  reading_activity_hits?: number;
  popularity_score?: number;
  engagement_score?: number;
  metadata_quality_score?: number;
  last_engagement_at?: string;
}

function normalize(value?: string) {
  return (value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function buildCatalogUniqueKey(title: string, author: string) {
  return `${normalize(title)}::${normalize(author)}`;
}

export async function searchCatalogBooks(query: string, limit = 40): Promise<CatalogBookRecord[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const q = normalize(query);
  if (!q) return [];

  const { data, error } = await supabase
    .from('catalog_books')
    .select('*')
    .or(`title.ilike.%${q}%,author.ilike.%${q}%`)
    .order('published_date', { ascending: false, nullsFirst: false })
    .limit(Math.min(limit, 100));

  if (error) {
    console.warn('Catalog search failed, falling back to provider APIs.', error.message);
    return [];
  }

  return (data || []) as CatalogBookRecord[];
}

export async function upsertCatalogBooks(records: CatalogBookRecord[]) {
  if (!isSupabaseConfigured || !supabase || records.length === 0) return;

  const sanitized = records
    .filter((record) => record.title && record.author)
    .map((record) => ({
      ...record,
      unique_key: record.unique_key || buildCatalogUniqueKey(record.title, record.author),
      is_box_set: Boolean(record.is_box_set),
      is_sample: Boolean(record.is_sample),
    }));

  if (sanitized.length === 0) return;

  const { error } = await supabase
    .from('catalog_books')
    .upsert(sanitized, { onConflict: 'unique_key', ignoreDuplicates: false });

  if (error) {
    console.warn('Catalog upsert failed', error.message);
  }
}

type CatalogEventType = 'search' | 'open' | 'save' | 'reading';

function toMetricField(event: CatalogEventType) {
  if (event === 'open') return 'open_hits';
  if (event === 'save') return 'save_hits';
  if (event === 'reading') return 'reading_activity_hits';
  return 'search_hits';
}

function toNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function computeMetadataQuality(record: Partial<CatalogBookRecord>) {
  let score = 0;
  if (record.title && record.author) score += 25;
  if (record.cover && record.cover.startsWith('http')) score += 20;
  if (toNumber(record.pages) >= 20) score += 15;
  if (toNumber(record.rating) > 0) score += 15;
  if (toNumber(record.ratings_count) > 0) score += 10;
  if (record.description) score += 10;
  if (record.genre || (record.genres || []).length > 0) score += 5;
  return score;
}

function computeScores(record: Partial<CatalogBookRecord>) {
  const searchHits = toNumber(record.search_hits);
  const openHits = toNumber(record.open_hits);
  const saveHits = toNumber(record.save_hits);
  const readingHits = toNumber(record.reading_activity_hits);
  const rating = toNumber(record.rating);
  const ratingsCount = toNumber(record.ratings_count);

  const engagement = searchHits * 0.6 + openHits * 1.2 + saveHits * 2.8 + readingHits * 3.4;
  const popularity = Math.log10(ratingsCount + 1) * 40 + rating * 14 + engagement * 3.2;
  const quality = computeMetadataQuality(record);

  return {
    engagement_score: Math.round(engagement * 100) / 100,
    popularity_score: Math.round(popularity * 100) / 100,
    metadata_quality_score: quality,
  };
}

export async function trackCatalogBookEvent(
  book: Partial<CatalogBookRecord> & { title?: string; author?: string },
  event: CatalogEventType,
) {
  if (!isSupabaseConfigured || !supabase) return;
  const title = (book.title || '').trim();
  const author = (book.author || '').trim();
  if (!title || !author) return;

  const uniqueKey = book.unique_key || buildCatalogUniqueKey(title, author);
  const metricField = toMetricField(event);

  const { data: existing, error } = await supabase
    .from('catalog_books')
    .select('*')
    .eq('unique_key', uniqueKey)
    .maybeSingle();

  if (error) {
    console.warn('Catalog event tracking read failed', error.message);
    return;
  }

  const base: CatalogBookRecord = existing
    ? (existing as CatalogBookRecord)
    : {
        unique_key: uniqueKey,
        title,
        author,
        cover: book.cover,
        description: book.description,
        genre: book.genre,
        genres: book.genres,
        published_date: book.published_date,
        language: book.language,
        isbn: book.isbn,
        format: book.format,
        source: book.source || 'readtrack',
        external_id: book.external_id,
        rating: book.rating,
        ratings_count: book.ratings_count,
        pages: book.pages,
        is_box_set: Boolean(book.is_box_set),
        is_sample: Boolean(book.is_sample),
      };

  const currentMetric = toNumber((base as any)[metricField]);
  const next: CatalogBookRecord = {
    ...base,
    [metricField]: currentMetric + 1,
    last_engagement_at: new Date().toISOString(),
  };

  const scores = computeScores(next);

  const { error: writeError } = await supabase
    .from('catalog_books')
    .upsert(
      {
        ...next,
        ...scores,
      },
      { onConflict: 'unique_key', ignoreDuplicates: false },
    );

  if (writeError) {
    console.warn('Catalog event tracking upsert failed', writeError.message);
  }
}

export async function trackCatalogSearchResults(
  books: Array<Partial<CatalogBookRecord> & { title?: string; author?: string }>,
  limit = 20,
) {
  if (!books.length) return;
  const unique = new Map<string, Partial<CatalogBookRecord> & { title?: string; author?: string }>();

  books.slice(0, limit).forEach((book) => {
    const title = (book.title || '').trim();
    const author = (book.author || '').trim();
    if (!title || !author) return;
    const key = buildCatalogUniqueKey(title, author);
    if (!unique.has(key)) unique.set(key, book);
  });

  await Promise.all(
    Array.from(unique.values()).map((book) => trackCatalogBookEvent(book, 'search')),
  );
}
