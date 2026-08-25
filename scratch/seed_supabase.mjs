import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import ws from "ws";

// Read .env.local manually
const envPath = path.join(process.cwd(), ".env.local");
let supabaseUrl = "";
let supabaseAnonKey = "";

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
      supabaseUrl = trimmed.split("=")[1]?.trim();
    }
    if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=") || trimmed.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) {
      supabaseAnonKey = trimmed.split("=")[1]?.trim();
    }
  }
}

console.log("Connecting to Supabase URL:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  realtime: { transport: ws },
});

const dbPath = path.join(process.cwd(), "data", "db.json");

async function seedSupabase() {
  console.log("=================================================");
  console.log("🕉️  SEEDING SUPABASE POSTGRESQL DATABASE 🕉️");
  console.log("=================================================\n");

  const rawData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  // 1. Seed Events
  console.log(`1. Seeding ${rawData.events.length} Events...`);
  const eventRows = rawData.events.map((e) => ({
    id: e.id,
    title_hi: e.titleHi,
    title_en: e.titleEn || "",
    description_hi: e.descriptionHi || "",
    description_en: e.descriptionEn || "",
    start_at: e.startAt,
    end_at: e.endAt || null,
    has_specific_time: e.hasSpecificTime ?? true,
    time_str: e.timeStr || "",
    location: e.location || "",
    image: e.image || "",
    speaker: e.speaker || "",
    event_type: e.eventType || "festival",
    livestream_url: e.livestreamUrl || "",
    status: e.status || "upcoming",
  }));
  const { error: eventErr } = await supabase.from("events").upsert(eventRows);
  if (eventErr) console.error("   ❌ Events Error:", eventErr.message);
  else console.log("   ✅ Events seeded successfully.");

  // 2. Seed Books
  console.log(`2. Seeding ${rawData.books.length} Books...`);
  const bookRows = rawData.books.map((b) => ({
    id: b.id,
    title_hi: b.titleHi,
    title_en: b.titleEn || "",
    author_hi: b.authorHi || "",
    author_en: b.authorEn || "",
    description_hi: b.descriptionHi || "",
    description_en: b.descriptionEn || "",
    category: b.category || "all",
    language: b.language || "hi",
    cover_url: b.coverUrl || "",
    pdf_url: b.pdfUrl || "",
    pages: b.pages || 1,
    book_blog_hi: b.bookBlogHi || "",
    book_blog_en: b.bookBlogEn || "",
    featured: b.featured ?? false,
    published: b.published ?? true,
  }));
  const { error: bookErr } = await supabase.from("books").upsert(bookRows);
  if (bookErr) console.error("   ❌ Books Error:", bookErr.message);
  else console.log("   ✅ Books seeded successfully.");

  // 3. Seed Dhams
  console.log(`3. Seeding ${rawData.dhams.length} Holy Dhams...`);
  const dhamRows = rawData.dhams.map((d) => ({
    id: d.id,
    name_hi: d.nameHi,
    name_en: d.nameEn || "",
    description_hi: d.descriptionHi || "",
    description_en: d.descriptionEn || "",
    location: d.location || "",
    map_url: d.mapUrl || "",
    image_url: d.imageUrl || "",
    images: d.images || [],
    phone: d.phone || "",
    order_num: d.order || 0,
    featured: d.featured ?? true,
  }));
  const { error: dhamErr } = await supabase.from("dhams").upsert(dhamRows);
  if (dhamErr) console.error("   ❌ Dhams Error:", dhamErr.message);
  else console.log("   ✅ Dhams seeded successfully.");

  // 4. Seed Articles
  console.log(`4. Seeding ${rawData.articles.length} Articles...`);
  const articleRows = rawData.articles.map((a) => ({
    id: a.id,
    title_hi: a.titleHi,
    title_en: a.titleEn || "",
    content_hi: a.contentHi,
    content_en: a.contentEn || "",
    summary_hi: a.summaryHi || "",
    summary_en: a.summaryEn || "",
    slug: a.slug,
    featured_image: a.featuredImage || "",
    author: a.author || "",
    category: a.category || "prannath-ji",
    tags: a.tags || [],
    read_time: a.readTime || "5 min read",
    status: a.status || "published",
    published_at: a.publishedAt ? new Date(a.publishedAt).toISOString() : new Date().toISOString(),
  }));
  const { error: artErr } = await supabase.from("articles").upsert(articleRows);
  if (artErr) console.error("   ❌ Articles Error:", artErr.message);
  else console.log("   ✅ Articles seeded successfully.");

  // 5. Seed Videos
  console.log(`5. Seeding ${rawData.videos.length} Videos...`);
  const videoRows = rawData.videos.map((v) => ({
    id: v.id,
    youtube_id: v.youtubeId,
    title_hi: v.titleHi,
    title_en: v.titleEn || "",
    description_hi: v.descriptionHi || "",
    description_en: v.descriptionEn || "",
    category: v.category || "satsang",
    speaker: v.speaker || "",
    duration: v.duration || "",
    thumbnail: v.thumbnail || "",
    featured: v.featured ?? false,
    published: v.published ?? true,
    is_live: v.isLive ?? false,
  }));
  const { error: vidErr } = await supabase.from("videos").upsert(videoRows);
  if (vidErr) console.error("   ❌ Videos Error:", vidErr.message);
  else console.log("   ✅ Videos seeded successfully.");

  // 6. Seed Audio Tracks
  console.log(`6. Seeding ${rawData.audioTracks.length} Audio Tracks...`);
  const audioRows = rawData.audioTracks.map((au) => ({
    id: au.id,
    title_hi: au.titleHi,
    title_en: au.titleEn || "",
    audio_url: au.audioUrl,
    cover_url: au.coverUrl || "",
    category: au.category || "aarti",
    speaker: au.speaker || "",
    duration: au.duration || "",
    order_num: au.order || 0,
    published: au.published ?? true,
  }));
  const { error: audioErr } = await supabase.from("audio_tracks").upsert(audioRows);
  if (audioErr) console.error("   ❌ Audio Error:", audioErr.message);
  else console.log("   ✅ Audio seeded successfully.");

  // 7. Seed Settings & About & Thought
  console.log("7. Seeding Settings, About Content & Daily Thought...");
  const { error: setErr } = await supabase.from("site_settings").upsert({
    id: "primary",
    phone: rawData.settings.phone || "",
    email: rawData.settings.email || "",
    address_hi: rawData.settings.addressHi || "",
    address_en: rawData.settings.addressEn || "",
    google_maps_url: rawData.settings.googleMapsUrl || "",
    youtube_url: rawData.settings.youtubeUrl || "",
    facebook_url: rawData.settings.facebookUrl || "",
    instagram_url: rawData.settings.instagramUrl || "",
    whatsapp_url: rawData.settings.whatsappUrl || "",
  });
  if (setErr) console.error("   ❌ Settings Error:", setErr.message);
  else console.log("   ✅ Settings seeded.");

  const { error: abtErr } = await supabase.from("about_content").upsert({
    id: "primary",
    data: rawData.aboutContent,
  });
  if (abtErr) console.error("   ❌ About Error:", abtErr.message);
  else console.log("   ✅ About content seeded.");

  const { error: thErr } = await supabase.from("daily_thought").upsert({
    id: "primary",
    quote_hi: rawData.dailyThought.quoteHi,
    quote_en: rawData.dailyThought.quoteEn,
    author_hi: rawData.dailyThought.authorHi,
    author_en: rawData.dailyThought.authorEn,
    source_hi: rawData.dailyThought.sourceHi,
    source_en: rawData.dailyThought.sourceEn,
    date: rawData.dailyThought.date,
  });
  if (thErr) console.error("   ❌ Thought Error:", thErr.message);
  else console.log("   ✅ Daily thought seeded.");

  console.log("\n=================================================");
  console.log("🎉 ALL PORTAL DATA SUCCESSFULLY SEEDED TO SUPABASE! 🎉");
  console.log("=================================================");
}

seedSupabase().catch((err) => console.error("Seed error:", err));
