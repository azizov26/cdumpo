import { NextResponse, type NextRequest } from "next/server";
import { getNewsPage } from "@/lib/content/news";
import { RUBRICS, type Rubric } from "@/lib/content/rubrics";

const PAGE = 12;

/** Порция ленты: /umma/lenta?rubric=Видео&offset=12 → { items, total }. */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const rubricParam = p.get("rubric");
  const rubric = RUBRICS.includes(rubricParam as Rubric) ? (rubricParam as Rubric) : null;
  const offset = Math.max(0, Math.floor(Number(p.get("offset")) / PAGE) * PAGE || 0);
  return NextResponse.json(await getNewsPage(rubric, offset, PAGE), {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
