import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Tribute } from "@/types/tribute";

const IS_VERCEL = !!process.env.VERCEL;
const USE_KV = !!process.env.KV_REST_API_URL;

// Local dev → data/tributes.json
// Vercel without KV → /tmp (writable; persists within a warm function instance)
// Vercel with KV → Upstash Redis
const DATA_FILE = IS_VERCEL && !USE_KV
  ? "/tmp/gewc_tributes.json"
  : path.join(process.cwd(), "data", "tributes.json");

const SEED_TRIBUTES: Tribute[] = [
  {
    id: "seed-1",
    name: "Pastor Emmanuel Okafor",
    role: "Senior Pastor",
    message:
      "Greater Evangelism World Crusade has been a beacon of light to countless souls across Nigeria and the world. Through the power of the Holy Spirit, lives are transformed daily. I am proud and honoured to have been part of this great move of God for over two decades.",
    createdAt: "2026-11-01T10:00:00.000Z",
  },
  {
    id: "seed-2",
    name: "Sister Grace Adeyemi",
    role: "Church Member",
    message:
      "I gave my life to Christ at a GEWC crusade in 2010, and my life has never been the same since. The ministry's commitment to genuine evangelism and sincere discipleship is truly unmatched. May God continue to expand this Great Commission to the ends of the earth.",
    createdAt: "2026-11-05T14:30:00.000Z",
  },
  {
    id: "seed-3",
    name: "Deacon Peter Nwosu",
    role: "Elder",
    message:
      "The impact of GEWC on our community cannot be measured in earthly terms. From powerful crusades to welfare programs and prison outreaches, this church truly lives out the Great Commission. I am eternally grateful for the privilege of serving in this ministry.",
    createdAt: "2026-11-10T09:15:00.000Z",
  },
];

// Seed /tmp on first request if the file doesn't exist yet
async function ensureFile(): Promise<void> {
  if (!IS_VERCEL || USE_KV) return;
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(SEED_TRIBUTES, null, 2),
      "utf-8"
    );
  }
}

async function readTributes(): Promise<Tribute[]> {
  if (USE_KV) {
    const { kv } = await import("@vercel/kv");
    return (await kv.get<Tribute[]>("gewc_tributes")) ?? [...SEED_TRIBUTES];
  }
  await ensureFile();
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [...SEED_TRIBUTES];
  }
}

async function saveTributes(tributes: Tribute[]): Promise<void> {
  if (USE_KV) {
    const { kv } = await import("@vercel/kv");
    await kv.set("gewc_tributes", tributes);
    return;
  }
  await fs.writeFile(DATA_FILE, JSON.stringify(tributes, null, 2), "utf-8");
}

export async function GET() {
  try {
    const tributes = await readTributes();
    return NextResponse.json([...tributes].reverse());
  } catch (error) {
    console.error("GET /api/tributes:", error);
    return NextResponse.json([...SEED_TRIBUTES].reverse());
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, role, message, document } = body ?? {};

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name and message are required." },
        { status: 400 }
      );
    }
    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    // Validate attached document if present (max ~2.5MB base64)
    if (document) {
      const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!allowed.includes(document.type)) {
        return NextResponse.json(
          { error: "Unsupported file type." },
          { status: 400 }
        );
      }
      if (typeof document.data === "string" && document.data.length > 3_500_000) {
        return NextResponse.json(
          { error: "Attached document is too large (max 2 MB)." },
          { status: 400 }
        );
      }
    }

    const tributes = await readTributes();

    const newTribute: Tribute = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim().slice(0, 120),
      role: role?.trim().slice(0, 60) || "Well-Wisher",
      message: message.trim().slice(0, 1000),
      createdAt: new Date().toISOString(),
      ...(document && {
        document: {
          data: document.data as string,
          type: document.type as string,
          name: (document.name as string).slice(0, 200),
        },
      }),
    };

    tributes.push(newTribute);
    await saveTributes(tributes);

    return NextResponse.json(newTribute, { status: 201 });
  } catch (error) {
    console.error("POST /api/tributes:", error);
    return NextResponse.json(
      { error: "Failed to submit tribute. Please try again." },
      { status: 500 }
    );
  }
}
