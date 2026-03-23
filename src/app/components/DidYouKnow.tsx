import { Sparkles } from "lucide-react";

export function DidYouKnow() {
  return (
    <div
      className="rounded-[16px] px-5 py-5 flex flex-col gap-2 shadow-lg relative overflow-hidden"
      style={{ background: "linear-gradient(163.25deg, #FF0000 0%, #1031C6 100%)" }}
    >
      {/* Watermark */}
      <div className="absolute right-4 bottom-4 opacity-10">
        <svg width="72" height="72" viewBox="0 0 72 88" fill="none">
          <path
            d="M4 74V14C4 11.3478 5.05357 8.8043 6.92893 6.92893C8.8043 5.05357 11.3478 4 14 4H64C65.0609 4 66.0783 4.42143 66.8284 5.17157C67.5786 5.92172 68 6.93913 68 8V80C68 81.0609 67.5786 82.0783 66.8284 82.8284C66.0783 83.5786 65.0609 84 64 84H14C11.3478 84 8.8043 82.9464 6.92893 81.0711C5.05357 79.1957 4 76.6522 4 74ZM4 74C4 71.3478 5.05357 68.8043 6.92893 66.9289C8.8043 65.0536 11.3478 64 14 64H68"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex items-center gap-2">
        <Sparkles size={20} color="white" />
        <h3 className="text-white" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.44px" }}>
          Did You Know?
        </h3>
      </div>
      <p className="text-white/90" style={{ fontSize: 14, lineHeight: "20px" }}>
        You've read{" "}
        <span style={{ fontWeight: 700 }}>2,389 pages</span>
        {" "}this year. That's equivalent to{" "}
        <span style={{ fontWeight: 700 }}>7 average novels</span>! 📚✨
      </p>
    </div>
  );
}
