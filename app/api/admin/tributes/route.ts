import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Tribute } from "@/types/tribute";

const IS_VERCEL = !!process.env.VERCEL;
const USE_KV = !!process.env.KV_REST_API_URL;

const DATA_FILE = IS_VERCEL && !USE_KV
  ? "/tmp/gewc_tributes.json"
  : path.join(process.cwd(), "data", "tributes.json");

const SEED_TRIBUTES: Tribute[] = [
  { id: "seed-1", name: "Pastor Emmanuel Okafor", role: "Senior Pastor", message: "Greater Evangelism World Crusade has been a beacon of light.", createdAt: "2026-11-01T10:00:00.000Z" },
  { id: "seed-2", name: "Sister Grace Adeyemi", role: "Church Member", message: "I gave my life to Christ at a GEWC crusade in 2010.", createdAt: "2026-11-05T14:30:00.000Z" },
  { id: "seed-3", name: "Deacon Peter Nwosu", role: "Elder", message: "The impact of GEWC on our community cannot be measured.", createdAt: "2026-11-10T09:15:00.000Z" },
];

async function readTributes(): Promise<Tribute[]> {
  if (USE_KV) {
    const { kv } = await import("@vercel/kv");
    return (await kv.get<Tribute[]>("gewc_tributes")) ?? [...SEED_TRIBUTES];
  }
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [...SEED_TRIBUTES];
  }
}

function checkAuth(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return token === adminPassword;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const tributes = await readTributes();
    return NextResponse.json([...tributes].reverse());
  } catch {
    return NextResponse.json({ error: "Failed to load tributes." }, { status: 500 });
  }
}
