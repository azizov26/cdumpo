import { getPrayerDays } from "@/lib/content/prayer";
import { PrayerTableSeed } from "./PrayerTableSeed";

export async function PrayerTableLoader() {
  return <PrayerTableSeed days={await getPrayerDays()} />;
}
