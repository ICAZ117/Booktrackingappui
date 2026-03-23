import {
  Flame,
  Calendar,
  BookOpen,
  Library,
  BarChart2,
  TrendingUp,
  Headphones,
  FileText,
  CalendarDays,
  Target,
  Clock,
  Star,
  CalendarCheck,
  Zap,
  Heart,
} from "lucide-react";
import { ReactNode } from "react";

const NAV_ITEMS: { icon: ReactNode; label: string }[] = [
  { icon: <Flame size={20} />, label: "Streak" },
  { icon: <Calendar size={20} />, label: "Calendar" },
  { icon: <BookOpen size={20} />, label: "March Reads" },
  { icon: <Library size={20} />, label: "Books 2026" },
  { icon: <BarChart2 size={20} />, label: "Stats" },
  { icon: <TrendingUp size={20} />, label: "Pages/Day" },
  { icon: <Headphones size={20} />, label: "Listening" },
  { icon: <FileText size={20} />, label: "Pages" },
  { icon: <CalendarDays size={20} />, label: "This Week" },
  { icon: <Target size={20} />, label: "Goals" },
  { icon: <Clock size={20} />, label: "Averages" },
  { icon: <Star size={20} />, label: "2026" },
  { icon: <CalendarCheck size={20} />, label: "March" },
  { icon: <Zap size={20} />, label: "Speed" },
  { icon: <Heart size={20} />, label: "Ratings" },
];

export function QuickNav() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
      {NAV_ITEMS.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-16">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #FF0000 0%, #1031C6 100%)",
              padding: 2,
            }}
          >
            <div className="w-full h-full rounded-full bg-[#1a0a28] flex items-center justify-center text-[#F3F4F6]">
              {item.icon}
            </div>
          </div>
          <span
            className="text-[#F3F4F6] text-center"
            style={{ fontSize: 12, lineHeight: "16px", maxWidth: 64 }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
