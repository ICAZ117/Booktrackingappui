import { getBookByISBN, searchBooksByTitle } from './googleBooksApi';

export interface BookSearchResult {
  title: string;
  author?: string;
  cover?: string;
  isbn?: string;
  source: string;
}

export async function searchBook(title: string, author?: string): Promise<BookSearchResult | null> {
  const query = author ? `${title} ${author}` : title;
  const results = await searchBooksByTitle(query);
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
  const result = await getBookByISBN(isbn);
  if (!result) return null;

  return {
    title: result.volumeInfo.title,
    author: result.volumeInfo.authors?.[0],
    cover: result.volumeInfo.imageLinks?.thumbnail || result.volumeInfo.imageLinks?.smallThumbnail,
    isbn,
    source: 'live-provider',
  };
}
