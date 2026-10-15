import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata("/dobro");

export default function Page() {
  return <ComingSoon path="/dobro" />;
}
