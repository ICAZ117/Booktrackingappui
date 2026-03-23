export function WelcomeBanner() {
  return (
    <div
      className="relative rounded-[16px] overflow-hidden shadow-lg"
      style={{ background: "linear-gradient(154.77deg, #FF0000 0%, #1031C6 100%)" }}
    >
      {/* Decorative book watermark */}
      <div className="absolute right-4 bottom-4 opacity-10">
        <svg width="96" height="96" viewBox="0 0 72 88" fill="none">
          <path
            d="M4 74V14C4 11.3478 5.05357 8.8043 6.92893 6.92893C8.8043 5.05357 11.3478 4 14 4H64C65.0609 4 66.0783 4.42143 66.8284 5.17157C67.5786 5.92172 68 6.93913 68 8V80C68 81.0609 67.5786 82.0783 66.8284 82.8284C66.0783 83.5786 65.0609 84 64 84H14C11.3478 84 8.8043 82.9464 6.92893 81.0711C5.05357 79.1957 4 76.6522 4 74ZM4 74C4 71.3478 5.05357 68.8043 6.92893 66.9289C8.8043 65.0536 11.3478 64 14 64H68"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="px-6 pt-6 pb-6">
        <h2 className="text-white" style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.4px" }}>
          Welcome back! 📚
        </h2>
        <p className="text-white/90 mt-1" style={{ fontSize: 14 }}>
          4 books this year · Great start!
        </p>

        {/* Streak nudge */}
        <div className="mt-4 bg-white/20 rounded-[14px] px-3 py-3 flex items-center gap-3">
          <div className="shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.62467 10.3333C6.56515 10.1026 6.44489 9.89207 6.27641 9.72359C6.10793 9.55511 5.89738 9.43485 5.66667 9.37533L1.57667 8.32067C1.50689 8.30086 1.44547 8.25883 1.40174 8.20096C1.35801 8.14309 1.33435 8.07254 1.33435 8C1.33435 7.92746 1.35801 7.85691 1.40174 7.79904C1.44547 7.74117 1.50689 7.69914 1.57667 7.67933L5.66667 6.624C5.8973 6.56454 6.10779 6.44438 6.27627 6.27603C6.44474 6.10767 6.56504 5.89726 6.62467 5.66667L7.67933 1.57667C7.69894 1.50661 7.74092 1.44489 7.79888 1.40093C7.85684 1.35696 7.92759 1.33317 8.00033 1.33317C8.07308 1.33317 8.14383 1.35696 8.20179 1.40093C8.25974 1.44489 8.30173 1.50661 8.32133 1.57667L9.37533 5.66667C9.43485 5.89738 9.55511 6.10793 9.72359 6.27641C9.89207 6.44489 10.1026 6.56515 10.3333 6.62467L14.4233 7.67867C14.4937 7.69807 14.5557 7.74001 14.5999 7.79805C14.6441 7.8561 14.668 7.92704 14.668 8C14.668 8.07296 14.6441 8.1439 14.5999 8.20195C14.5557 8.25999 14.4937 8.30193 14.4233 8.32133L10.3333 9.37533C10.1026 9.43485 9.89207 9.55511 9.72359 9.72359C9.55511 9.89207 9.43485 10.1026 9.37533 10.3333L8.32067 14.4233C8.30106 14.4934 8.25908 14.5551 8.20112 14.5991C8.14316 14.643 8.07241 14.6668 7.99967 14.6668C7.92692 14.6668 7.85617 14.643 7.79821 14.5991C7.74026 14.5551 7.69827 14.4934 7.67867 14.4233L6.62467 10.3333Z"
                stroke="white"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-white" style={{ fontSize: 14, fontWeight: 600 }}>
              Keep up the great reading momentum!
            </p>
            <p className="text-white/80" style={{ fontSize: 12 }}>
              You're on a 1-day streak 🔥
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
