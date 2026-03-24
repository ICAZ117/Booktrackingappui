import type { Book } from '../contexts/BooksContext';
import { getBookByISBN, searchBooksByTitle } from '../utils/googleBooksApi';

interface RepairOptions {
  maxBooks?: number;
}

function isCoverMissingOrInvalid(book: Book) {
  return !book.cover || !book.cover.startsWith('http');
}

export async function repairMissingBookCovers(
  books: Book[],
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>,
  options: RepairOptions = {},
) {
  const maxBooks = options.maxBooks ?? 12;
  const candidates = books.filter(isCoverMissingOrInvalid).slice(0, maxBooks);

  let repaired = 0;
  let failed = 0;

  for (const book of candidates) {
    try {
      let nextCover = '';

      if (book.isbn) {
        const byIsbn = await getBookByISBN(book.isbn);
        if (byIsbn?.volumeInfo?.imageLinks?.thumbnail) {
          nextCover = byIsbn.volumeInfo.imageLinks.thumbnail;
        } else if (byIsbn?.volumeInfo?.imageLinks?.smallThumbnail) {
          nextCover = byIsbn.volumeInfo.imageLinks.smallThumbnail;
        }
      }

      if (!nextCover) {
        const query = book.author ? `${book.title} ${book.author}` : book.title;
        const matches = await searchBooksByTitle(query);
        nextCover = matches[0]?.cover || '';
      }

      if (nextCover && nextCover.startsWith('http')) {
        await updateBook(book.id, { cover: nextCover });
        repaired++;
      } else {
        failed++;
      }

      // Gentle pacing to avoid rate limiting.
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch {
      failed++;
    }
  }

  return {
    checked: candidates.length,
    repaired,
    failed,
  };
}
