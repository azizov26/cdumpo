import type { Metadata } from "next";
import { connection } from "next/server";
import config from "@payload-config";
import { NotFoundPage } from "@payloadcms/next/views";
import { importMap } from "../importMap";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = (): Promise<Metadata> => Promise.resolve({ title: "Не найдено" });

// Как и вся админка — только по запросу: Payload при инициализации берёт текущее время.
const NotFound = async ({ params, searchParams }: Args) => {
  await connection();
  return NotFoundPage({ config, params, searchParams, importMap });
};

export default NotFound;
