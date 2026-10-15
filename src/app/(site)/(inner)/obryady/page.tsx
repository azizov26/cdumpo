import { ComingSoon, comingSoonMetadata } from "@/components/layout/ComingSoon";

export const metadata = comingSoonMetadata("/obryady");

export default function Page() {
  return <ComingSoon path="/obryady" />;
}
