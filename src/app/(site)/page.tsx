import { BismillahIntro } from "@/components/sections/BismillahIntro";
import { CathedralConstellation } from "@/components/sections/CathedralConstellation";
import { CompactBar } from "@/components/sections/CompactBar";
import { Footer } from "@/components/sections/Footer";
import { Reveal } from "@/components/layout/Reveal";
import { MobileTabBar } from "@/components/sections/MobileTabBar";
import { MosquesSection } from "@/components/sections/MosquesSection";
import { MuftiyatSection } from "@/components/sections/MuftiyatSection";
import { PrayerMonth } from "@/components/sections/PrayerMonth";
import { QuickActions } from "@/components/sections/QuickActions";
import { TodaySky } from "@/components/sections/TodaySky";
import { UmmahLife } from "@/components/sections/UmmahLife";
import { UpcomingDates } from "@/components/sections/UpcomingDates";

export default function TodayPage() {
  return (
    <>
      <BismillahIntro />
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
        {/* Сразу под небом — время намаза на месяц, затем новости и муфтият (решения заказчика). */}
        <Reveal>
          <PrayerMonth />
        </Reveal>
        <Reveal>
          <UmmahLife />
        </Reveal>
        <Reveal>
          <MuftiyatSection />
        </Reveal>
        <Reveal>
          <CathedralConstellation />
        </Reveal>
        <Reveal>
          <UpcomingDates />
        </Reveal>
        <Reveal>
          <MosquesSection />
        </Reveal>
      </main>
      <Footer />
      <MobileTabBar current="/" />
    </>
  );
}
