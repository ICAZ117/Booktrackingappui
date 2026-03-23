import { BookOpen, Flame, Layers, Heart } from "lucide-react";
import { ReactNode } from "react";

interface BadgeCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
  progress?: { current: number; total: number };
}

function BadgeCard({ icon, title, desc, progress }: BadgeCardProps) {
  return (
    <div
      className="rounded-[14px] p-4 flex flex-col gap-2"
      style={{
        background: "#1a0a28",
        border: "1px solid #2d1142",
      }}
    >
      <div className="text-[#9CA3AF]">{icon}</div>
      <p className="text-[#F3F4F6]" style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.15px" }}>
        {title}
      </p>
      <p className="text-[#9CA3AF]" style={{ fontSize: 12 }}>
        {desc}
      </p>
      {progress && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[#9CA3AF]" style={{ fontSize: 12 }}>{progress.current}</span>
            <span className="text-[#9CA3AF]" style={{ fontSize: 12 }}>{progress.total}</span>
          </div>
          <div className="h-[6px] bg-[#374151] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min((progress.current / progress.total) * 100, 100)}%`,
                background: "linear-gradient(99.46deg, #FF0000 0%, #1031C6 100%)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function RecentBadges() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.8975 10.7417L14.16 17.8467C14.1741 17.9303 14.1624 18.0163 14.1264 18.0931C14.0903 18.1699 14.0317 18.2339 13.9583 18.2765C13.8849 18.3191 13.8002 18.3382 13.7157 18.3314C13.6311 18.3246 13.5506 18.2921 13.485 18.2383L10.5017 15.9992C10.3576 15.8916 10.1827 15.8334 10.0029 15.8334C9.82314 15.8334 9.64819 15.8916 9.50417 15.9992L6.51583 18.2375C6.45027 18.2912 6.36988 18.3236 6.28541 18.3305C6.20094 18.3373 6.11639 18.3182 6.04305 18.2757C5.96971 18.2333 5.91106 18.1694 5.87493 18.0928C5.8388 18.0161 5.82691 17.9303 5.84083 17.8467L7.1025 10.7417"
              stroke="#FE9A00"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="7" r="4" stroke="#FE9A00" strokeWidth="1.66667" />
          </svg>
          <h2 className="text-[#F3F4F6]" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.45px" }}>
            Recent Badges
          </h2>
        </div>
        <button className="text-red-500" style={{ fontSize: 12, fontWeight: 600 }}>
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <BadgeCard
          icon={<BookOpen size={24} />}
          title="Speed Reader"
          desc="Read 3 books in a week!"
        />
        <BadgeCard
          icon={<Flame size={24} />}
          title="30-Day Streak"
          desc="Read for 30 days straight"
        />
        <BadgeCard
          icon={<Layers size={24} />}
          title="Genre Explorer"
          desc="Read 5 different genres"
          progress={{ current: 0, total: 5 }}
        />
        <BadgeCard
          icon={<Heart size={24} />}
          title="50 Books"
          desc="Read 50 books in a year"
          progress={{ current: 4, total: 50 }}
        />
      </div>
    </div>
  );
}
