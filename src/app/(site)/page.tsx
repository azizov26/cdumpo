import { CathedralConstellation } from "@/components/sections/CathedralConstellation";
import { CompactBar } from "@/components/sections/CompactBar";
import { Footer } from "@/components/sections/Footer";
import { MobileTabBar } from "@/components/sections/MobileTabBar";
import { MosquesSection } from "@/components/sections/MosquesSection";
import { MuftiWord } from "@/components/sections/MuftiWord";
import { QuickActions } from "@/components/sections/QuickActions";
import { TodaySky } from "@/components/sections/TodaySky";
import { UmmahLife } from "@/components/sections/UmmahLife";
import { UpcomingDates } from "@/components/sections/UpcomingDates";

export default function TodayPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Перейти к содержанию
      </a>
      <TodaySky />
      <CompactBar />
      <main id="main">
        <QuickActions />
        <CathedralConstellation />
        <UmmahLife />
        <UpcomingDates />
        <MosquesSection />
        <MuftiWord />
      </main>
      <Footer />
      <MobileTabBar current="/" />
    </>
  );
}
