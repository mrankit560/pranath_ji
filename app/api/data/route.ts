import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

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

function readDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const defaultData = getDefaultData();
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
      return defaultData;
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("[API Data] Failed to read database, returning defaults:", error);
    return getDefaultData();
  }
}

function writeDatabase(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("[API Data] Failed to write database:", error);
    return false;
  }
}

// GET: Retrieve the complete data store
export async function GET() {
  const data = readDatabase();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}

// POST: Update specific key or complete database
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const currentData = readDatabase();

    let updatedData = { ...currentData };

    if (body.key && body.data !== undefined) {
      // Partial key update (e.g. { key: "events", data: [...] })
      updatedData[body.key] = body.data;
    } else if (body.fullData) {
      // Full database replacement
      updatedData = { ...currentData, ...body.fullData };
    } else {
      // Direct merge of passed fields
      updatedData = { ...currentData, ...body };
    }

    updatedData.updatedAt = new Date().toISOString();

    const success = writeDatabase(updatedData);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to persist data to server disk" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      updatedAt: updatedData.updatedAt,
      data: updatedData,
    });
  } catch (error: any) {
    console.error("[API Data] Error handling POST request:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
