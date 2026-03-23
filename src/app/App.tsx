import { WelcomeBanner } from "./components/WelcomeBanner";
import { ThemePicker } from "./components/ThemePicker";
import { QuickNav } from "./components/QuickNav";
import { CurrentlyReading } from "./components/CurrentlyReading";
import { ReadingGoals } from "./components/ReadingGoals";
import { ThisWeek } from "./components/ThisWeek";
import { StatsGrid } from "./components/StatsGrid";
import { Recommendations } from "./components/Recommendations";
import { RecentBadges } from "./components/RecentBadges";
import { MonthProgress } from "./components/MonthProgress";
import { DidYouKnow } from "./components/DidYouKnow";

export default function App() {
  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{ background: "#080011" }}
    >
      {/* Mobile container */}
      <div className="w-full max-w-[390px] flex flex-col gap-6 px-4 py-6 pb-12">
        {/* ─── Theme Picker ─── */}
        <ThemePicker />

        {/* ─── Welcome Banner ─── */}
        <WelcomeBanner />

        {/* ─── Quick Nav (Reading Stories) ─── */}
        <QuickNav />

        {/* ─── Currently Reading ─── */}
        <CurrentlyReading />

        {/* ─── Reading Goals ─── */}
        <ReadingGoals />

        {/* ─── This Week ─── */}
        <ThisWeek />

        {/* ─── Stats Grid ─── */}
        <StatsGrid />

        {/* ─── Recommendations ─── */}
        <Recommendations />

        {/* ─── Recent Badges ─── */}
        <RecentBadges />

        {/* ─── March Progress ─── */}
        <MonthProgress />

        {/* ─── Did You Know? ─── */}
        <DidYouKnow />
      </div>
    </div>
  );
}
