// Optional Supabase Edge Function for server-side book search.
// Deploy with: supabase functions deploy book-search --no-verify-jwt

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
const OPEN_LIBRARY_SEARCH_API_URL = 'https://openlibrary.org/search.json';
const GOOGLE_BOOKS_API_KEY = Deno.env.get('GOOGLE_BOOKS_API_KEY') || '';
const TTL_MS = 15 * 60 * 1000;
const inMemoryCache = new Map<string, { expiresAt: number; items: any[] }>();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const query = (url.searchParams.get('q') || '').trim();
    const limit = Number(url.searchParams.get('limit') || '20');
    const orderBy = url.searchParams.get('orderBy') || 'relevance';
    const cacheKey = JSON.stringify({ query, limit, orderBy });

    if (!query) {
      return new Response(JSON.stringify({ items: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cached = inMemoryCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return new Response(JSON.stringify({ items: cached.items }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=900, stale-while-revalidate=60',
        },
        status: 200,
      });
    }

    const googleUrl = new URL(GOOGLE_BOOKS_API_URL);
    googleUrl.searchParams.set('q', query);
    googleUrl.searchParams.set('maxResults', String(Math.min(Math.max(limit, 1), 40)));
    googleUrl.searchParams.set('orderBy', orderBy);
    googleUrl.searchParams.set('printType', 'all');
    if (GOOGLE_BOOKS_API_KEY) {
      googleUrl.searchParams.set('key', GOOGLE_BOOKS_API_KEY);
    }

    const openLibraryUrl = new URL(OPEN_LIBRARY_SEARCH_API_URL);
    openLibraryUrl.searchParams.set('q', query);
    openLibraryUrl.searchParams.set('limit', String(Math.min(Math.max(limit, 1), 50)));

    const [googleResponse, openLibraryResponse] = await Promise.all([
      fetch(googleUrl.toString()).catch(() => null),
      fetch(openLibraryUrl.toString()).catch(() => null),
    ]);

    const googleJson = googleResponse && googleResponse.ok ? await googleResponse.json() : { items: [] };
    const openJson = openLibraryResponse && openLibraryResponse.ok ? await openLibraryResponse.json() : { docs: [] };

    const openItems = (openJson.docs || []).map((doc: any, index: number) => ({
      id: doc.key || `openlib-${index}`,
      volumeInfo: {
        title: doc.title || 'Untitled',
        authors: doc.author_name || ['Unknown Author'],
        categories: doc.subject?.slice(0, 5),
        pageCount: doc.number_of_pages_median,
        publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
        industryIdentifiers: doc.isbn?.[0] ? [{ type: 'ISBN_13', identifier: doc.isbn[0] }] : undefined,
        imageLinks: doc.cover_i
          ? {
              thumbnail: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
              smallThumbnail: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
            }
          : undefined,
      },
    }));

    const merged = [...(googleJson.items || []), ...openItems];
    const map = new Map<string, any>();

    for (const item of merged) {
      const title = (item?.volumeInfo?.title || '').toLowerCase();
      const author = (item?.volumeInfo?.authors?.[0] || '').toLowerCase();
      const key = `${title}::${author}`;
      if (!map.has(key)) {
        map.set(key, item);
      }
    }

    const items = Array.from(map.values()).slice(0, limit);
    inMemoryCache.set(cacheKey, {
      expiresAt: Date.now() + TTL_MS,
      items,
    });

    return new Response(JSON.stringify({ items }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
