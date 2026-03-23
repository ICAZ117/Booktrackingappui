interface ProgressRowProps {
  label: string;
  value: string;
  current: number;
  total: number;
}

function ProgressRow({ label, value, current, total }: ProgressRowProps) {
  const pct = Math.min((current / total) * 100, 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[#9CA3AF]" style={{ fontSize: 14 }}>{label}</span>
        <span className="text-[#F3F4F6]" style={{ fontSize: 14, fontWeight: 600 }}>{value}</span>
      </div>
      <div className="h-2 bg-[#374151] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(178.65deg, #FF0000 0%, #1031C6 100%)",
          }}
        />
      </div>
    </div>
  );
}

export function MonthProgress() {
  return (
    <div
      className="rounded-[16px] bg-[#1a0a28] px-5 py-5 flex flex-col gap-4"
      style={{ border: "1px solid #2d1142", boxShadow: "0 10px 15px 0 rgba(0,0,0,0.1), 0 4px 6px 0 rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[#F3F4F6]" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.44px" }}>
            March Progress
          </h3>
          <p className="text-[#9CA3AF]" style={{ fontSize: 12 }}>
            You're on track!
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ProgressRow
          label="Books Completed"
          value="4 / 2"
          current={4}
          total={2}
        />
        <ProgressRow
          label="Reading Goal"
          value="2389 / 600 pages"
          current={2389}
          total={600}
        />
      </div>
    </div>
  );
}
