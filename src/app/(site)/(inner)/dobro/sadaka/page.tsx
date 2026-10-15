import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata("/dobro/sadaka");

export default function Page() {
  return <ComingSoon path="/dobro/sadaka" />;
}
