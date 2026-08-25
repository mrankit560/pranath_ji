import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
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

// Helper to convert snake_case DB row to camelCase EventItem
function mapDbEventToApp(row: any) {
  return {
    id: row.id,
    titleHi: row.title_hi,
    titleEn: row.title_en || "",
    descriptionHi: row.description_hi || "",
    descriptionEn: row.description_en || "",
    startAt: row.start_at,
    endAt: row.end_at || "",
    hasSpecificTime: row.has_specific_time ?? true,
    timeStr: row.time_str || "",
    location: row.location || "",
    image: row.image || "",
    speaker: row.speaker || "",
    eventType: row.event_type || "festival",
    livestreamUrl: row.livestream_url || "",
    status: row.status || "upcoming",
  };
}

// Helper to convert snake_case DB row to camelCase Book
function mapDbBookToApp(row: any) {
  return {
    id: row.id,
    titleHi: row.title_hi,
    titleEn: row.title_en || "",
    authorHi: row.author_hi || "",
    authorEn: row.author_en || "",
    descriptionHi: row.description_hi || "",
    descriptionEn: row.description_en || "",
    category: row.category || "all",
    language: row.language || "hi",
    coverUrl: row.cover_url || "",
    pdfUrl: row.pdf_url || "",
    pages: row.pages || 1,
    bookBlogHi: row.book_blog_hi || "",
    bookBlogEn: row.book_blog_en || "",
    featured: row.featured ?? false,
    published: row.published ?? true,
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : "2026-08-25",
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString().split("T")[0] : "2026-08-25",
  };
}

// Helper to convert snake_case DB row to camelCase Dham
function mapDbDhamToApp(row: any) {
  return {
    id: row.id,
    nameHi: row.name_hi,
    nameEn: row.name_en || "",
    descriptionHi: row.description_hi || "",
    descriptionEn: row.description_en || "",
    location: row.location || "",
    mapUrl: row.map_url || "",
    imageUrl: row.image_url || "",
    images: row.images || [],
    phone: row.phone || "",
    order: row.order_num || 0,
    featured: row.featured ?? true,
  };
}

// Helper to convert snake_case DB row to camelCase Article
function mapDbArticleToApp(row: any) {
  return {
    id: row.id,
    titleHi: row.title_hi,
    titleEn: row.title_en || "",
    contentHi: row.content_hi || "",
    contentEn: row.content_en || "",
    summaryHi: row.summary_hi || "",
    summaryEn: row.summary_en || "",
    slug: row.slug,
    featuredImage: row.featured_image || "",
    author: row.author || "",
    category: row.category || "prannath-ji",
    tags: row.tags || [],
    readTime: row.read_time || "5 min read",
    status: row.status || "published",
    publishedAt: row.published_at ? new Date(row.published_at).toISOString().split("T")[0] : "2026-08-25",
  };
}

// Helper to convert snake_case DB row to camelCase Video
function mapDbVideoToApp(row: any) {
  return {
    id: row.id,
    youtubeId: row.youtube_id,
    titleHi: row.title_hi,
    titleEn: row.title_en || "",
    descriptionHi: row.description_hi || "",
    descriptionEn: row.description_en || "",
    category: row.category || "satsang",
    speaker: row.speaker || "",
    duration: row.duration || "",
    thumbnail: row.thumbnail || "",
    featured: row.featured ?? false,
    published: row.published ?? true,
    isLive: row.is_live ?? false,
    publishedAt: row.published_at ? new Date(row.published_at).toISOString().split("T")[0] : "2026-08-25",
  };
}

// Helper to convert snake_case DB row to camelCase AudioTrack
function mapDbAudioToApp(row: any) {
  return {
    id: row.id,
    titleHi: row.title_hi,
    titleEn: row.title_en || "",
    audioUrl: row.audio_url,
    coverUrl: row.cover_url || "",
    category: row.category || "aarti",
    speaker: row.speaker || "",
    duration: row.duration || "",
    order: row.order_num || 0,
    published: row.published ?? true,
  };
}

// Helper to convert snake_case DB row to camelCase Settings
function mapDbSettingsToApp(row: any) {
  return {
    phone: row.phone || "",
    email: row.email || "",
    addressHi: row.address_hi || "",
    addressEn: row.address_en || "",
    googleMapsUrl: row.google_maps_url || "",
    youtubeUrl: row.youtube_url || "",
    facebookUrl: row.facebook_url || "",
    instagramUrl: row.instagram_url || "",
    whatsappUrl: row.whatsapp_url || "",
  };
}

// GET: Retrieve complete live dataset directly from Supabase PostgreSQL
export async function GET() {
  try {
    const [
      eventsRes,
      booksRes,
      dhamsRes,
      articlesRes,
      videosRes,
      audioRes,
      settingsRes,
      aboutRes,
      thoughtRes,
    ] = await Promise.all([
      supabase.from("events").select("*").order("start_at", { ascending: true }),
      supabase.from("books").select("*"),
      supabase.from("dhams").select("*").order("order_num", { ascending: true }),
      supabase.from("articles").select("*").order("published_at", { ascending: false }),
      supabase.from("videos").select("*").order("created_at", { ascending: false }),
      supabase.from("audio_tracks").select("*").order("order_num", { ascending: true }),
      supabase.from("site_settings").select("*").eq("id", "primary").maybeSingle(),
      supabase.from("about_content").select("*").eq("id", "primary").maybeSingle(),
      supabase.from("daily_thought").select("*").eq("id", "primary").maybeSingle(),
    ]);

    const events = eventsRes.data && eventsRes.data.length > 0 ? eventsRes.data.map(mapDbEventToApp) : initialEvents;
    const books = booksRes.data && booksRes.data.length > 0 ? booksRes.data.map(mapDbBookToApp) : initialBooks;
    const dhams = dhamsRes.data && dhamsRes.data.length > 0 ? dhamsRes.data.map(mapDbDhamToApp) : initialDhams;
    const articles = articlesRes.data && articlesRes.data.length > 0 ? articlesRes.data.map(mapDbArticleToApp) : initialArticles;
    const videos = videosRes.data && videosRes.data.length > 0 ? videosRes.data.map(mapDbVideoToApp) : initialVideos;
    const audioTracks = audioRes.data && audioRes.data.length > 0 ? audioRes.data.map(mapDbAudioToApp) : initialAudioTracks;
    const settings = settingsRes.data ? mapDbSettingsToApp(settingsRes.data) : initialSettings;
    const aboutContent = aboutRes.data?.data || initialAboutContent;
    const dailyThought = thoughtRes.data
      ? {
          id: "primary",
          quoteHi: thoughtRes.data.quote_hi,
          quoteEn: thoughtRes.data.quote_en,
          authorHi: thoughtRes.data.author_hi,
          authorEn: thoughtRes.data.author_en,
          sourceHi: thoughtRes.data.source_hi,
          sourceEn: thoughtRes.data.source_en,
          date: thoughtRes.data.date,
        }
      : initialDailyThought;

    const data = {
      books,
      scriptures: initialScriptures,
      videos,
      audioTracks,
      events,
      articles,
      topics: initialSpiritualTopics,
      dailyThought,
      stats: initialStats,
      settings,
      dhams,
      aboutContent,
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

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
        "Pragma": "no-cache",
        "Expires": "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("[API Supabase Data GET Error]:", error);
    return NextResponse.json(
      {
        books: initialBooks,
        events: initialEvents,
        dhams: initialDhams,
        articles: initialArticles,
        videos: initialVideos,
        audioTracks: initialAudioTracks,
        settings: initialSettings,
        aboutContent: initialAboutContent,
        dailyThought: initialDailyThought,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}

// POST: Write updates directly to Supabase PostgreSQL database
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, data } = body;

    console.log(`[API Supabase POST] Writing key="${key}" to Supabase cloud database...`);

    if (key === "events" && Array.isArray(data)) {
      const rows = data.map((e: any) => ({
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
        updated_at: new Date().toISOString(),
      }));

      // Delete removed rows if any
      const existingIds = rows.map((r: any) => r.id);
      if (existingIds.length > 0) {
        await supabase.from("events").delete().not("id", "in", `(${existingIds.map((id: string) => `"${id}"`).join(",")})`);
      }
      const { error } = await supabase.from("events").upsert(rows);
      if (error) throw error;
    } else if (key === "books" && Array.isArray(data)) {
      const rows = data.map((b: any) => ({
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
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from("books").upsert(rows);
      if (error) throw error;
    } else if (key === "dhams" && Array.isArray(data)) {
      const rows = data.map((d: any) => ({
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
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from("dhams").upsert(rows);
      if (error) throw error;
    } else if (key === "articles" && Array.isArray(data)) {
      const rows = data.map((a: any) => ({
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
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from("articles").upsert(rows);
      if (error) throw error;
    } else if (key === "videos" && Array.isArray(data)) {
      const rows = data.map((v: any) => ({
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
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from("videos").upsert(rows);
      if (error) throw error;
    } else if (key === "audioTracks" && Array.isArray(data)) {
      const rows = data.map((au: any) => ({
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
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from("audio_tracks").upsert(rows);
      if (error) throw error;
    } else if (key === "settings" && data) {
      const { error } = await supabase.from("site_settings").upsert({
        id: "primary",
        phone: data.phone || "",
        email: data.email || "",
        address_hi: data.addressHi || "",
        address_en: data.addressEn || "",
        google_maps_url: data.googleMapsUrl || "",
        youtube_url: data.youtubeUrl || "",
        facebook_url: data.facebookUrl || "",
        instagram_url: data.instagramUrl || "",
        whatsapp_url: data.whatsappUrl || "",
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    } else if (key === "aboutContent" && data) {
      const { error } = await supabase.from("about_content").upsert({
        id: "primary",
        data: data,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    } else if (key === "dailyThought" && data) {
      const { error } = await supabase.from("daily_thought").upsert({
        id: "primary",
        quote_hi: data.quoteHi,
        quote_en: data.quoteEn,
        author_hi: data.authorHi,
        author_en: data.authorEn,
        source_hi: data.sourceHi,
        source_en: data.sourceEn,
        date: data.date,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    }

    return NextResponse.json(
      {
        success: true,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("[API Supabase POST Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to write to Supabase" },
      { status: 500 }
    );
  }
}
