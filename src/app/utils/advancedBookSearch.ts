export interface BookSearchResult {
  title: string;
  author?: string;
  cover?: string;
  isbn?: string;
  source: string;
}

export async function searchBook(title: string, author?: string): Promise<BookSearchResult | null> {
  return {
    title,
    author,
    source: "ui-only",
  };
}

export async function searchBooks(
  books: { title: string; author?: string }[],
): Promise<(BookSearchResult | null)[]> {
  return Promise.all(books.map((book) => searchBook(book.title, book.author)));
}

export async function searchByISBN(isbn: string): Promise<BookSearchResult | null> {
  return {
    title: "Unknown Book",
    isbn,
    source: "ui-only",
  };
}
