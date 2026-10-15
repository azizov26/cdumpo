import type { Metadata } from "next";
import { connection } from "next/server";
import config from "@payload-config";
import { generatePageMetadata, RootPage } from "@payloadcms/next/views";
import { importMap } from "../importMap";

// Админка — служебный раздел: всегда рендерится по запросу (Payload использует текущее время, сессию),
// мгновенная навигация и пререндер ей не нужны.
export const instant = false;

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  await connection();
  return generatePageMetadata({ config, params, searchParams });
};

const Page = async ({ params, searchParams }: Args) => {
  await connection();
  return RootPage({ config, params, searchParams, importMap });
};

export default Page;
