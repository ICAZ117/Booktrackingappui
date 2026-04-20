import { ArrowLeft, Star, Plus, ChevronDown, PencilLine, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { BookCover } from './BookCover';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating?: number;
  averageRating?: number;
}

interface ShelfDetailViewProps {
  shelf: {
    id: string;
    name: string;
    icon: any;
    color: string;
    books: Book[];
  };
  allBooks: Book[];
  onBack: () => void;
  onBookClick: (book: Book) => void;
  onAddBook?: () => void;
  onToggleBookInShelf?: (bookId: string) => void;
  onRemoveBookFromShelf?: (bookId: string) => void;
  onMoveBookToShelf?: (bookId: string, targetShelfId: string) => void;
  onAddBookToShelf?: (bookId: string, targetShelfId: string) => void;
  availableShelves?: { id: string; name: string }[];
  showSuggestions?: boolean;
  canModifyShelf?: boolean;
}

const SHELF_SELECTION_KEY_PREFIX = 'readtrack_shelf_display_selection_';

export function ShelfDetailView({
  shelf,
  allBooks,
  onBack,
  onBookClick,
  onAddBook,
  onToggleBookInShelf,
  onRemoveBookFromShelf,
  onMoveBookToShelf,
  onAddBookToShelf,
  availableShelves = [],
  showSuggestions = true,
  canModifyShelf = true,
}: ShelfDetailViewProps) {
  const shelfBookIds = new Set(shelf.books.map((book) => book.id));
  const suggestedBooks = allBooks.filter((book) => !shelfBookIds.has(book.id)).slice(0, 10);
  const hasOverflowShelf = shelf.books.length > 6;
  const [showShelfPicker, setShowShelfPicker] = useState(false);
  const [shelfDisplayIds, setShelfDisplayIds] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openMenuBookId, setOpenMenuBookId] = useState<string | null>(null);
  const [showMoveTargetsForBookId, setShowMoveTargetsForBookId] = useState<string | null>(null);
  const [showAddTargetsForBookId, setShowAddTargetsForBookId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(`${SHELF_SELECTION_KEY_PREFIX}${shelf.id}`);
    if (!raw) {
      setShelfDisplayIds([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setShelfDisplayIds(Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string').slice(0, 6) : []);
    } catch {
      setShelfDisplayIds([]);
    }
  }, [shelf.id]);

  useEffect(() => {
    setShelfDisplayIds((prev) => prev.filter((id) => shelfBookIds.has(id)).slice(0, 6));
  }, [shelf.books]);

  useEffect(() => {
    localStorage.setItem(`${SHELF_SELECTION_KEY_PREFIX}${shelf.id}`, JSON.stringify(shelfDisplayIds));
  }, [shelf.id, shelfDisplayIds]);

  useEffect(() => {
    setIsEditMode(false);
    setOpenMenuBookId(null);
    setShowMoveTargetsForBookId(null);
    setShowAddTargetsForBookId(null);
  }, [shelf.id, shelf.books.length]);

  const toggleShelfDisplayBook = (bookId: string) => {
    setShelfDisplayIds((prev) => {
      if (prev.includes(bookId)) return prev.filter((id) => id !== bookId);
      if (prev.length >= 6) return prev;
      return [...prev, bookId];
    });
  };

  const moveTargets = availableShelves.filter((option) => option.id !== shelf.id);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-4 sm:p-5" style={{ background: 'linear-gradient(120deg, #3298ff 0%, #f83aef 100%)' }}>
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 px-3">
            <h1 className="text-2xl font-bold text-white">{shelf.name}</h1>
            <p className="text-sm text-white/80">{shelf.books.length} books</p>
          </div>
          {onAddBook ? (
            <div className="flex items-center gap-2">
              {canModifyShelf && shelf.books.length > 0 && (
                <button
                  onClick={() => {
                    setIsEditMode((prev) => !prev);
                    setOpenMenuBookId(null);
                    setShowMoveTargetsForBookId(null);
                  }}
                  className="px-2.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#fff' }}
                >
                  {isEditMode ? <X className="w-4 h-4" /> : <PencilLine className="w-4 h-4" />}
                  {isEditMode ? 'Done' : 'Edit Shelf'}
                </button>
              )}
              <button
                onClick={onAddBook}
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>
      </div>

      <div className="max-h-[58vh] overflow-y-auto pr-1">
        {hasOverflowShelf && (
          <button
            onClick={() => setShowShelfPicker((prev) => !prev)}
            className="w-full mb-3 rounded-lg px-3 py-2 text-xs font-semibold border"
            style={{
              borderColor: showShelfPicker ? '#fbbf24' : '#2a2f3a',
              color: showShelfPicker ? '#fbbf24' : '#cbd5e1',
              backgroundColor: showShelfPicker ? 'rgba(251,191,36,0.08)' : 'transparent',
            }}
          >
            {showShelfPicker
              ? `Picking books shown on shelf (${shelfDisplayIds.length}/6)`
              : 'Pick your books to show on your shelf'}
          </button>
        )}

        {shelf.books.length === 0 && (
          <div
            className="rounded-xl p-3 text-sm mb-4"
            style={{
              borderColor: '#2a2f3a',
              borderWidth: '1px',
              color: '#94a3b8',
            }}
          >
            No books yet in this shelf.
          </div>
        )}

        {shelf.books.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {shelf.books.map((book, index) => {
              const displayRating =
                typeof book.rating === 'number'
                  ? book.rating
                  : typeof book.averageRating === 'number'
                    ? Number(book.averageRating.toFixed(2))
                    : null;

              return (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="w-full"
                >
                  <button
                    onClick={() => {
                      if (isEditMode) return;
                      onBookClick(book);
                    }}
                    className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-md mb-2"
                  >
                    <BookCover src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                    {displayRating !== null && (
                      <div className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full px-2 py-1 bg-black/80 text-amber-100 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span>{Number.isInteger(displayRating) ? displayRating : displayRating.toFixed(2)}</span>
                      </div>
                    )}
                  </button>
                  <div className="text-[13px] leading-tight font-semibold text-slate-100 line-clamp-1">{book.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mb-2">{book.author}</div>
                  {hasOverflowShelf && showShelfPicker && (
                    <button
                      onClick={() => toggleShelfDisplayBook(book.id)}
                      className="w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold border"
                      style={{
                        borderColor: shelfDisplayIds.includes(book.id) ? '#fbbf24' : '#2a2f3a',
                        color: shelfDisplayIds.includes(book.id) ? '#fbbf24' : '#cbd5e1',
                        backgroundColor: shelfDisplayIds.includes(book.id) ? 'rgba(251,191,36,0.08)' : 'transparent',
                        opacity: !shelfDisplayIds.includes(book.id) && shelfDisplayIds.length >= 6 ? 0.55 : 1,
                      }}
                      disabled={!shelfDisplayIds.includes(book.id) && shelfDisplayIds.length >= 6}
                    >
                      {shelfDisplayIds.includes(book.id) ? 'Hide on shelf' : 'Show on shelf'}
                    </button>
                  )}
                  {isEditMode && (
                    <div className="relative">
                      <button
                        onClick={() => {
                          setOpenMenuBookId((prev) => (prev === book.id ? null : book.id));
                          setShowMoveTargetsForBookId(null);
                        }}
                        className="w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold border inline-flex items-center justify-center gap-1.5"
                        style={{
                          borderColor: '#2a2f3a',
                          color: '#cbd5e1',
                          backgroundColor: 'transparent',
                        }}
                      >
                        Actions
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {openMenuBookId === book.id && (
                        <div
                          className="absolute z-30 left-0 right-0 mt-1 rounded-lg border p-1.5 space-y-1"
                          style={{
                            borderColor: '#2a2f3a',
                            backgroundColor: 'rgba(15, 20, 30, 0.98)',
                          }}
                        >
                          {canModifyShelf && onRemoveBookFromShelf && (
                            <button
                              onClick={() => {
                                onRemoveBookFromShelf(book.id);
                                setOpenMenuBookId(null);
                              }}
                              className="w-full text-left rounded-md px-2 py-1.5 text-xs font-semibold"
                              style={{ color: '#fca5a5', backgroundColor: 'rgba(239,68,68,0.08)' }}
                            >
                              Remove from shelf
                            </button>
                          )}

                          {onMoveBookToShelf && moveTargets.length > 0 && (
                            <>
                              <button
                                onClick={() => {
                                  setShowMoveTargetsForBookId((prev) => (prev === book.id ? null : book.id))
                                  setShowAddTargetsForBookId(null);
                                }}
                                className="w-full text-left rounded-md px-2 py-1.5 text-xs font-semibold"
                                style={{ color: '#cbd5e1', backgroundColor: 'transparent' }}
                              >
                                Move to another shelf
                              </button>
                              {showMoveTargetsForBookId === book.id && (
                                <div className="space-y-1 max-h-28 overflow-y-auto">
                                  {moveTargets.map((target) => (
                                    <button
                                      key={`${book.id}-${target.id}`}
                                      onClick={() => {
                                        onMoveBookToShelf(book.id, target.id);
                                        setOpenMenuBookId(null);
                                        setShowMoveTargetsForBookId(null);
                                        setShowAddTargetsForBookId(null);
                                      }}
                                      className="w-full text-left rounded-md px-2 py-1.5 text-xs"
                                      style={{ color: '#93c5fd', backgroundColor: 'rgba(59,130,246,0.08)' }}
                                    >
                                      {target.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          {onAddBookToShelf && moveTargets.length > 0 && (
                            <button
                              onClick={() => {
                                setShowAddTargetsForBookId((prev) => (prev === book.id ? null : book.id));
                                setShowMoveTargetsForBookId(null);
                              }}
                              className="w-full text-left rounded-md px-2 py-1.5 text-xs font-semibold"
                              style={{ color: '#cbd5e1', backgroundColor: 'transparent' }}
                            >
                              Add to another shelf
                            </button>
                          )}
                          {onAddBookToShelf && showAddTargetsForBookId === book.id && (
                            <div className="space-y-1 max-h-28 overflow-y-auto">
                              {moveTargets.map((target) => (
                                <button
                                  key={`add-${book.id}-${target.id}`}
                                  onClick={() => {
                                    onAddBookToShelf(book.id, target.id);
                                    setOpenMenuBookId(null);
                                    setShowMoveTargetsForBookId(null);
                                    setShowAddTargetsForBookId(null);
                                  }}
                                  className="w-full text-left rounded-md px-2 py-1.5 text-xs"
                                  style={{ color: '#86efac', backgroundColor: 'rgba(34,197,94,0.1)' }}
                                >
                                  {target.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {showSuggestions && canModifyShelf && onToggleBookInShelf && !isEditMode && (
          <>
            <div className="text-xs font-semibold text-slate-300 mb-2">Suggestions to add to {shelf.name}</div>
            <div className="space-y-2 mb-3">
              {suggestedBooks.length === 0 && (
                <div className="text-xs text-slate-500">All books are already in this shelf.</div>
              )}
              {suggestedBooks.map((book) => (
                <div
                  key={`shelf-suggestion-${book.id}`}
                  className="rounded-xl p-2.5 flex items-center gap-3"
                  style={{
                    borderColor: '#2a2f3a',
                    borderWidth: '1px',
                  }}
                >
                  <div className="w-10 h-14 rounded overflow-hidden flex-shrink-0">
                    <BookCover src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-100 line-clamp-1">{book.title}</div>
                    <div className="text-xs text-slate-400 line-clamp-1">{book.author}</div>
                  </div>
                  <button
                    onClick={() => onToggleBookInShelf(book.id)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold border"
                    style={{
                      borderColor: '#2a2f3a',
                      color: '#cbd5e1',
                      backgroundColor: 'transparent',
                    }}
                  >
                    Add to shelf
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
