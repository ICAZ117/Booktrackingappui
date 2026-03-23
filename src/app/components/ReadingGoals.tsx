interface GoalRowProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
}

function GoalRow({ label, current, target, unit = "" }: GoalRowProps) {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex items-center justify-between">
        <span className="text-white/90" style={{ fontSize: 14 }}>
          {label}
        </span>
        <span className="text-white" style={{ fontSize: 14, fontWeight: 700 }}>
          {current}{unit} / {target}{unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/20 overflow-hidden">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${pct}%`, transition: "width 0.3s ease" }}
        />
      </div>
    </div>
  );
}

interface GoalSectionProps {
  title: string;
  rows: GoalRowProps[];
}

function GoalSection({ title, rows }: GoalSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-white/60" style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>
        {title}
      </span>
      {rows.map((row, i) => (
        <GoalRow key={i} {...row} />
      ))}
    </div>
  );
}

export function ReadingGoals() {
  return (
    <div
      className="rounded-[16px] px-5 py-5 flex flex-col gap-5 shadow-lg"
      style={{ background: "linear-gradient(133.9deg, #FF0000 0%, #1031C6 100%)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4.54859 1.75V1.855C4.54838 2.05959 4.49437 2.26053 4.39199 2.43766C4.2896 2.61478 4.14244 2.76187 3.96526 2.86417L3.71442 3.01C3.53707 3.1124 3.33588 3.1663 3.13109 3.1663C2.9263 3.1663 2.72511 3.1124 2.54776 3.01L2.46026 2.96333C2.19254 2.8089 1.87449 2.76701 1.57592 2.84685C1.27735 2.92668 1.02266 3.12173 0.867756 3.38917L0.739423 3.61083C0.584993 3.87855 0.543099 4.1966 0.622936 4.49517C0.702774 4.79374 0.897819 5.04843 1.16526 5.20333L1.25276 5.26167C1.42908 5.36346 1.5757 5.50963 1.67804 5.68565C1.78037 5.86167 1.83486 6.0614 1.83609 6.265V6.5625"
              stroke="white"
              strokeWidth="1.16667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-white" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.44px" }}>
            Reading Goals
          </span>
        </div>
        <div className="bg-white/20 rounded-[10px] w-[30px] h-[22px] flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <GoalSection
        title="TODAY"
        rows={[
          { label: "Pages", current: 47, target: 25 },
          { label: "Minutes", current: 0, target: 30 },
        ]}
      />
      <GoalSection
        title="THIS MONTH"
        rows={[
          { label: "Books", current: 4, target: 2 },
          { label: "Pages", current: 2389, target: 600 },
        ]}
      />
      <GoalSection
        title="THIS YEAR (2026)"
        rows={[
          { label: "Books", current: 4, target: 12 },
          { label: "Pages", current: 2389, target: 5000 },
        ]}
      />
    </div>
  );
}
