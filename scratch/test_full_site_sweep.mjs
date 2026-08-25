import assert from "assert";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";
const DB_PATH = path.join(process.cwd(), "data", "db.json");

const results = [];

async function recordTest(moduleName, operation, testFn) {
  try {
    await testFn();
    results.push({ module: moduleName, operation, status: "PASS", error: null });
    console.log(`  ✅ [${moduleName}] ${operation}: PASS`);
  } catch (err) {
    results.push({ module: moduleName, operation, status: "FAIL", error: err.message });
    console.error(`  ❌ [${moduleName}] ${operation}: FAIL ->`, err.message);
  }
}

async function runFullSweep() {
  console.log("=================================================================");
  console.log("🕉️  FULL SITE & ADMIN CMS EXHAUSTIVE CRUD & PERSISTENCE SWEEP 🕉️");
  console.log("=================================================================\n");

  // MODULE 1: EVENTS
  console.log("--- 1. MODULE: EVENTS & UTSAV MANAGEMENT ---");
  let testEventId = `test-event-${Date.now()}`;
  await recordTest("Events", "Create Event", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const newEvent = {
      id: testEventId,
      titleHi: "परीक्षण महोत्सव",
      titleEn: "Test Festival",
      descriptionHi: "परीक्षण विवरण",
      descriptionEn: "Test Description",
      startAt: "2026-11-15T09:00:00.000Z",
      endAt: "2026-11-20T18:00:00.000Z",
      hasSpecificTime: true,
      timeStr: "09:00 AM – 06:00 PM IST",
      location: "साढौली धाम, हरिद्वार",
      image: "/assets/hero-reference-1.jpg",
      speaker: "पूज्य संत वृंद",
      eventType: "festival",
      status: "upcoming",
    };
    const updatedEvents = [...data.events, newEvent];
    const postRes = await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "events", data: updatedEvents }),
    });
    assert(postRes.ok, "POST /api/data must succeed");
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    const saved = disk.events.find((e) => e.id === testEventId);
    assert(saved && saved.startAt === "2026-11-15T09:00:00.000Z", "Event must exist on disk with correct date");
  });

  await recordTest("Events", "Edit Date & Verify Refresh Persistence", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const updated = data.events.map((e) =>
      e.id === testEventId ? { ...e, startAt: "2026-12-25T09:00:00.000Z", titleHi: "अद्यतन परीक्षण महोत्सव" } : e
    );
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "events", data: updated }),
    });
    // 3 Refreshes
    for (let i = 1; i <= 3; i++) {
      const ref = await fetch(`${BASE_URL}/api/data?t=${Date.now()}&r=${Math.random()}`);
      const d = await ref.json();
      const ev = d.events.find((e) => e.id === testEventId);
      assert(ev && ev.startAt === "2026-12-25T09:00:00.000Z", `Refresh #${i} must retain new date`);
    }
  });

  await recordTest("Events", "Delete Event & Verify Disk Cleanup", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const filtered = data.events.filter((e) => e.id !== testEventId);
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "events", data: filtered }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert(!disk.events.some((e) => e.id === testEventId), "Deleted event must not exist in disk db.json");
  });

  // MODULE 2: BOOKS
  console.log("\n--- 2. MODULE: SCRIPTURES & PDF LIBRARY BOOKS ---");
  let testBookId = `test-book-${Date.now()}`;
  await recordTest("Books", "Create Book", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const newBook = {
      id: testBookId,
      titleHi: "परीक्षण ग्रन्थ",
      titleEn: "Test Scripture",
      authorHi: "साढौली धाम",
      authorEn: "Sadhauli Dham",
      descriptionHi: "विवरण",
      descriptionEn: "Description",
      category: "tartam_vani",
      language: "hi",
      coverUrl: "/assets/logo-emblem.png",
      pdfUrl: "/assets/shri-bitak-saheb.pdf",
      pages: 100,
      featured: true,
      published: true,
      createdAt: "2026-08-25",
      updatedAt: "2026-08-25",
    };
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "books", data: [...data.books, newBook] }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert(disk.books.some((b) => b.id === testBookId), "Book must be on disk");
  });

  await recordTest("Books", "Delete Book", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const filtered = data.books.filter((b) => b.id !== testBookId);
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "books", data: filtered }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert(!disk.books.some((b) => b.id === testBookId), "Deleted book must not exist on disk");
  });

  // MODULE 3: HOLY DHAMS
  console.log("\n--- 3. MODULE: HOLY DHAMS & ASHRAM LOCATIONS ---");
  let testDhamId = `test-dham-${Date.now()}`;
  await recordTest("Dhams", "Create Dham", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const newDham = {
      id: testDhamId,
      nameHi: "परीक्षण पावन धाम",
      nameEn: "Test Holy Dham",
      descriptionHi: "विवरण",
      descriptionEn: "Description",
      location: "पन्ना, मध्य प्रदेश",
      mapUrl: "https://maps.app.goo.gl/test",
      imageUrl: "/assets/sadhauli-dham-1.jpg",
      images: ["/assets/sadhauli-dham-1.jpg"],
      phone: "+91 99271 97390",
      order: 10,
      featured: true,
    };
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "dhams", data: [...data.dhams, newDham] }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert(disk.dhams.some((d) => d.id === testDhamId), "Dham must exist on disk");
  });

  await recordTest("Dhams", "Delete Dham", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const filtered = data.dhams.filter((d) => d.id !== testDhamId);
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "dhams", data: filtered }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert(!disk.dhams.some((d) => d.id === testDhamId), "Deleted dham must not exist on disk");
  });

  // MODULE 4: ARTICLES
  console.log("\n--- 4. MODULE: SPIRITUAL ARTICLES & BLOGS ---");
  let testArtId = `test-art-${Date.now()}`;
  await recordTest("Articles", "Create Article", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const newArt = {
      id: testArtId,
      titleHi: "परीक्षण लेख",
      titleEn: "Test Article",
      contentHi: "सामग्री",
      contentEn: "Content",
      slug: `test-slug-${Date.now()}`,
      featuredImage: "/assets/hero-reference-1.jpg",
      author: "साढौली धाम",
      category: "prannath-ji",
      tags: ["परीक्षण"],
      status: "published",
      publishedAt: "2026-08-25",
    };
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "articles", data: [...data.articles, newArt] }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert(disk.articles.some((a) => a.id === testArtId), "Article must exist on disk");
  });

  await recordTest("Articles", "Delete Article", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const filtered = data.articles.filter((a) => a.id !== testArtId);
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "articles", data: filtered }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert(!disk.articles.some((a) => a.id === testArtId), "Deleted article must not exist on disk");
  });

  // MODULE 5: VIDEOS & DISCOURSES
  console.log("\n--- 5. MODULE: VIDEOS & SATSANG DISCOURSES ---");
  let testVidId = `test-vid-${Date.now()}`;
  await recordTest("Videos", "Create Video", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const newVid = {
      id: testVidId,
      youtubeId: "dQw4w9WgXcQ",
      titleHi: "परीक्षण वीडियो",
      titleEn: "Test Video",
      descriptionHi: "विवरण",
      descriptionEn: "Description",
      category: "satsang",
      speaker: "संत वृंद",
      duration: "30:00",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      featured: true,
      published: true,
      isLive: false,
      publishedAt: "2026-08-25",
    };
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "videos", data: [...data.videos, newVid] }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert(disk.videos.some((v) => v.id === testVidId), "Video must exist on disk");
  });

  await recordTest("Videos", "Delete Video", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const filtered = data.videos.filter((v) => v.id !== testVidId);
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "videos", data: filtered }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert(!disk.videos.some((v) => v.id === testVidId), "Deleted video must not exist on disk");
  });

  // MODULE 6: AUDIO & AARTI TRACKS
  console.log("\n--- 6. MODULE: DEVOTIONAL AUDIO & AARTI TRACKS ---");
  let testAudioId = `test-audio-${Date.now()}`;
  await recordTest("Audio", "Create Audio Track", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const newAudio = {
      id: testAudioId,
      titleHi: "परीक्षण आरती",
      titleEn: "Test Aarti",
      audioUrl: "https://actions.google.com/sounds/v1/ambiences/temple_bell_loop.ogg",
      coverUrl: "/assets/logo-emblem.png",
      category: "aarti",
      speaker: "आश्रम वृंद",
      duration: "05:00",
      order: 10,
      published: true,
    };
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "audioTracks", data: [...data.audioTracks, newAudio] }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert(disk.audioTracks.some((a) => a.id === testAudioId), "Audio track must exist on disk");
  });

  await recordTest("Audio", "Delete Audio Track", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const filtered = data.audioTracks.filter((a) => a.id !== testAudioId);
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "audioTracks", data: filtered }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert(!disk.audioTracks.some((a) => a.id === testAudioId), "Deleted audio must not exist on disk");
  });

  // MODULE 7: SETTINGS & ABOUT US CONTENT
  console.log("\n--- 7. MODULE: PORTAL SETTINGS & ABOUT US CONTENT ---");
  await recordTest("Settings", "Update Site Phone and Verify Disk", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const updatedSettings = { ...data.settings, phone: "+91 99271 97390" };
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "settings", data: updatedSettings }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    assert.strictEqual(disk.settings.phone, "+91 99271 97390", "Settings phone must update on disk");
  });

  // BILINGUAL FIELD ISOLATION TEST
  console.log("\n--- 8. BILINGUAL FIELD ISOLATION TEST ---");
  await recordTest("Bilingual", "Hindi edit preserves English and vice versa", async () => {
    const getRes = await fetch(`${BASE_URL}/api/data?t=${Date.now()}`);
    const data = await getRes.json();
    const firstEvent = data.events[0];
    const originalEn = firstEvent.titleEn;
    const modifiedEvents = data.events.map((e) =>
      e.id === firstEvent.id ? { ...e, titleHi: `${firstEvent.titleHi} (द्विभाषी टेस्ट)` } : e
    );
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "events", data: modifiedEvents }),
    });
    const disk = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    const updated = disk.events.find((e) => e.id === firstEvent.id);
    assert.strictEqual(updated.titleEn, originalEn, "English title must remain untouched when Hindi is edited");
    // Restore
    const restoredEvents = data.events.map((e) =>
      e.id === firstEvent.id ? { ...e, titleHi: firstEvent.titleHi } : e
    );
    await fetch(`${BASE_URL}/api/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "events", data: restoredEvents }),
    });
  });

  console.log("\n=================================================================");
  console.log(`🏁 FULL SWEEP SUMMARY: ${results.filter((r) => r.status === "PASS").length} PASSED, ${results.filter((r) => r.status === "FAIL").length} FAILED`);
  console.log("=================================================================");

  const failures = results.filter((r) => r.status === "FAIL");
  if (failures.length > 0) {
    process.exit(1);
  }
}

runFullSweep().catch((err) => {
  console.error("Fatal Sweep Error:", err);
  process.exit(1);
});
