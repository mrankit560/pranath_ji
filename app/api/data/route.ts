import { NextRequest, NextResponse } from "next/server";
import {
  initialBooks,
  initialScriptures,
  initialVideos,
  initialAudioTracks,
  initialEvents,
  initialArticles,
  initialSpiritualTopics,
  initialDailyThought,
  initialStats,
  initialSettings,
  initialDhams,
  initialAboutContent,
  initialChitwaniBooks,
  initialChitwaniVideos,
} from "@/lib/data/seedData";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function getDefaultData() {
  return {
    books: initialBooks,
    scriptures: initialScriptures,
    videos: initialVideos,
    audioTracks: initialAudioTracks,
    events: initialEvents,
    articles: initialArticles,
    topics: initialSpiritualTopics,
    dailyThought: initialDailyThought,
    stats: initialStats,
    settings: initialSettings,
    dhams: initialDhams,
    aboutContent: initialAboutContent,
    chitwaniBooks: initialChitwaniBooks,
    chitwaniVideos: initialChitwaniVideos,
    adminCredentials: {
      username: "admin",
      email: "admin@sadhaulidham.com",
      password: "admin123",
      updatedAt: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };
}

// Helper to safely access Cloudflare KV binding if present
function getCloudflareKv(): any {
  try {
    if (typeof globalThis !== "undefined") {
      const g = globalThis as any;
      if (g.PARAMDHAM_KV) return g.PARAMDHAM_KV;
      if (g.DATA_STORE) return g.DATA_STORE;
      if (g.PARAMDHAM_DB) return g.PARAMDHAM_DB;
      if (g.__ENV__?.PARAMDHAM_KV) return g.__ENV__.PARAMDHAM_KV;
      if (g.env?.PARAMDHAM_KV) return g.env.PARAMDHAM_KV;
    }
    if (typeof process !== "undefined" && (process as any).env) {
      const p = (process as any).env;
      if (p.PARAMDHAM_KV) return p.PARAMDHAM_KV;
      if (p.DATA_STORE) return p.DATA_STORE;
    }
  } catch {}
  return null;
}

function readNodeDiskDatabase() {
  try {
    const nodeRequire = eval("require");
    const fs = nodeRequire("fs");
    const path = nodeRequire("path");
    const dataDir = path.join(process.cwd(), "data");
    const dbFile = path.join(dataDir, "db.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dbFile)) {
      const defaultData = getDefaultData();
      fs.writeFileSync(dbFile, JSON.stringify(defaultData, null, 2), "utf-8");
      return defaultData;
    }
    const content = fs.readFileSync(dbFile, "utf-8");
    return JSON.parse(content);
  } catch {
    return getDefaultData();
  }
}

function writeNodeDiskDatabase(data: any) {
  try {
    const nodeRequire = eval("require");
    const fs = nodeRequire("fs");
    const path = nodeRequire("path");
    const dataDir = path.join(process.cwd(), "data");
    const dbFile = path.join(dataDir, "db.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

// GET: Retrieve the complete data store (From Cloudflare KV or Local Disk)
export async function GET() {
  const kv = getCloudflareKv();
  if (kv) {
    try {
      const raw = await kv.get("paramdham_portal_data", "json");
      if (raw && typeof raw === "object") {
        return NextResponse.json(raw, {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
            "Pragma": "no-cache",
            "Expires": "0",
            "Surrogate-Control": "no-store",
          },
        });
      }
    } catch (err) {
      console.warn("[API Data] KV read failed, falling back to disk snapshot:", err);
    }
  }

  const data = readNodeDiskDatabase();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "Surrogate-Control": "no-store",
    },
  });
}

// POST: Update specific key or complete database
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const kv = getCloudflareKv();
    let currentData: any = null;

    if (kv) {
      try {
        currentData = await kv.get("paramdham_portal_data", "json");
      } catch {}
    }
    if (!currentData) {
      currentData = readNodeDiskDatabase();
    }

    let updatedData = { ...currentData };

    if (body.key && body.data !== undefined) {
      updatedData[body.key] = body.data;
    } else if (body.fullData) {
      updatedData = { ...currentData, ...body.fullData };
    } else {
      updatedData = { ...currentData, ...body };
    }

    updatedData.updatedAt = new Date().toISOString();

    // 1. Write to Cloudflare KV if available
    let kvSaved = false;
    if (kv) {
      try {
        await kv.put("paramdham_portal_data", JSON.stringify(updatedData));
        kvSaved = true;
      } catch (kvErr) {
        console.error("[API Data] KV write error:", kvErr);
      }
    }

    // 2. Write to Node Disk if available (localhost)
    const diskSaved = writeNodeDiskDatabase(updatedData);

    return NextResponse.json(
      {
        success: true,
        updatedAt: updatedData.updatedAt,
        data: updatedData,
        storage: { kv: kvSaved, disk: diskSaved },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Pragma": "no-cache",
        },
      }
    );
  } catch (error: any) {
    console.error("[API Data] Error handling POST request:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache",
        },
      }
    );
  }
}
