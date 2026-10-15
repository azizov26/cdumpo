import { PageShell } from "@/components/layout/PageShell";

export default function InnerLayout({ children }: LayoutProps<"/">) {
  return <PageShell>{children}</PageShell>;
}
