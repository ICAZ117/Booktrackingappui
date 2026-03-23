import { Star, Clock } from 'lucide-react';
import { BookCover } from './BookCover';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen, Headphones, Smartphone } from 'lucide-react';

interface BookCardProps {
  title: string;
  author: string;
  cover: string;
  rating?: number;
  progress?: number;
  pages?: number;
  currentPage?: number;
  status?: 'reading' | 'completed' | 'want-to-read' | 'dnf';
  format?: 'physical' | 'ebook' | 'audiobook';
  size?: 'small' | 'medium' | 'large';
}

export function BookCard({ 
  title, 
  author, 
  cover, 
  rating, 
  progress, 
  pages, 
  currentPage, 
  status = 'completed',
  format,
  size = 'medium' 
}: BookCardProps) {
  const { currentTheme } = useTheme();
  
  const sizeClasses = {
    small: 'w-24',
    medium: 'w-32',
    large: 'w-40'
  };

  const heightClasses = {
    small: 'h-36',
    medium: 'h-48',
    large: 'h-60'
  };

  return (
    <div className="group cursor-pointer">
      <div className={`${sizeClasses[size]} relative`}>
        <div className={`${heightClasses[size]} rounded-lg overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300 relative`}>
          <BookCover 
            src={cover} 
            alt={title}
            className="w-full h-full object-cover"
          />
          {status === 'reading' && progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full"
                  style={{ 
                    width: `${progress}%`,
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                  }}
                />
              </div>
              <div className="text-white text-xs mt-1">{progress}%</div>
            </div>
          )}
          {status === 'want-to-read' && (
            <div className="absolute top-2 right-2">
              <Star className="w-5 h-5 text-white fill-white drop-shadow-lg" />
            </div>
          )}
          {format === 'ebook' && (
            <div className="absolute top-2 left-2">
              <Smartphone className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
          )}
          {format === 'audiobook' && (
            <div className="absolute top-2 left-2">
              <Headphones className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
          )}
          {format === 'physical' && (
            <div className="absolute top-2 left-2">
              <BookOpen className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
          )}
        </div>
        {rating && (
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < rating ? 'text-[#f83aef] fill-[#f83aef]' : 'text-gray-300'}`}
                style={i < rating ? { color: currentTheme.secondary, fill: currentTheme.secondary } : {}}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-2">
        <div className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-[#3298ff] transition-colors" style={{ color: undefined }}>{title}</div>
        <div className="text-xs text-gray-600 mt-0.5">{author}</div>
        {currentPage && pages && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <Clock className="w-3 h-3" />
            <span>{currentPage} / {pages} pages</span>
          </div>
        )}
      </div>
    </div>
  );
}