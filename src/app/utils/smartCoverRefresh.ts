interface CoverRefreshResult {
  bookId: string;
  title: string;
  oldCover?: string;
  newCover?: string;
  success: boolean;
  source?: string;
}

export async function refreshCoverIfBroken(book: {
  id: string;
  title: string;
  author?: string;
  isbn?: string;
  cover?: string;
}): Promise<CoverRefreshResult> {
  return {
    bookId: book.id,
    title: book.title,
    oldCover: book.cover,
    newCover: undefined,
    success: false,
    source: "ui-only",
  };
}

export async function refreshBrokenCovers(
  books: Array<{
    id: string;
    title: string;
    author?: string;
    isbn?: string;
    cover?: string;
  }>,
  onProgress?: (current: number, total: number, result: CoverRefreshResult) => void,
): Promise<CoverRefreshResult[]> {
  const results = await Promise.all(books.map((book) => refreshCoverIfBroken(book)));

  results.forEach((result, index) => {
    onProgress?.(index + 1, books.length, result);
  });

  return results;
}
