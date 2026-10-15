import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata("/znaniya");

export default function Page() {
  return <ComingSoon path="/znaniya" />;
}
