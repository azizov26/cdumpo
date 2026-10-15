import { NextResponse, type NextRequest } from "next/server";
import { searchNews } from "@/lib/content/news";

/** Поиск для ленты «Жизни уммы»: /umma/poisk?q=… → { items }. Только чтение опубликованного. */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  try {
    return NextResponse.json({ items: await searchNews(q) }, { headers: { "Cache-Control": "public, max-age=60" } });
  } catch (e) {
    console.error("[cms] поиск новостей:", e instanceof Error ? e.message : e);
    return NextResponse.json({ items: [], error: true }, { status: 503 });
  }
}
