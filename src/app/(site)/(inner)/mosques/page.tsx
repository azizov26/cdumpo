import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata("/mosques");

export default function Page() {
  return <ComingSoon path="/mosques" />;
}
