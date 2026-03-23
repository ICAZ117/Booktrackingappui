export interface MigrationProgress {
  total: number;
  current: number;
  bookTitle: string;
  status: "searching" | "updating" | "complete" | "error";
}

export async function migrateBook(book: any): Promise<any> {
  return { ...book };
}

export async function migrateAllBooks(
  books: any[],
  onProgress?: (progress: MigrationProgress) => void,
): Promise<any[]> {
  const total = books.length;

  books.forEach((book, index) => {
    onProgress?.({
      total,
      current: index + 1,
      bookTitle: book?.title || "Untitled",
      status: "searching",
    });
  });

  onProgress?.({
    total,
    current: total,
    bookTitle: "",
    status: "complete",
  });

  return books.map((book) => ({ ...book }));
}

export function needsMigration(_book: any): boolean {
  return false;
}

export function getMigrationCount(_books: any[]): number {
  return 0;
}
