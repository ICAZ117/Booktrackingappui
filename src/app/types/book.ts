export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  status?: 'reading' | 'finished' | 'want-to-read' | 'dnf' | 'on-hold';
  rating?: number;
  progress?: number;
  pages?: number;
  currentPage?: number;
  currentMinutes?: number;
  audioDuration?: number;
  startDate?: string;
  finishDate?: string;
  dateRead?: string;
  genre?: string;
  notes?: string;
  review?: string;
  format?: string;
  publisher?: string;
  yearPublished?: string;
  description?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  isbn?: string;
  stats?: {
    pacing?: string;
    recommend?: string;
    rereadability?: string;
    characterDevelopment?: string;
    plotTwists?: string;
  };
}

export interface Shelf {
  id: string;
  name: string;
  bookIds: string[];
}
