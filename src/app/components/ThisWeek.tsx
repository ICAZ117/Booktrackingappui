import { Check } from "lucide-react";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function ThisWeek() {
  return (
    <div
      className="rounded-[16px] bg-[#1a0a28] px-5 py-5 flex flex-col gap-4"
      style={{ border: "1px solid #2d1142", boxShadow: "0 10px 15px 0 rgba(0,0,0,0.1), 0 4px 6px 0 rgba(0,0,0,0.1)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[14px] flex items-center justify-center"
            style={{ background: "rgba(255,0,0,0.13)" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M9.33333 2.33333V7M18.6667 2.33333V7M22.1667 4.66667H5.83333C4.54467 4.66667 3.5 5.71134 3.5 7V23.3333C3.5 24.622 4.54467 25.6667 5.83333 25.6667H22.1667C23.4553 25.6667 24.5 24.622 24.5 23.3333V7C24.5 5.71134 23.4553 4.66667 22.1667 4.66667ZM3.5 11.6667H24.5"
                stroke="red"
                strokeWidth="2.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-white" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.44px" }}>
              This Week
            </p>
            <p className="text-[#9CA3AF]" style={{ fontSize: 12 }}>
              Track your reading days
            </p>
          </div>
        </div>
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ background: "rgba(255,0,0,0.13)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M13.4493 3.87492C13.8018 3.52254 13.9998 3.04457 13.9999 2.54616C13.9999 2.04775 13.802 1.56973 13.4496 1.21725C13.0972 0.864781 12.6193 0.666729 12.1209 0.666667C11.6224 0.666604 11.1444 0.864537 10.792 1.21692L1.89462 10.1163C1.73984 10.2706 1.62537 10.4606 1.56129 10.6696L0.680623 13.5709C0.663393 13.6286 0.662092 13.6898 0.676857 13.7482C0.691622 13.8065 0.721903 13.8597 0.764487 13.9023C0.807071 13.9448 0.86037 13.975 0.918729 13.9896C0.977087 14.0043 1.03833 14.0029 1.09596 13.9856L3.99796 13.1056C4.20674 13.0421 4.39674 12.9283 4.55129 12.7743L13.4493 3.87492Z"
              stroke="red"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Streak card */}
      <div
        className="rounded-[14px] px-3 py-3 flex items-center justify-between"
        style={{
          background: "linear-gradient(169.665deg, rgba(255,0,0,0.082) 0%, rgba(255,0,0,0.145) 100%)",
          border: "1px solid rgba(255,0,0,0.25)",
        }}
      >
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.08333 12.0833C7.63587 12.0833 8.16577 11.8638 8.55647 11.4731C8.94717 11.0824 9.16667 10.5525 9.16667 10C9.16667 8.85 8.75 8.33333 8.33333 7.5C7.44 5.71417 8.14667 4.12167 10 2.5C10.4167 4.58333 11.6667 6.58333 13.3333 7.91667C15 9.25 15.8333 10.8333 15.8333 12.5C15.8333 13.266 15.6825 14.0246 15.3893 14.7323C15.0961 15.4401 14.6665 16.0831 14.1248 16.6248C13.5831 17.1665 12.9401 17.5961 12.2323 17.8893C11.5246 18.1825 10.766 18.3333 10 18.3333C9.23396 18.3333 8.47541 18.1825 7.76768 17.8893C7.05995 17.5961 6.41689 17.1665 5.87521 16.6248C5.33354 16.0831 4.90386 15.4401 4.6107 14.7323C4.31755 14.0246 4.16667 13.266 4.16667 12.5C4.16667 11.5392 4.5275 10.5883 5 10C5 10.5525 5.21949 11.0824 5.61019 11.4731C6.0009 11.8638 6.5308 12.0833 7.08333 12.0833Z"
              stroke="red"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <p className="text-white" style={{ fontSize: 14, fontWeight: 700 }}>
              1 Day Streak! 🔥
            </p>
            <p className="text-[#9CA3AF]" style={{ fontSize: 12 }}>
              Keep it going!
            </p>
          </div>
        </div>
        <span className="text-red-500" style={{ fontSize: 24, fontWeight: 700 }}>
          1
        </span>
      </div>

      {/* Marked for Today button */}
      <button
        className="w-full rounded-[14px] py-4 flex items-center justify-center gap-2 opacity-90"
        style={{ background: "#FF0000" }}
      >
        <Check size={24} color="white" strokeWidth={2} />
        <span className="text-white" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.44px" }}>
          Marked for Today! 🎉
        </span>
      </button>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-full rounded-[10px] flex items-center justify-center"
              style={{
                height: 48,
                background: i === 0 ? "#FF0000" : "#374151",
              }}
            >
              {i === 0 && <Check size={16} color="white" strokeWidth={2.5} />}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: i === 0 ? "red" : "#9CA3AF",
                letterSpacing: 0.1,
              }}
            >
              {i === 0 ? "Today" : day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
