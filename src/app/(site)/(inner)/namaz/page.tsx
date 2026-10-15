import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata("/namaz");

export default function Page() {
  return <ComingSoon path="/namaz" />;
}
