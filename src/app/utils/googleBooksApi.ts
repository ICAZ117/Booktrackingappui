export interface SearchBooksParams {
  query: string;
  maxResults?: number;
  startIndex?: number;
  orderBy?: "relevance" | "newest";
}

export interface GoogleBookVolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  pageCount?: number;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
  publishedDate?: string;
}

export interface GoogleBook {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

export interface BookData {
  id?: string;
  googleBooksId?: string;
  title: string;
  author: string;
  cover: string;
  pages?: number;
  genre?: string;
  genres?: string[];
  rating?: number;
  ratingsCount?: number;
  description?: string;
  isbn?: string;
  publishedDate?: string;
  status?: string;
}

const MOCK_GOOGLE_BOOKS: GoogleBook[] = [
  {
    id: "google-fourth-wing",
    volumeInfo: {
      title: "Fourth Wing",
      authors: ["Rebecca Yarros"],
      categories: ["Fantasy"],
      averageRating: 4.8,
      ratingsCount: 18234,
      pageCount: 600,
      description: "A dragon rider fantasy romance.",
      imageLinks: { thumbnail: "https://covers.openlibrary.org/b/isbn/9781649374042-L.jpg" },
      industryIdentifiers: [{ type: "ISBN_13", identifier: "9781649374042" }],
      publishedDate: "2023-05-02",
    },
  },
  {
    id: "google-iron-flame",
    volumeInfo: {
      title: "Iron Flame",
      authors: ["Rebecca Yarros"],
      categories: ["Fantasy"],
      averageRating: 4.7,
      ratingsCount: 9531,
      pageCount: 640,
      description: "The second Empyrean novel.",
      imageLinks: { thumbnail: "https://covers.openlibrary.org/b/isbn/9781649374172-L.jpg" },
      industryIdentifiers: [{ type: "ISBN_13", identifier: "9781649374172" }],
      publishedDate: "2023-11-07",
    },
  },
  {
    id: "google-housemaid",
    volumeInfo: {
      title: "The Housemaid",
      authors: ["Freida McFadden"],
      categories: ["Thriller"],
      averageRating: 4.6,
      ratingsCount: 12933,
      pageCount: 336,
      description: "A psychological thriller.",
      imageLinks: { thumbnail: "https://covers.openlibrary.org/b/isbn/9781538742570-L.jpg" },
      industryIdentifiers: [{ type: "ISBN_13", identifier: "9781538742570" }],
      publishedDate: "2022-04-26",
    },
  },
  {
    id: "google-project-hail-mary",
    volumeInfo: {
      title: "Project Hail Mary",
      authors: ["Andy Weir"],
      categories: ["Sci-Fi"],
      averageRating: 4.9,
      ratingsCount: 21522,
      pageCount: 500,
      description: "A lone astronaut must save Earth.",
      imageLinks: { thumbnail: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg" },
      industryIdentifiers: [{ type: "ISBN_13", identifier: "9780593135204" }],
      publishedDate: "2021-05-04",
    },
  },
  {
    id: "google-midnight-library",
    volumeInfo: {
      title: "The Midnight Library",
      authors: ["Matt Haig"],
      categories: ["Fiction"],
      averageRating: 4.3,
      ratingsCount: 30100,
      pageCount: 304,
      description: "A life-between-lives premise.",
      imageLinks: { thumbnail: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg" },
      industryIdentifiers: [{ type: "ISBN_13", identifier: "9780525559474" }],
      publishedDate: "2020-09-29",
    },
  },
  {
    id: "google-dark-matter",
    volumeInfo: {
      title: "Dark Matter",
      authors: ["Blake Crouch"],
      categories: ["Sci-Fi"],
      averageRating: 4.5,
      ratingsCount: 14788,
      pageCount: 352,
      description: "A mind-bending multiverse thriller.",
      imageLinks: { thumbnail: "https://covers.openlibrary.org/b/isbn/9781101904220-L.jpg" },
      industryIdentifiers: [{ type: "ISBN_13", identifier: "9781101904220" }],
      publishedDate: "2016-07-26",
    },
  },
];

function normalizeQuery(query: string) {
  return query
    .toLowerCase()
    .replace(/intitle:|inauthor:|subject:|isbn:/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchableText(book: GoogleBook) {
  const info = book.volumeInfo;
  return `${info.title} ${(info.authors || []).join(" ")} ${(info.categories || []).join(" ")}`.toLowerCase();
}

function hasMatch(book: GoogleBook, query: string) {
  if (!query) return true;
  const words = normalizeQuery(query).split(" ").filter(Boolean);
  const text = getSearchableText(book);
  return words.every((word) => text.includes(word));
}

export async function searchBooks(params: SearchBooksParams): Promise<GoogleBook[]> {
  const { query, maxResults = 20, startIndex = 0 } = params;
  const filtered = MOCK_GOOGLE_BOOKS.filter((book) => hasMatch(book, query));
  return filtered.slice(startIndex, startIndex + maxResults);
}

export async function getTrendingBooks(genre?: string): Promise<GoogleBook[]> {
  if (!genre) return MOCK_GOOGLE_BOOKS.slice(0, 12);
  return MOCK_GOOGLE_BOOKS.filter((book) =>
    (book.volumeInfo.categories || []).some((category) => category.toLowerCase().includes(genre.toLowerCase())),
  );
}

export async function getBookByISBN(isbn: string): Promise<GoogleBook | null> {
  const cleaned = isbn.replace(/[^0-9X]/gi, "");
  return (
    MOCK_GOOGLE_BOOKS.find((book) =>
      (book.volumeInfo.industryIdentifiers || []).some(
        (identifier) => identifier.identifier.replace(/[^0-9X]/gi, "") === cleaned,
      ),
    ) || null
  );
}

export function convertGoogleBookToBookData(googleBook: GoogleBook): BookData {
  const info = googleBook.volumeInfo;
  const isbn = info.industryIdentifiers?.find((identifier) => identifier.type.includes("ISBN"))?.identifier;

  return {
    id: googleBook.id,
    googleBooksId: googleBook.id,
    title: info.title,
    author: info.authors?.[0] || "Unknown Author",
    cover:
      info.imageLinks?.thumbnail ||
      info.imageLinks?.smallThumbnail ||
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    pages: info.pageCount,
    genre: info.categories?.[0],
    genres: info.categories,
    rating: info.averageRating,
    ratingsCount: info.ratingsCount,
    description: info.description,
    isbn,
    publishedDate: info.publishedDate,
  };
}

export async function searchBooksByTitle(title: string): Promise<BookData[]> {
  const results = await searchBooks({ query: title, maxResults: 20 });
  return results.map(convertGoogleBookToBookData);
}

export async function searchBooksByAuthor(author: string): Promise<BookData[]> {
  const results = await searchBooks({ query: author, maxResults: 20 });
  return results.map(convertGoogleBookToBookData);
}

export async function getNewReleases(): Promise<BookData[]> {
  return MOCK_GOOGLE_BOOKS.map(convertGoogleBookToBookData).slice(0, 10);
}
