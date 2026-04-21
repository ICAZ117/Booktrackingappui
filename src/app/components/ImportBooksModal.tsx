import { useState } from 'react';
import { X, Upload, FileJson, FileSpreadsheet, Book, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { enrichImportedBooks, EnrichmentProgress } from '../utils/bookEnrichment';

interface ImportBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (books: any[]) => void;
}

export function ImportBooksModal({ isOpen, onClose, onImport }: ImportBooksModalProps) {
  const { currentTheme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedData, setPastedData] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'enriching' | 'success' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [enrichmentProgress, setEnrichmentProgress] = useState<EnrichmentProgress | null>(null);
  const [clearExisting, setClearExisting] = useState(true); // DEFAULT: Clear existing data

  console.log('📦 ImportBooksModal rendered. onImport type:', typeof onImport, 'isOpen:', isOpen);

  const applySelectedFile = (file?: File | null) => {
    if (!file) return false;
    console.log('📁 File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    setSelectedFile(file);
    setImportStatus('idle');
    setErrorMessage('');
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (applySelectedFile(file)) return;

    // Some mobile browsers briefly report an empty FileList on change.
    setTimeout(() => {
      const lateFile = input.files?.[0];
      if (applySelectedFile(lateFile)) return;
      console.log('❌ No file selected');
    }, 0);
  };

  const handleFileInput = (event: React.FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    applySelectedFile(file);
  };

  const handleFileInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    // Mobile browsers often suppress `change` when the same file is picked again.
    // Resetting value before picker opens guarantees `change`/`input` re-fires.
    event.currentTarget.value = '';
  };

  const parseCSV = (text: string): any[] => {
    // Proper CSV parser that handles quoted fields with commas
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Escaped quote
            current += '"';
            i++;
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          // End of field
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      // Add last field
      result.push(current.trim());
      return result;
    };

    const lines = text.split(/\r?\n/);
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
    const books: any[] = [];

    console.log('📄 CSV Headers detected:', headers);
    console.log('📷 Cover-related headers found:', headers.filter(h => h.includes('cover') || h.includes('image') || h.includes('picture') || h.includes('thumbnail')));
    console.log('📄 All page-related headers:', headers.filter(h => h.includes('page')));
    console.log('📄 All date-related headers:', headers.filter(h => h.includes('date') || h.includes('read') || h.includes('finish')));
    console.log('📚 All ISBN-related headers:', headers.filter(h => h.includes('isbn')));

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = parseCSVLine(lines[i]);
      const book: any = {};

      headers.forEach((header, index) => {
        let value = values[index]?.trim() || '';
        
        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        // Skip empty values
        if (!value || value === 'null' || value === 'undefined') return;
        
        // ==== TITLE MAPPINGS ====
        // Goodreads: "Title"
        // StoryGraph: "Title" or "Book Title"
        // Fable: "Book Title" or "Title"
        // Bookmory: "Title"
        if (header === 'title' || header === 'book title' || header === 'booktitle') {
          book.title = value;
        }
        
        // ==== AUTHOR MAPPINGS ====
        // Goodreads: "Author", "Additional Authors"
        // StoryGraph: "Authors" or "Author"
        // Fable: "Author"
        // Bookmory: "Author"
        else if (header === 'authors' || header === 'author' || header === 'author name' || header === 'author l-f') {
          // Handle multiple authors separated by commas or semicolons
          const authors = value.split(/[,;]/)[0].trim(); // Take first author
          book.author = authors;
        } else if (header === 'additional authors' && !book.author) {
          book.author = value.split(/[,;]/)[0].trim();
        }
        
        // ==== ISBN MAPPINGS ====
        // All services: "ISBN", "ISBN13", "ISBN10"
        else if (header === 'isbn13' || header === 'isbn-13' || header === 'isbn 13') {
          book.isbn = value.replace(/[^0-9X]/gi, ''); // Clean ISBN
        } else if ((header === 'isbn' || header === 'isbn10' || header === 'isbn-10' || header === 'isbn 10') && !book.isbn) {
          book.isbn = value.replace(/[^0-9X]/gi, '');
        }
        
        // ==== PAGE COUNT MAPPINGS ====
        // Goodreads: "Number of Pages"
        // StoryGraph: "Number of Pages" or "Pages"
        // Fable: "Pages"
        // Bookmory: "Pages" or "Page Count"
        else if (header === 'number of pages' || header === 'pages' || header === 'page count' || header === 'num pages') {
          const pages = parseInt(value.replace(/[^0-9]/g, ''));
          if (!isNaN(pages) && pages > 0) book.pages = pages;
        }
        
        // ==== RATING MAPPINGS ====
        // Goodreads: "My Rating" (0-5)
        // StoryGraph: "My Rating" or "Star Rating" (0-5)
        // Fable: "Rating" (0-5)
        // Bookmory: "Rating" or "My Rating" (0-5)
        else if (header === 'my rating' || header === 'rating' || header === 'star rating' || header === 'stars') {
          const rating = parseFloat(value);
          if (!isNaN(rating) && rating > 0 && rating <= 5) book.rating = rating;
        } else if (header === 'average rating' && !book.rating) {
          const avgRating = parseFloat(value);
          if (!isNaN(avgRating) && avgRating > 0 && avgRating <= 5) book.rating = avgRating;
        }
        
        // ==== GENRE/CATEGORY MAPPINGS ====
        // Goodreads: "Bookshelves", "Exclusive Shelf"
        // StoryGraph: "Genres"
        // Fable: "Genre" or "Categories"
        // Bookmory: "Genre" or "Category"
        else if (header === 'genres' || header === 'genre' || header === 'bookshelves' || 
                 header === 'exclusive shelf' || header === 'categories' || header === 'category' ||
                 header === 'bookshelves with positions') {
          if (value && !book.genre) {
            // Take first genre if multiple, clean up special cases
            let genre = value.split(/[,;|]/)[0].trim();
            // Skip status-related genres
            if (!genre.match(/^(read|reading|to-read|want|dnf|currently)/i)) {
              book.genre = genre;
            }
          }
        }
        
        // ==== DATE RANGE MAPPINGS ====
        // StoryGraph: \"Dates Read\" (format: "2026/02/14-2026/02/19")
        // This should be processed BEFORE individual date fields
        if (header === 'dates read' && value && value.includes('-')) {
          const [start, end] = value.split('-').map(d => d.trim());
          if (start) book.startDate = start;
          if (end) book.dateRead = end;
        }
        
        // ==== DATE READ MAPPINGS ====
        // Goodreads: "Date Read", "Date Finished"
        // StoryGraph: "Date Read", "Read At", "Finished", "Last Date Read"
        // Fable: "Date Completed", "Finished Date"
        // Bookmory: "Date Read" or "Finished Date"
        else if (header === 'date read' || header === 'read at' || header === 'finished' || 
                 header === 'date completed' || header === 'finished date' || header === 'date finished' ||
                 header === 'last date read') {
          if (value && !book.dateRead) book.dateRead = value;
        }
        
        // ==== DATE STARTED MAPPINGS ====
        // Goodreads: "Date Added" (when they added it, not necessarily started)
        // StoryGraph: "Date Started", "Started"
        // Fable: "Started Date"
        // Bookmory: "Date Started" or "Started Reading"
        else if (header === 'date started' || header === 'started' || header === 'started reading' || 
                 header === 'started date' || header === 'start date') {
          if (value && !book.startDate) book.startDate = value;
        } 
        // Only use "date added" as fallback if no other start date was found
        else if (header === 'date added' && !book.startDate) {
          if (value) book.startDate = value;
        }
        
        // ==== STATUS/SHELF MAPPINGS ====
        // Goodreads: "Exclusive Shelf" (read, currently-reading, to-read)
        // StoryGraph: "Read Status" (read, reading, to-read, dnf)
        // Fable: "Status" (finished, reading, want-to-read)
        // Bookmory: "Status" or "Reading Status"
        else if (header === 'exclusive shelf' || header === 'read status' || header === 'status' || 
                 header === 'reading status' || header === 'shelf') {
          const status = value.toLowerCase().trim();
          if (status.includes('read') && !status.includes('to-read') && !status.includes('want')) {
            book.status = 'finished';
          } else if (status.includes('currently') || status.includes('reading') && !status.includes('to-read')) {
            book.status = 'reading';
          } else if (status.includes('want') || status.includes('to-read') || status.includes('wishlist')) {
            book.status = 'want-to-read';
          } else if (status.includes('dnf') || status.includes('did not finish') || status.includes('abandoned')) {
            book.status = 'dnf';
          }
        }
        
        // ==== COVER IMAGE MAPPINGS ====
        // Goodreads: "Cover Image" (full URL)
        // StoryGraph: "Cover"
        // Others: "Image URL", "Cover URL", "Thumbnail"
        else if (header === 'cover' || header === 'cover image' || header === 'image url' || 
                 header === 'cover url' || header === 'thumbnail' || header === 'book cover' ||
                 header === 'image' || header === 'img' || header === 'picture') {
          if (value && value.length > 0) {
            // Accept any URL that starts with http
            if (value.startsWith('http')) {
              book.cover = value;
              console.log(`📷 Found cover URL in CSV for "${book.title}": ${value.substring(0, 60)}`);
            }
          }
        }
        
        // ==== PUBLISHER MAPPINGS ====
        else if (header === 'publisher' || header === 'publisher name') {
          if (value) book.publisher = value;
        }
        
        // ==== PUBLICATION YEAR MAPPINGS ====
        // Goodreads: "Year Published", "Original Publication Year"
        // Others: "Year Published", "Publication Year"
        else if (header === 'year published' || header === 'publication year' || 
                 header === 'original publication year' || header === 'publish year') {
          const year = parseInt(value);
          if (!isNaN(year) && year > 1000 && year <= 2100) {
            book.yearPublished = year.toString();
          }
        }
        
        // ==== BINDING/FORMAT MAPPINGS ====
        // Goodreads: "Binding" (Paperback, Hardcover, ebook, audiobook)
        // Others: "Format", "Book Format"
        else if (header === 'binding' || header === 'format' || header === 'book format') {
          if (value) book.format = value;
        }
        
        // ==== GOODREADS SPECIFIC: My Review ====
        else if (header === 'my review' || header === 'review') {
          if (value && value.length > 0) book.review = value;
        }
        
        // ==== GOODREADS SPECIFIC: Private Notes ====
        else if (header === 'private notes' || header === 'notes') {
          if (value && value.length > 0) book.notes = value;
        }
        
        // ==== FABLE SPECIFIC: Reading Duration ====
        else if (header === 'reading time' || header === 'time spent' || header === 'duration') {
          if (value) book.readingTime = value;
        }
      });

      // Only add if we have at least a title
      if (book.title && book.title.length > 0) {
        // Set default status if not provided
        if (!book.status) {
          // If they have a date read, assume it's finished
          if (book.dateRead) {
            book.status = 'finished';
          } else {
            book.status = 'finished'; // Default assumption
          }
        }
        
        // CRITICAL FIX: Map dateRead to finishDate for the app
        if (book.dateRead && !book.finishDate) {
          book.finishDate = book.dateRead;
        }
        
        // Normalize date format to YYYY-MM-DD to avoid timezone issues
        const normalizeDateToYYYYMMDD = (dateStr: string): string => {
          if (!dateStr) return '';
          
          console.log(`  🔄 Normalizing date: "${dateStr}"`);
          
          // If already in YYYY-MM-DD format, return as-is
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            console.log(`    ✅ Already normalized: "${dateStr}"`);
            return dateStr;
          }
          
          // Handle YYYY/MM/DD format
          const slashMatch = dateStr.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
          if (slashMatch) {
            const normalized = `${slashMatch[1]}-${String(slashMatch[2]).padStart(2, '0')}-${String(slashMatch[3]).padStart(2, '0')}`;
            console.log(`    ✅ Converted slash format: "${dateStr}" → "${normalized}"`);
            return normalized;
          }
          
          // Parse date string and convert to YYYY-MM-DD
          // Common formats: "July 15, 2023", "15 Jul 2023", etc.
          try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
              console.warn(`    ⚠️ Invalid date format: "${dateStr}"`);
              return '';
            }
            
            // Use local date components to avoid timezone shifts
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const normalized = `${year}-${month}-${day}`;
            
            console.log(`    ✅ Parsed and normalized: "${dateStr}" → "${normalized}"`);
            return normalized;
          } catch (e) {
            console.error(`    ❌ Failed to parse date: "${dateStr}"`, e);
            return '';
          }
        };
        
        // Normalize all date fields
        if (book.finishDate) {
          book.finishDate = normalizeDateToYYYYMMDD(book.finishDate);
        }
        if (book.startDate) {
          book.startDate = normalizeDateToYYYYMMDD(book.startDate);
        }
        if (book.dateRead) {
          book.dateRead = normalizeDateToYYYYMMDD(book.dateRead);
        }
        if (book.dateAdded) {
          book.dateAdded = normalizeDateToYYYYMMDD(book.dateAdded);
        }
        
        console.log(`  📅 Final dates - finishDate: "${book.finishDate}", dateRead: "${book.dateRead}"`);
        
        // If book is finished but has no finishDate, set to current date
        if (book.status === 'finished' && !book.finishDate) {
          const now = new Date();
          book.finishDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          console.log(`  📅 Set missing finishDate to today: ${book.finishDate}`);
        }
        
        // CRITICAL FIX: Ensure cover images load properly
        // Log what we have before processing
        console.log(`📷 Book "${book.title}" - ISBN: ${book.isbn || 'NONE'}, Cover from CSV: ${book.cover ? book.cover.substring(0, 50) : 'NONE'}`);
        
        // DO NOT add OpenLibrary fallback URLs - they often 404
        // Instead, let the auto-enrichment system fetch verified covers from the API
        // This prevents console warnings from ImageWithFallback
        
        books.push(book);
        console.log(`✅ Book ${i}: \"${book.title}\" by ${book.author || 'Unknown'} - Pages: ${book.pages || 'NONE'}, Cover: ${book.cover ? book.cover.substring(0, 60) + '...' : 'NONE'}`);
      } else {
        console.log(`⚠️ Skipped row ${i}: no title found`);
      }
    }

    console.log(`📚 Successfully parsed ${books.length} books from CSV`);
    console.log(`📊 Import Summary:`);
    console.log(`   - Books with covers: ${books.filter(b => b.cover).length}`);
    console.log(`   - Books with ISBNs: ${books.filter(b => b.isbn).length}`);
    console.log(`   - Books with pages: ${books.filter(b => b.pages).length}`);
    console.log(`   - Total pages to import: ${books.reduce((sum, b) => sum + (b.pages || 0), 0)}`);
    console.log(`📷 Sample of first 3 books:`, books.slice(0, 3).map(b => ({
      title: b.title,
      isbn: b.isbn || 'NO ISBN',
      cover: b.cover ? b.cover.substring(0, 60) + '...' : 'NO COVER'
    })));
    return books;
  };

  const handleImport = async () => {
    if (!selectedFile && !pastedData.trim()) {
      console.log('❌ No file selected for import');
      return;
    }

    console.log('🚀 Starting import process...');
    if (selectedFile) {
      console.log('📁 Selected file:', selectedFile.name, selectedFile.type, selectedFile.size);
    } else {
      console.log('📝 Using pasted data import');
    }
    setImportStatus('processing');

    try {
      console.log('📖 Reading import contents...');
      const text = selectedFile ? await selectedFile.text() : pastedData;
      console.log(`✅ File read successfully. Length: ${text.length} characters`);
      console.log('First 200 characters:', text.substring(0, 200));
      
      let books: any[] = [];
      
      // Detect file type by content, not just extension
      const lowerName = selectedFile?.name?.toLowerCase() || '';
      const isJSON = text.trim().startsWith('{') || text.trim().startsWith('[');
      const hasCommas = text.includes(',');

      if (lowerName.endsWith('.json') || isJSON) {
        console.log('🔍 Detected JSON file');
        const data = JSON.parse(text);
        // Handle both array of books and nested formats
        books = Array.isArray(data) ? data : (data.books || data.reading || []);
        console.log(`📚 Extracted ${books.length} books from JSON`);
      } else if (lowerName.endsWith('.csv') || lowerName.endsWith('.cvs') || lowerName.endsWith('.txt') || hasCommas) {
        console.log('🔍 Detected CSV/text file, parsing...');
        books = parseCSV(text);
      } else {
        throw new Error(`Unsupported import format${selectedFile ? ` for "${selectedFile.name}"` : ''}. Please use CSV, CVS, TXT, or JSON.`);
      }

      if (books.length === 0) {
        throw new Error('No books found in file. Please check your file format.');
      }

      console.log(`✅ Successfully parsed ${books.length} books, preparing to import...`);
      console.log(`📊 Before enrichment:`);
      console.log(`   - Books with covers: ${books.filter(b => b.cover).length}/${books.length}`);
      console.log(`   - Books with pages: ${books.filter(b => b.pages).length}/${books.length}`);
      console.log(`   - Books with ISBNs: ${books.filter(b => b.isbn).length}/${books.length}`);
      
      // Enrich books with metadata from APIs
      setImportStatus('enriching');
      console.log('\n🔄 Starting automatic enrichment...');
      
      const enrichedBooks = await enrichImportedBooks(books, (progress) => {
        setEnrichmentProgress(progress);
        console.log(`📊 Enrichment progress: ${progress.percentage}% - ${progress.status}`);
      });
      
      console.log(`\n✅ Enrichment complete!`);
      console.log(`📊 After enrichment:`);
      console.log(`   - Books with covers: ${enrichedBooks.filter(b => b.cover).length}/${enrichedBooks.length}`);
      console.log(`   - Books with pages: ${enrichedBooks.filter(b => b.pages).length}/${enrichedBooks.length}`);
      console.log(`   - Books with ISBNs: ${enrichedBooks.filter(b => b.isbn).length}/${enrichedBooks.length}`);
      
      setImportedCount(enrichedBooks.length);
      setImportStatus('success');
      
      // Wait a moment to show success message
      setTimeout(() => {
        console.log('📤 Sending enriched books to parent component...');
        console.log('Sample enriched book:', enrichedBooks[0]);
        console.log('Total books being sent:', enrichedBooks.length);
        
        try {
          onImport(enrichedBooks);
          console.log('✅ onImport callback executed without throwing error');
        } catch (error) {
          console.error('❌ ERROR calling onImport:', error);
        }
        
        onClose();
        console.log('✅ Modal closed');
        // Reset state
        setSelectedFile(null);
        setPastedData('');
        setImportStatus('idle');
        setEnrichmentProgress(null);
      }, 1500);
    } catch (error: any) {
      console.error('❌ Import failed with error:', error);
      console.error('Error stack:', error.stack);
      setImportStatus('error');
      setErrorMessage(error.message || 'Failed to import books. Please check your file format.');
    }
  };

  const textColor = currentTheme.textColor === 'light' ? '#ffffff' : '#111827';
  const mutedColor = currentTheme.textColor === 'light' ? 'rgba(255,255,255,0.6)' : '#6b7280';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[380px] rounded-3xl shadow-2xl z-50 overflow-hidden"
            style={{ backgroundColor: currentTheme.cardColor }}
          >
            {/* Header with Gradient */}
            <div
              className="px-6 py-6 relative overflow-hidden"
              style={{
                background: currentTheme.isGradient
                  ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                  : currentTheme.primary,
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full transition-all"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Upload className="w-6 h-6" style={{ color: '#ffffff' }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>
                    Import Books
                  </h2>
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Upload from other apps
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Supported Formats */}
              <div>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: textColor }}
                >
                  Supported Formats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="p-3 rounded-xl border"
                    style={{
                      backgroundColor: currentTheme.backgroundColor,
                      borderColor: currentTheme.borderColor,
                    }}
                  >
                    <FileSpreadsheet
                      className="w-5 h-5 mb-1"
                      style={{ color: currentTheme.accentColor }}
                    />
                    <div className="text-xs font-semibold" style={{ color: textColor }}>
                      CSV Files
                    </div>
                    <div className="text-[10px]" style={{ color: mutedColor }}>
                      Goodreads, Excel
                    </div>
                  </div>
                  <div
                    className="p-3 rounded-xl border"
                    style={{
                      backgroundColor: currentTheme.backgroundColor,
                      borderColor: currentTheme.borderColor,
                    }}
                  >
                    <FileJson
                      className="w-5 h-5 mb-1"
                      style={{ color: currentTheme.accentColor }}
                    />
                    <div className="text-xs font-semibold" style={{ color: textColor }}>
                      JSON Files
                    </div>
                    <div className="text-[10px]" style={{ color: mutedColor }}>
                      StoryGraph, Literal
                    </div>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <div
                  className="w-full p-4 border-2 border-dashed rounded-2xl"
                  style={{
                    borderColor: selectedFile ? currentTheme.accentColor : currentTheme.borderColor,
                    backgroundColor: currentTheme.backgroundColor,
                  }}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `${currentTheme.accentColor}20`,
                      }}
                    >
                      {selectedFile ? (
                        <Book
                          className="w-6 h-6"
                          style={{ color: currentTheme.accentColor }}
                        />
                      ) : (
                        <Upload
                          className="w-6 h-6"
                          style={{ color: currentTheme.accentColor }}
                        />
                      )}
                    </div>
                    {selectedFile ? (
                      <>
                        <div className="text-sm font-semibold" style={{ color: textColor }}>
                          {selectedFile.name}
                        </div>
                        <div className="text-xs" style={{ color: mutedColor }}>
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-semibold" style={{ color: textColor }}>
                          Choose a file (Android-safe picker)
                        </div>
                        <div className="text-xs" style={{ color: mutedColor }}>
                          CSV or JSON format
                        </div>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="*/*"
                    onClick={handleFileInputClick}
                    onChange={handleFileSelect}
                    onInput={handleFileInput}
                    className="mt-3 w-full text-sm"
                    style={{ color: textColor }}
                  />
                </div>
              </div>

              {/* Paste Fallback */}
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: textColor }}>
                  Android fallback: paste CSV/JSON text
                </h3>
                <textarea
                  value={pastedData}
                  onChange={(e) => {
                    setPastedData(e.target.value);
                    if (e.target.value.trim().length > 0) {
                      setSelectedFile(null);
                      setImportStatus('idle');
                      setErrorMessage('');
                    }
                  }}
                  placeholder="Paste your exported CSV text here if file picker fails..."
                  className="w-full min-h-[100px] rounded-xl border p-3 text-xs resize-y"
                  style={{
                    backgroundColor: currentTheme.backgroundColor,
                    borderColor: currentTheme.borderColor,
                    color: textColor,
                  }}
                />
              </div>

              {/* Status Messages */}
              {importStatus === 'processing' && (
                <div
                  className="p-4 rounded-xl flex items-center gap-3"
                  style={{
                    backgroundColor: `${currentTheme.accentColor}10`,
                  }}
                >
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    style={{ color: currentTheme.accentColor }}
                  />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: textColor }}>
                      Processing...
                    </div>
                    <div className="text-xs" style={{ color: mutedColor }}>
                      Reading your file
                    </div>
                  </div>
                </div>
              )}

              {importStatus === 'enriching' && enrichmentProgress && (
                <div
                  className="p-4 rounded-xl space-y-2"
                  style={{
                    backgroundColor: `${currentTheme.accentColor}10`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Loader2
                      className="w-5 h-5 animate-spin flex-shrink-0"
                      style={{ color: currentTheme.accentColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: textColor }}>
                        Enriching Books ({enrichmentProgress.current}/{enrichmentProgress.total})
                      </div>
                      <div className="text-xs truncate" style={{ color: mutedColor }}>
                        {enrichmentProgress.status}
                      </div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div 
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: currentTheme.borderColor }}
                  >
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${enrichmentProgress.percentage}%`,
                        background: currentTheme.isGradient
                          ? `linear-gradient(90deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                          : currentTheme.primary,
                      }}
                    />
                  </div>
                  <div className="text-xs text-center" style={{ color: mutedColor }}>
                    {enrichmentProgress.percentage}% complete
                  </div>
                </div>
              )}

              {importStatus === 'success' && (
                <div
                  className="p-4 rounded-xl flex items-center gap-3"
                  style={{
                    backgroundColor: '#10b98110',
                  }}
                >
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#10b981' }} />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: textColor }}>
                      Success!
                    </div>
                    <div className="text-xs" style={{ color: mutedColor }}>
                      Imported {importedCount} {importedCount === 1 ? 'book' : 'books'}
                    </div>
                  </div>
                </div>
              )}

              {importStatus === 'error' && (
                <div
                  className="p-4 rounded-xl flex items-start gap-3"
                  style={{
                    backgroundColor: '#ef444410',
                  }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: textColor }}>
                      Import Failed
                    </div>
                    <div className="text-xs" style={{ color: mutedColor }}>
                      {errorMessage}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-semibold transition-all"
                  style={{
                    backgroundColor: currentTheme.backgroundColor,
                    color: mutedColor,
                    border: `1px solid ${currentTheme.borderColor}`,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={(!selectedFile && !pastedData.trim()) || importStatus === 'processing' || importStatus === 'enriching'}
                  className="flex-1 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: currentTheme.isGradient
                      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                      : currentTheme.primary,
                    color: '#ffffff',
                  }}
                >
                  {importStatus === 'processing' 
                    ? 'Processing...' 
                    : importStatus === 'enriching' 
                    ? 'Enriching...'
                    : 'Import'}
                </button>
              </div>

              {/* Help Text */}
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: currentTheme.backgroundColor,
                }}
              >
                <div className="text-xs font-semibold mb-2" style={{ color: textColor }}>
                  💡 Export Instructions
                </div>
                <div className="text-[11px] leading-relaxed" style={{ color: mutedColor }}>
                  <strong>Goodreads:</strong> My Books → Import/Export → Export Library
                  <br />
                  <strong>StoryGraph:</strong> Settings → Export Data → CSV/JSON
                  <br />
                  <strong>Fable:</strong> Settings → Export Data → CSV
                  <br />
                  <strong>Bookmory:</strong> Settings → Export → CSV/JSON
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
