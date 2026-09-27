import fs from "fs";
import path from "path";
import ws from "ws";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env.local", "utf-8");
let supabaseUrl = "", supabaseKey = "";
for (const line of envContent.split("\n")) {
  if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) supabaseUrl = line.split("=")[1].trim();
  if (line.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) supabaseKey = line.split("=")[1].trim();
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: ws },
});

async function runSweep() {
  console.log("==================================================================");
  console.log("🕉️  COMPREHENSIVE SUPABASE & SYSTEM INTEGRITY AUDIT  🕉️");
  console.log("==================================================================\n");

  const tables = [
    "events",
    "books",
    "dhams",
    "articles",
    "videos",
    "audio_tracks",
    "chitwani_books",
    "chitwani_videos",
    "site_settings",
    "about_content",
    "daily_thought",
  ];

  let allPassed = true;

  for (const table of tables) {
    const { count, data, error } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .limit(3);
    if (error) {
      console.error(`❌ Table "${table}": Error -> ${error.message}`);
      allPassed = false;
    } else {
      console.log(`✅ Table "${table}": ${count} records verified.`);
    }
  }

  // Check Storage Bucket
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  if (bErr) {
    console.error("❌ Storage Buckets Error:", bErr.message);
    allPassed = false;
  } else {
    const hasUploads = buckets.some((b) => b.name === "uploads");
    if (hasUploads) {
      console.log("✅ Supabase Storage bucket 'uploads' is active & accessible.");
    } else {
      console.error("❌ 'uploads' bucket missing!");
      allPassed = false;
    }
  }

  // Check Local db.json integrity
  const dbPath = path.join(process.cwd(), "data", "db.json");
  if (fs.existsSync(dbPath)) {
    const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    const requiredKeys = [
      "books", "events", "dhams", "articles", "videos", "audioTracks",
      "chitwaniBooks", "chitwaniVideos", "settings", "aboutContent",
      "dailyThought", "adminCredentials"
    ];
    let dbOk = true;
    for (const key of requiredKeys) {
      if (db[key] === undefined) {
        console.error(`❌ db.json missing key: ${key}`);
        dbOk = false;
        allPassed = false;
      }
    }
    if (dbOk) {
      console.log("✅ Local fallback database 'data/db.json' has all 12 key entities present.");
    }
  } else {
    console.error("❌ 'data/db.json' not found!");
    allPassed = false;
  }

  console.log("\n==================================================================");
  if (allPassed) {
    console.log("🎉 ALL SYSTEM AUDIT CHECKS PASSED WITH 100% HEALTH! 🎉");
  } else {
    console.log("⚠️ Some audit checks failed. Please review the errors above.");
  }
  console.log("==================================================================");
}

runSweep().catch(console.error);
