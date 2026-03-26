import {
  convertGoogleBookToBookData,
  getBookByISBN,
  searchBooks,
  searchBooksByTitle,
  type BookData,
} from './googleBooksApi';

export interface EnrichmentProgress {
  total: number;
  current: number;
  percentage: number;
  status: string;
}

function normalizeIsbn(value?: string) {
  return (value || '').replace(/[^0-9X]/gi, '');
}

function hasUsableCover(value?: string) {
  if (!value) return false;
  const cover = value.trim();
  if (!cover) return false;
  const lowered = cover.toLowerCase();
  const knownPlaceholders = [
    'photo-1512820790803-83ca734da794', // old app placeholder (Unsplash stack of books)
    'nophoto',
    'noimage',
    'placeholder',
    'default_cover',
    'default-book',
  ];
  if (knownPlaceholders.some((token) => lowered.includes(token))) {
    return false;
  }
  return cover.startsWith('http://') || cover.startsWith('https://') || cover.startsWith('data:');
}

function normalizeCoverUrl(value?: string) {
  if (!value) return '';
  const cover = value.trim();
  if (!cover) return '';
  if (cover.startsWith('http://')) return `https://${cover.slice('http://'.length)}`;
  return cover;
}

function normalizeText(value?: string) {
  return (value || '').toLowerCase().replace(/[^a-z0-9]+/gi, ' ').trim();
}

function escapeQueryValue(value?: string) {
  return (value || '').replace(/"/g, ' ').trim();
}

function scoreBookMatch(candidate: BookData, title?: string, author?: string) {
  let score = 0;
  const expectedTitle = normalizeText(title);
  const expectedAuthor = normalizeText(author);
  const candidateTitle = normalizeText(candidate.title);
  const candidateAuthor = normalizeText(candidate.author);

  if (expectedTitle && candidateTitle === expectedTitle) score += 100;
  else if (expectedTitle && candidateTitle.includes(expectedTitle)) score += 70;
  else if (expectedTitle && expectedTitle.includes(candidateTitle)) score += 50;

  if (expectedAuthor && candidateAuthor === expectedAuthor) score += 40;
  else if (expectedAuthor && candidateAuthor.includes(expectedAuthor)) score += 25;

  if (hasUsableCover(candidate.cover)) score += 10;
  return score;
}

function pickBestCoverCandidate(candidates: BookData[], title?: string, author?: string) {
  const withCover = candidates.filter((entry) => hasUsableCover(entry.cover));
  if (withCover.length === 0) return '';

  const ranked = withCover
    .map((candidate) => ({
      candidate,
      score: scoreBookMatch(candidate, title, author),
    }))
    .sort((a, b) => b.score - a.score);

  return normalizeCoverUrl(ranked[0]?.candidate.cover);
}

async function searchOpenLibraryCover(title?: string, author?: string): Promise<string> {
  const safeTitle = (title || '').trim();
  if (!safeTitle) return '';

  try {
    const url = new URL('https://openlibrary.org/search.json');
    url.searchParams.set('title', safeTitle);
    if (author) url.searchParams.set('author', author);
    url.searchParams.set('limit', '12');

    const response = await fetch(url.toString());
    if (!response.ok) return '';

    const payload = await response.json();
    const docs = Array.isArray(payload?.docs) ? payload.docs : [];
    const preferredAuthor = normalizeText(author);

    const docWithCover =
      docs.find(
        (doc: any) =>
          doc?.cover_i &&
          (!preferredAuthor ||
            normalizeText(Array.isArray(doc?.author_name) ? doc.author_name[0] : '').includes(preferredAuthor)),
      ) || docs.find((doc: any) => Boolean(doc?.cover_i));

    if (!docWithCover?.cover_i) return '';
    return `https://covers.openlibrary.org/b/id/${docWithCover.cover_i}-L.jpg`;
  } catch {
    return '';
  }
}

async function findCoverForBook(book: any): Promise<string> {
  const isbn = normalizeIsbn(book?.isbn);
  if (isbn) {
    try {
      const isbnMatch = await getBookByISBN(isbn);
      const isbnCover = normalizeCoverUrl(
        isbnMatch?.volumeInfo?.imageLinks?.thumbnail ||
          isbnMatch?.volumeInfo?.imageLinks?.smallThumbnail,
      );
      if (hasUsableCover(isbnCover)) return isbnCover;
    } catch (error) {
      console.warn(`Failed ISBN cover lookup for "${book?.title || 'Untitled'}"`, error);
    }
  }

  const query = [book?.title, book?.author].filter(Boolean).join(' ').trim();
  const title = (book?.title || '').trim();
  const author = (book?.author || '').trim();
  if (!query && !title) return '';

  try {
    const queryVariants = Array.from(
      new Set(
        [
          query,
          title,
          title && author ? `intitle:"${escapeQueryValue(title)}" inauthor:"${escapeQueryValue(author)}"` : '',
          title ? `intitle:"${escapeQueryValue(title)}"` : '',
        ].filter(Boolean),
      ),
    );

    const allCandidates: BookData[] = [];

    for (const queryVariant of queryVariants) {
      try {
        const googleMatches = await searchBooks({ query: queryVariant, maxResults: 20 });
        allCandidates.push(...googleMatches.map(convertGoogleBookToBookData));
      } catch {
        // Try next strategy.
      }
    }

    // Keep existing lightweight helper as a final Google/OpenLibrary pass.
    if (query) {
      try {
        const titleMatches = await searchBooksByTitle(query);
        allCandidates.push(...titleMatches);
      } catch {
        // ignore
      }
    }

    const bestCover = pickBestCoverCandidate(allCandidates, title, author);
    if (hasUsableCover(bestCover)) return bestCover;

    const openLibraryCover = await searchOpenLibraryCover(title, author);
    if (hasUsableCover(openLibraryCover)) return openLibraryCover;

    return '';
  } catch (error) {
    console.warn(`Failed title/author cover lookup for "${book?.title || 'Untitled'}"`, error);
    return '';
  }
}

export async function enrichImportedBooks(
  books: any[],
  onProgress?: (progress: EnrichmentProgress) => void,
): Promise<any[]> {
  const total = books.length;
  const normalized: any[] = [];

  for (let index = 0; index < books.length; index += 1) {
    const book = books[index];
    const percentage = total === 0 ? 100 : Math.round(((index + 1) / total) * 100);

    const existingCover = normalizeCoverUrl(book?.cover);
    const needsCoverLookup = !hasUsableCover(existingCover);

    onProgress?.({
      total,
      current: index + 1,
      percentage,
      status: needsCoverLookup
        ? `Looking up cover for "${book.title || 'Untitled'}"...`
        : `Preparing "${book.title || 'Untitled'}"...`,
    });

    const resolvedCover = needsCoverLookup ? await findCoverForBook(book) : existingCover;

    normalized.push({
      ...book,
      status: book.status || 'want-to-read',
      cover: hasUsableCover(resolvedCover) ? resolvedCover : '',
    });
  }

  return normalized;
}
