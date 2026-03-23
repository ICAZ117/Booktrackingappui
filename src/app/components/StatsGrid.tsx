import { Flame, BookOpen, Headphones, BookMarked } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  sub: string;
  gradient?: boolean;
}

function StatCard({ icon, value, label, sub, gradient }: StatCardProps) {
  if (gradient) {
    return (
      <div
        className="rounded-[14px] p-4 flex flex-col justify-between shadow-sm relative overflow-hidden"
        style={{
          background: "linear-gradient(142.687deg, #FF0000 0%, #1031C6 100%)",
          minHeight: 141,
        }}
      >
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-white/20"
        >
          {icon}
        </div>
        <div>
          <p className="text-white" style={{ fontSize: 24, fontWeight: 700, letterSpacing: 0.07 }}>
            {value}
          </p>
          <p className="text-white/80" style={{ fontSize: 12 }}>
            {label}
          </p>
          <p className="text-white/60" style={{ fontSize: 10, letterSpacing: 0.1 }}>
            {sub}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[14px] p-4 flex flex-col justify-between"
      style={{
        background: "#1a0a28",
        border: "1px solid #2d1142",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.1)",
        minHeight: 141,
      }}
    >
      <div
        className="w-8 h-8 rounded-[10px] flex items-center justify-center"
        style={{ background: "rgba(255,0,0,0.13)" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[#F3F4F6]" style={{ fontSize: 24, fontWeight: 700, letterSpacing: 0.07 }}>
          {value}
        </p>
        <p className="text-[#9CA3AF]" style={{ fontSize: 12 }}>
          {label}
        </p>
        <p className="text-[#6B7280]" style={{ fontSize: 10, letterSpacing: 0.1 }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        gradient
        icon={<Flame size={16} color="white" />}
        value="1"
        label="Reading Streak"
        sub="day 🔥"
      />
      <StatCard
        icon={<BookOpen size={16} color="red" />}
        value="4"
        label="Books in 2026"
        sub="+4 this month"
      />
      <StatCard
        icon={<Headphones size={16} color="red" />}
        value="0h"
        label="Hours Listened"
        sub="No audiobooks"
      />
      <StatCard
        icon={<BookMarked size={16} color="red" />}
        value="2.4K"
        label="Pages Read"
        sub="Avg. 2389/day"
      />
    </div>
  );
}
