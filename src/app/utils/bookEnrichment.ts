export interface EnrichmentProgress {
  total: number;
  current: number;
  percentage: number;
  status: string;
}

export async function enrichImportedBooks(
  books: any[],
  onProgress?: (progress: EnrichmentProgress) => void,
): Promise<any[]> {
  const total = books.length;
  const normalized = books.map((book, index) => {
    const percentage = total === 0 ? 100 : Math.round(((index + 1) / total) * 100);
    onProgress?.({
      total,
      current: index + 1,
      percentage,
      status: `Preparing "${book.title || "Untitled"}" for UI preview...`,
    });

    return {
      ...book,
      status: book.status || "want-to-read",
      cover:
        book.cover ||
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    };
  });

  return normalized;
}
