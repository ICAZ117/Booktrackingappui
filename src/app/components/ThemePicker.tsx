const THEMES = [
  { label: "Create", gradient: null, isCreate: true },
  { label: "Ocean Sunset", gradient: "linear-gradient(135deg, #3298FF 0%, #F83AEF 100%)" },
  { label: "Neutral", gradient: "linear-gradient(135deg, #A07856 0%, #C8B799 100%)" },
  { label: "Monochrome", gradient: "linear-gradient(135deg, #000000 0%, #4B5563 100%)" },
  { label: "Burgundy", gradient: "linear-gradient(135deg, #7C2D3A 0%, #4A1520 100%)" },
  { label: "Periwinkle", gradient: null, solidColor: "#9FA8DA" },
  { label: "Sunset Coral", gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)" },
  { label: "Forest", gradient: "linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)" },
  { label: "Lavender", gradient: "linear-gradient(135deg, #9D4EDD 0%, #C77DFF 100%)" },
  { label: "Electric Spectrum", gradient: "linear-gradient(135deg, #FF0000 0%, #1031C6 100%)", isActive: true },
  { label: "My Custom Theme", gradient: "linear-gradient(135deg, #EC4899 0%, #3298FF 100%)", isCustom: true },
  { label: "My Custom Theme", gradient: "linear-gradient(135deg, #360909 0%, #000000 100%)", isCustom: true },
];

export function ThemePicker() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path
            d="M8 1.33333C4.33333 1.33333 1.33333 4.33333 1.33333 8C1.33333 11.6667 4.33333 14.6667 8 14.6667C8.61733 14.6667 9.09867 14.1693 9.09867 13.5413C9.09867 13.25 8.97867 12.9847 8.80733 12.7913C8.614 12.5987 8.51533 12.3567 8.51533 12.0413C8.51533 11.3947 9.03467 10.9293 9.62733 10.9293H10.958C12.992 10.9293 14.6613 9.26067 14.6613 7.22667C14.6433 4.008 11.6407 1.33333 8 1.33333Z"
            stroke="#D1D5DB"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[#D1D5DB]" style={{ fontSize: 14, fontWeight: 600 }}>Choose Your Theme</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {THEMES.map((theme, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-14">
            {theme.isCreate ? (
              <div
                className="w-14 h-14 rounded-full bg-[#1a0a28] flex items-center justify-center"
                style={{ border: "2px dashed red" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="red" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 5V19" stroke="red" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            ) : (
              <div
                className="w-14 h-14 rounded-full shrink-0 relative"
                style={{
                  background: theme.gradient ?? theme.solidColor ?? "#9FA8DA",
                  boxShadow: theme.isActive
                    ? "0 0 0 2px white, 0 0 0 5px #252525"
                    : "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                }}
              >
                {theme.isActive && (
                  <div className="absolute inset-0 rounded-full flex items-center justify-center">
                    <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
            <span
              className="text-center whitespace-nowrap"
              style={{
                fontSize: 10,
                color: theme.isCreate || theme.isActive ? "red" : "#9CA3AF",
                maxWidth: 56,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {theme.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
