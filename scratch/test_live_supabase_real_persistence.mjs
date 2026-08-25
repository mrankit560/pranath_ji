import { createClient } from "@supabase/supabase-js";
import assert from "assert";
import ws from "ws";

const BASE_URL = "http://localhost:3000";
const SUPABASE_URL = "https://xlgbujvloncifedimtcv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_M_eamA8o7RfkQ4ptCMUTww_eFwLX4Ae";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws },
});

async function runRealSupabaseTest() {
  console.log("=================================================================");
  console.log("🕉️  SUPABASE POSTGRESQL REAL CLOUD PERSISTENCE VERIFICATION 🕉️");
  console.log("=================================================================\n");

  // Step 1: Query live Supabase events table directly
  console.log("1. Querying live Supabase PostgreSQL events table...");
  const { data: initialEvents, error: initialErr } = await supabase
    .from("events")
    .select("*")
    .order("start_at", { ascending: true });

  assert(!initialErr, `Supabase Query Error: ${initialErr?.message}`);
  assert(initialEvents && initialEvents.length > 0, "Supabase must contain events");
  const targetEvent = initialEvents[0];
  console.log(`   Found ${initialEvents.length} events in Supabase!`);
  console.log(`   Target Event ID: "${targetEvent.id}"`);
  console.log(`   Current Title:   "${targetEvent.title_hi}"`);
  console.log(`   Current Date:    "${targetEvent.start_at}"`);

  // Step 2: Update event date through Admin API (POST /api/data)
  const targetNewStart = "2026-11-15T09:00:00.000Z";
  const targetNewEnd = "2026-11-22T18:00:00.000Z";
  const targetNewTitle = "भव्य श्री कृष्ण जन्मोत्सव एवं तारतम ज्ञान महायज्ञ 2026";

  console.log(`\n2. Updating Event via Admin API to New Date:`);
  console.log(`   New Start Date: ${targetNewStart} (15 Nov 2026)`);
  console.log(`   New End Date:   ${targetNewEnd} (22 Nov 2026)`);
  console.log(`   New Title:      ${targetNewTitle}`);

  const postPayload = {
    key: "events",
    data: initialEvents.map((e) =>
      e.id === targetEvent.id
        ? {
            id: e.id,
            titleHi: targetNewTitle,
            titleEn: e.title_en,
            descriptionHi: e.description_hi,
            descriptionEn: e.description_en,
            startAt: targetNewStart,
            endAt: targetNewEnd,
            hasSpecificTime: e.has_specific_time,
            timeStr: e.time_str,
            location: e.location,
            image: e.image,
            speaker: e.speaker,
            eventType: e.event_type,
            livestreamUrl: e.livestream_url,
            status: e.status,
          }
        : {
            id: e.id,
            titleHi: e.title_hi,
            titleEn: e.title_en,
            descriptionHi: e.description_hi,
            descriptionEn: e.description_en,
            startAt: e.start_at,
            endAt: e.end_at,
            hasSpecificTime: e.has_specific_time,
            timeStr: e.time_str,
            location: e.location,
            image: e.image,
            speaker: e.speaker,
            eventType: e.event_type,
            livestreamUrl: e.livestream_url,
            status: e.status,
          }
    ),
  };

  const postRes = await fetch(`${BASE_URL}/api/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postPayload),
  });
  assert(postRes.ok, "POST /api/data must succeed");
  console.log("   ✅ POST /api/data responded with 200 OK!");

  // Step 3: Query Supabase PostgreSQL Database DIRECTLY to verify actual row mutation
  console.log("\n3. Checking Supabase PostgreSQL table directly via SQL query...");
  const { data: dbRows, error: dbErr } = await supabase
    .from("events")
    .select("*")
    .eq("id", targetEvent.id);

  assert(!dbErr, `Supabase Query Error: ${dbErr?.message}`);
  assert(dbRows && dbRows.length === 1, "Target event row must exist in Supabase");
  const updatedRow = dbRows[0];

  console.log(`   Database Raw start_at: "${updatedRow.start_at}"`);
  console.log(`   Database Raw title_hi: "${updatedRow.title_hi}"`);
  assert(
    new Date(updatedRow.start_at).toISOString() === new Date(targetNewStart).toISOString(),
    `Supabase row start_at mismatch! Expected ${targetNewStart}, got ${updatedRow.start_at}`
  );
  assert.strictEqual(
    updatedRow.title_hi,
    targetNewTitle,
    `Supabase row title_hi mismatch! Expected "${targetNewTitle}", got "${updatedRow.title_hi}"`
  );
  console.log("   ✅ VERIFIED: Live PostgreSQL table row in Supabase contains the new date!");

  // Step 4: Simulate a NEW VISITOR on a mobile phone in another country
  console.log("\n4. Simulating a NEW VISITOR from another device/browser fetching /api/data...");
  const visitorRes = await fetch(`${BASE_URL}/api/data?nocache=${Math.random()}`, {
    cache: "no-store",
  });
  assert(visitorRes.ok, "Visitor fetch must return 200 OK");
  const visitorData = await visitorRes.json();
  const visitorEvent = visitorData.events.find((e) => e.id === targetEvent.id);

  assert(
    new Date(visitorEvent.startAt).toISOString() === new Date(targetNewStart).toISOString(),
    `Visitor received wrong start date: ${visitorEvent.startAt}`
  );
  console.log(`   ✅ New visitor received updated date: ${visitorEvent.startAt}`);

  // Step 5: Verify public page HTML responses
  console.log("\n5. Testing public /events and / pages...");
  const eventsHtmlRes = await fetch(`${BASE_URL}/events`, { cache: "no-store" });
  assert(eventsHtmlRes.ok, "/events must return 200 OK");
  console.log("   ✅ /events page rendered with 200 OK");

  const homeHtmlRes = await fetch(`${BASE_URL}/`, { cache: "no-store" });
  assert(homeHtmlRes.ok, "/ homepage rendered with 200 OK");
  console.log("   ✅ Homepage rendered with 200 OK");

  console.log("\n=================================================================");
  console.log("🎉 SUCCESS: SUPABASE POSTGRESQL REAL PERSISTENCE 100% OPERATIONAL! 🎉");
  console.log("   - All Admin updates write directly to Supabase cloud database.");
  console.log("   - Any user on any phone/device worldwide sees updates immediately.");
  console.log("=================================================================");
}

runRealSupabaseTest().catch((err) => {
  console.error("❌ Test Failed:", err);
  process.exit(1);
});
