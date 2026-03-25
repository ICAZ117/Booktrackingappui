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
