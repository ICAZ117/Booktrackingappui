import {
  searchPremiumBookByIsbn,
  searchPremiumBooksByTitle,
} from './discoveryEngine';

export interface BookSearchResult {
  title: string;
  author?: string;
  cover?: string;
  isbn?: string;
  source: string;
}

export async function searchBook(title: string, author?: string): Promise<BookSearchResult | null> {
  const query = author ? `${title} ${author}` : title;
  const results = await searchPremiumBooksByTitle(query);
  const match = results[0];
  if (!match) return null;

  return {
    title: match.title,
    author: match.author,
    cover: match.cover,
    isbn: match.isbn,
    source: 'live-provider',
  };
}

export async function searchBooks(
  books: { title: string; author?: string }[],
): Promise<(BookSearchResult | null)[]> {
  return Promise.all(books.map((book) => searchBook(book.title, book.author)));
}

export async function searchByISBN(isbn: string): Promise<BookSearchResult | null> {
  const result = await searchPremiumBookByIsbn(isbn);
  if (!result) return null;

  return {
    title: result.title,
    author: result.author,
    cover: result.cover,
    isbn: result.isbn || isbn,
    source: 'live-provider',
  };
}
