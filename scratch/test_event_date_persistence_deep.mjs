import assert from "assert";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";
const DB_PATH = path.join(process.cwd(), "data", "db.json");

async function runDeepDateTest() {
  console.log("=================================================================");
  console.log("🕉️  DEEP EVENT DATE UPDATE & REFRESH PERSISTENCE TEST 🕉️");
  console.log("=================================================================");

  // 1. Fetch current database state
  const res1 = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`, { cache: "no-store" });
  assert(res1.ok, "API GET /api/data must respond 200 OK");
  const data1 = await res1.json();
  const initialEvent1 = data1.events.find((e) => e.id === "event-1");
  console.log("1. Initial event-1 date:", initialEvent1.startAt);

  // 2. Perform Date Change (e.g. from 2026-09-04 to 2026-11-20)
  const targetNewStart = "2026-11-20T09:00:00.000Z";
  const targetNewEnd = "2026-11-25T18:00:00.000Z";
  const targetNewTitle = "भव्य श्री कृष्ण जन्माष्टमी 2026 (अद्यतन उत्सव)";

  const updatedEvents = data1.events.map((e) =>
    e.id === "event-1"
      ? {
          ...e,
          titleHi: targetNewTitle,
          startAt: targetNewStart,
          endAt: targetNewEnd,
        }
      : e
  );

  console.log(`2. Updating event-1 to new start date: ${targetNewStart}...`);
  const postRes = await fetch(`${BASE_URL}/api/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: "events", data: updatedEvents }),
  });
  assert(postRes.ok, "POST /api/data must succeed");
  const postResult = await postRes.json();
  assert(postResult.success === true, "POST /api/data must return success: true");
  console.log("   ✅ POST /api/data successfully written to server!");

  // 3. Verify directly on server disk in data/db.json
  const diskContent = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  const diskEvent = diskContent.events.find((e) => e.id === "event-1");
  assert.strictEqual(
    diskEvent.startAt,
    targetNewStart,
    `Disk data/db.json must contain new startAt ${targetNewStart}, got ${diskEvent.startAt}`
  );
  assert.strictEqual(
    diskEvent.endAt,
    targetNewEnd,
    `Disk data/db.json must contain new endAt ${targetNewEnd}, got ${diskEvent.endAt}`
  );
  assert.strictEqual(
    diskEvent.titleHi,
    targetNewTitle,
    `Disk data/db.json must contain new title ${targetNewTitle}, got ${diskEvent.titleHi}`
  );
  console.log("3. ✅ Verified on SERVER DISK (data/db.json) - Date is permanently stored!");

  // 4. Simulate Multiple Hard Page Refreshes (SSR & Client Fetching)
  console.log("4. 🔄 Simulating 5 consecutive hard browser refreshes...");
  for (let i = 1; i <= 5; i++) {
    const refreshRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}&r=${Math.random()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
      },
    });
    assert(refreshRes.ok, `Refresh #${i} must succeed`);
    const refreshedData = await refreshRes.json();
    const ev = refreshedData.events.find((e) => e.id === "event-1");

    assert.strictEqual(
      ev.startAt,
      targetNewStart,
      `Refresh #${i} FAILED: Expected startAt ${targetNewStart}, got ${ev.startAt}`
    );
    assert.strictEqual(
      ev.endAt,
      targetNewEnd,
      `Refresh #${i} FAILED: Expected endAt ${targetNewEnd}, got ${ev.endAt}`
    );
    console.log(`   ✅ Refresh #${i} verified: startAt is ${ev.startAt}`);
  }

  // 5. Test Public Events Page & Homepage API Consumers
  console.log("5. Testing public HTML page responses...");
  const publicEventsRes = await fetch(`${BASE_URL}/events`);
  assert(publicEventsRes.ok, "Public /events page must return 200 OK");
  console.log("   ✅ /events page responded with 200 OK");

  const homePageRes = await fetch(`${BASE_URL}/`);
  assert(homePageRes.ok, "Homepage / must return 200 OK");
  console.log("   ✅ Homepage / responded with 200 OK");

  console.log("\n=================================================================");
  console.log("🎉 ALL TESTS PASSED: DATE NEVER REVERTS AND PERSISTS ON DISK! 🎉");
  console.log("=================================================================");
}

runDeepDateTest().catch((err) => {
  console.error("❌ Test Failed:", err);
  process.exit(1);
});
