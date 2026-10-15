import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeading } from "@/components/layout/PageHeading";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Нет соединения", robots: { index: false, follow: false } };

export default function OfflinePage() {
  return (
    <PageShell>
      <PageHeading title="Нет соединения" lead="Эта страница ещё не сохранена на устройстве." />
      <div className="container-site pt-8 pb-20 md:pt-10 md:pb-28">
        <EmptyState title="Интернета сейчас нет" action={<Button href="/namaz">Время намаза</Button>}>
          Расписание намаза, которое вы уже открывали, доступно без сети. Остальные страницы загрузятся, когда связь
          вернётся.
        </EmptyState>
      </div>
    </PageShell>
  );
}
