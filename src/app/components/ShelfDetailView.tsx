import { ArrowLeft, Star, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { BookCover } from './BookCover';

interface Book {
  title: string;
  author: string;
  cover: string;
  rating?: number;
  notes?: string;
}

interface ShelfDetailViewProps {
  shelf: {
    id: string;
    name: string;
    icon: any;
    color: string;
    books: Book[];
  };
  onBack: () => void;
  onBookClick: (book: Book) => void;
  onAddBook?: () => void;
}

export function ShelfDetailView({ shelf, onBack, onBookClick, onAddBook }: ShelfDetailViewProps) {
  const { currentTheme } = useTheme();
  const Icon = shelf.icon;

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div 
        className="rounded-xl p-5 text-white shadow-sm"
        style={{
          background: currentTheme.isGradient
            ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
            : currentTheme.primary
        }}
      >
        <button 
          onClick={onBack}
          className="mb-3 p-1.5 -ml-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-lg">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">{shelf.name}</h1>
              <p className="text-white/70 text-xs mt-0.5">{shelf.books.length} {shelf.books.length === 1 ? 'book' : 'books'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onAddBook && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onAddBook();
                }}
                className="p-2 bg-white/15 rounded-lg hover:bg-white/25 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {shelf.books.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {shelf.books.map((book, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onBookClick(book)}
              className="cursor-pointer"
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md mb-2 relative">
                <BookCover 
                  src={book.cover} 
                  alt={book.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {book.rating && (
                  <div className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] text-white font-semibold">{book.rating}</span>
                  </div>
                )}
              </div>
              <h3 className="text-xs font-semibold line-clamp-2 mb-0.5" style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}>{book.title}</h3>
              <p className="text-[10px] line-clamp-1" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>{book.author}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div 
          className="rounded-xl p-8 text-center relative overflow-hidden"
          style={{
            background: currentTheme.textColor === 'light' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <div 
            className="inline-flex p-4 rounded-2xl mb-3 shadow-lg"
            style={{
              background: currentTheme.isGradient
                ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                : currentTheme.primary
            }}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 
            className="font-bold mb-1"
            style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
          >
            No books yet
          </h3>
          <p 
            className="text-sm"
            style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
          >
            Start adding books to this shelf!
          </p>
        </div>
      )}
    </div>
  );
}