import { NextRequest, NextResponse } from "next/server";
import { getCloudflareKV } from "@/lib/cloudflare/bindings";
import { hashPassword, verifyPassword, isHashed } from "@/lib/auth/adminAuth";
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

const KV_STORE_KEY = "paramdham_portal_data";

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

function readDiskDatabase(): any {
  if (typeof window === "undefined") {
    try {
      const nodeRequire = eval("require");
      const fs = nodeRequire("fs");
      const path = nodeRequire("path");
      const dbPath = path.join(process.cwd(), "data", "db.json");
      if (fs.existsSync(dbPath)) {
        const raw = fs.readFileSync(dbPath, "utf-8");
        return JSON.parse(raw);
      }
    } catch {
      // Running in environment without fs
    }
  }
  return getDefaultData();
}

function writeDiskDatabase(data: any): boolean {
  if (typeof window === "undefined") {
    try {
      const nodeRequire = eval("require");
      const fs = nodeRequire("fs");
      const path = nodeRequire("path");
      const dataDir = path.join(process.cwd(), "data");
      const dbPath = path.join(dataDir, "db.json");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch {
      // Ignored if filesystem not writable
    }
  }
  return false;
}

/** Retrieve live data from Cloudflare KV or fallback to disk */
async function loadFullDatabase(): Promise<any> {
  const kv = getCloudflareKV();
  if (kv) {
    try {
      const kvData = await kv.get(KV_STORE_KEY, "json");
      if (kvData && typeof kvData === "object") {
        return kvData;
      }
    } catch (err) {
      console.warn("[API Data] Cloudflare KV read error:", err);
    }
  }

  // Fallback to disk snapshot
  const diskData = readDiskDatabase();

  // If KV is connected but empty, populate it with disk data
  if (kv && diskData) {
    try {
      await kv.put(KV_STORE_KEY, JSON.stringify(diskData));
    } catch (err) {
      console.warn("[API Data] Cloudflare KV initial seed error:", err);
    }
  }

  return diskData;
}

/** Save database changes to Cloudflare KV and local disk */
async function saveFullDatabase(data: any): Promise<boolean> {
  const kv = getCloudflareKV();
  let savedToKv = false;

  if (kv) {
    try {
      await kv.put(KV_STORE_KEY, JSON.stringify(data));
      savedToKv = true;
    } catch (err) {
      console.error("[API Data] Cloudflare KV write error:", err);
    }
  }

  writeDiskDatabase(data);
  return savedToKv;
}

/** Read admin credentials safely (server-side only) */
function getExpectedAdmin(fullData: any): { username: string; email: string; password: string } {
  // 1. Preferred in production: environment secret ADMIN_PASSWORD_HASH
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (envHash) {
    return {
      username: process.env.ADMIN_USERNAME || "admin",
      email: process.env.ADMIN_EMAIL || "admin@sadhaulidham.com",
      password: envHash,
    };
  }

  // 2. Stored in KV / disk database
  if (fullData?.adminCredentials?.password) {
    return {
      username: fullData.adminCredentials.username || "admin",
      email: fullData.adminCredentials.email || "admin@sadhaulidham.com",
      password: fullData.adminCredentials.password,
    };
  }

  // 3. Fallback default
  return {
    username: "admin",
    email: "admin@sadhaulidham.com",
    password: "admin123",
  };
}

// GET: Retrieve complete dataset from Cloudflare KV or Local Disk
export async function GET() {
  try {
    const fullData = await loadFullDatabase();

    // Prepare safe public payload (never send admin password over wire)
    const admin = getExpectedAdmin(fullData);
    const { adminCredentials, ...publicData } = fullData || {};

    const responsePayload = {
      ...publicData,
      adminProfile: {
        username: admin.username,
        email: admin.email,
        updatedAt: fullData?.adminCredentials?.updatedAt || new Date().toISOString(),
      },
      updatedAt: fullData?.updatedAt || new Date().toISOString(),
    };

    return NextResponse.json(responsePayload, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
        "Pragma": "no-cache",
        "Expires": "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("[API Data GET Error]:", error);
    const fallback = getDefaultData();
    const { adminCredentials, ...safeFallback } = fallback;
    return NextResponse.json(
      {
        ...safeFallback,
        adminProfile: {
          username: "admin",
          email: "admin@sadhaulidham.com",
          updatedAt: new Date().toISOString(),
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}

// POST: Handle admin login verification or update dataset
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, data } = body;

    const fullData = await loadFullDatabase();

    // 1. Admin login verification
    if (key === "verifyAdmin" && data) {
      const stored = getExpectedAdmin(fullData);
      const identifier = String(data.user || "").trim().toLowerCase();
      const identifierOk =
        identifier === String(stored.username).toLowerCase() ||
        identifier === String(stored.email).toLowerCase();

      const { ok, needsUpgrade } = await verifyPassword(String(data.pass || ""), stored.password);
      const success = identifierOk && ok;

      // Transparently upgrade legacy plaintext password to PBKDF2 hash
      if (success && needsUpgrade && fullData) {
        try {
          const newHash = await hashPassword(String(data.pass || ""));
          fullData.adminCredentials = {
            ...fullData.adminCredentials,
            password: newHash,
            updatedAt: new Date().toISOString(),
          };
          await saveFullDatabase(fullData);
        } catch (upgradeErr) {
          console.warn("[Admin Auth] Password hash migration failed:", upgradeErr);
        }
      }

      return NextResponse.json({ ok: success }, { status: 200 });
    }

    // 2. Update Admin Credentials
    if (key === "adminCredentials" && data) {
      let passwordToSave = data.password;
      if (passwordToSave && !isHashed(passwordToSave)) {
        passwordToSave = await hashPassword(passwordToSave);
      } else if (!passwordToSave) {
        passwordToSave = fullData?.adminCredentials?.password || (await hashPassword("admin123"));
      }

      fullData.adminCredentials = {
        username: data.username || fullData?.adminCredentials?.username || "admin",
        email: data.email || fullData?.adminCredentials?.email || "admin@sadhaulidham.com",
        password: passwordToSave,
        updatedAt: new Date().toISOString(),
      };
      fullData.updatedAt = new Date().toISOString();

      await saveFullDatabase(fullData);
      return NextResponse.json({ success: true, updatedAt: fullData.updatedAt });
    }

    // 3. Update specific key or collection (events, books, dhams, articles, etc.)
    if (key && data !== undefined) {
      fullData[key] = data;
    } else if (body.fullData) {
      Object.assign(fullData, body.fullData);
    } else {
      Object.assign(fullData, body);
    }

    fullData.updatedAt = new Date().toISOString();
    await saveFullDatabase(fullData);

    return NextResponse.json(
      {
        success: true,
        updatedAt: fullData.updatedAt,
        data: fullData,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Pragma": "no-cache",
        },
      }
    );
  } catch (error: any) {
    console.error("[API Data POST Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
