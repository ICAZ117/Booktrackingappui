import { Sparkles } from "lucide-react";

const BOOKS = [
  {
    title: "Iron Flame",
    author: "Rebecca Yarros",
    reason: "Because you loved Fourth Wing",
    cover: "https://images.unsplash.com/photo-1763315371267-86318801d8ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZHJhZ29uJTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc3NDI4OTM1Mnww&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    title: "The Inmate",
    author: "Freida McFadden",
    reason: "Similar to The Housemaid",
    cover: "https://images.unsplash.com/photo-1599394463169-bd0bdf8e247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwdGhyaWxsZXIlMjBkYXJrJTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc3NDI4OTM1Mnww&ixlib=rb-4.1.0&q=80&w=400",
  },
  {
    title: "Artemis",
    author: "Andy Weir",
    reason: "More from Andy Weir",
    cover: "https://images.unsplash.com/photo-1599394463169-bd0bdf8e247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwdGhyaWxsZXIlMjBkYXJrJTIwYm9vayUyMGNvdmVyfGVufDF8fHx8MTc3NDI4OTM1Mnww&ixlib=rb-4.1.0&q=80&w=400",
  },
];

export function Recommendations() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles size={20} color="red" />
        <h2 className="text-[#F3F4F6]" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.45px" }}>
          Recommended for You
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {BOOKS.map((book, i) => (
          <div key={i} className="shrink-0 w-32 flex flex-col gap-1">
            {/* Cover */}
            <div className="relative w-32 h-48 rounded-[10px] overflow-hidden shadow-md">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay with reason */}
              <div
                className="absolute inset-0 flex items-end pb-2 px-2"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)" }}
              >
                <p className="text-white" style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.17 }}>
                  {book.reason}
                </p>
              </div>
            </div>
            <p className="text-[#F3F4F6]" style={{ fontSize: 12, fontWeight: 600 }}>
              {book.title}
            </p>
            <p className="text-[#9CA3AF]" style={{ fontSize: 10, letterSpacing: 0.1 }}>
              {book.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
