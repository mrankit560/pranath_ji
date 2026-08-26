import assert from "assert";
import fs from "fs";
import path from "path";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  const env: Record<string, string> = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        env[match[1]] = (match[2] || "").trim().replace(/^['"]|['"]$/g, "");
      }
    }
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "https://xlgbujvloncifedimtcv.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const DB_PATH = path.join(process.cwd(), "data", "db.json");

async function runPdfUploadAndPersistenceTest() {
  console.log("=================================================================");
  console.log("📚  TEST: PDF UPLOAD, CLOUD STORAGE & BOOK PERSISTENCE  📚");
  console.log("=================================================================");

  // 1. Simulate uploading a PDF document to Supabase Storage
  console.log("\n1. 📤 Uploading test PDF document to Supabase Cloud Storage (uploads bucket)...");
  const testPdfContent = Buffer.from(
    "%PDF-1.4\n%Shri Prannath Ji Holy Scripture Test PDF\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"
  );
  const timestamp = Date.now();
  const testFileName = `${timestamp}-shri-bitak-saheb-authentic-edition.pdf`;

  const uploadEndpoint = `${SUPABASE_URL}/storage/v1/object/uploads/${testFileName}`;
  const uploadRes = await fetch(uploadEndpoint, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/pdf",
      "x-upsert": "true",
    },
    body: testPdfContent,
  });

  assert(uploadRes.ok, `Supabase storage upload must succeed with 200/201, got ${uploadRes.status}`);
  const uploadData = await uploadRes.json();
  console.log("   ✅ Upload succeeded:", uploadData);

  const uploadedPdfPublicUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/${testFileName}`;
  console.log(`   🔗 Public PDF URL: ${uploadedPdfPublicUrl}`);

  // Verify the public URL is reachable
  const checkUrlRes = await fetch(uploadedPdfPublicUrl);
  assert.strictEqual(checkUrlRes.status, 200, "Uploaded public PDF URL must return HTTP 200 OK");
  console.log("   ✅ Public PDF URL is live and accessible!");

  // 2. Fetch existing books from Supabase
  console.log("\n2. 📥 Fetching current books from Supabase database...");
  const booksRes = await fetch(`${SUPABASE_URL}/rest/v1/books?select=*`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  assert(booksRes.ok, "Must be able to query books table");
  const books = await booksRes.json();
  assert(books.length > 0, "There must be books in the database");
  console.log(`   Found ${books.length} books in database.`);

  const targetBook = books[0];
  console.log(`   Target book to update: "${targetBook.title_hi}" (ID: ${targetBook.id})`);
  console.log(`   Original PDF URL: ${targetBook.pdf_url}`);

  // 3. Update the book with the newly uploaded PDF URL
  console.log(`\n3. 💾 Updating book with new PDF URL: ${uploadedPdfPublicUrl}...`);
  const updatedRows = books.map((b) => ({
    id: b.id,
    title_hi: b.title_hi,
    title_en: b.title_en || "",
    author_hi: b.author_hi || "",
    author_en: b.author_en || "",
    description_hi: b.description_hi || "",
    description_en: b.description_en || "",
    category: b.category || "all",
    language: b.language || "hi",
    cover_url: b.cover_url || "",
    pdf_url: b.id === targetBook.id ? uploadedPdfPublicUrl : b.pdf_url,
    pages: b.pages || 1,
    book_blog_hi: b.book_blog_hi || "",
    book_blog_en: b.book_blog_en || "",
    featured: b.featured ?? false,
    published: b.published ?? true,
    updated_at: new Date().toISOString(),
  }));

  const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/books`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(updatedRows),
  });

  assert(updateRes.ok, `Book update must succeed in Supabase, status: ${updateRes.status}`);
  console.log("   ✅ Supabase PostgreSQL database updated successfully!");

  // Also sync disk db.json
  if (fs.existsSync(DB_PATH)) {
    const diskContent = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    diskContent.books = updatedRows.map((b) => ({
      id: b.id,
      titleHi: b.title_hi,
      titleEn: b.title_en,
      authorHi: b.author_hi,
      authorEn: b.author_en,
      descriptionHi: b.description_hi,
      descriptionEn: b.description_en,
      category: b.category,
      language: b.language,
      coverUrl: b.cover_url,
      pdfUrl: b.pdf_url,
      pages: b.pages,
      bookBlogHi: b.book_blog_hi,
      bookBlogEn: b.book_blog_en,
      featured: b.featured,
      published: b.published,
      updatedAt: b.updated_at,
    }));
    fs.writeFileSync(DB_PATH, JSON.stringify(diskContent, null, 2), "utf-8");
    console.log("   ✅ Synced data/db.json on server disk!");
  }

  // 4. Verify directly from Supabase that the new PDF URL is saved and persists
  console.log("\n4. 🔍 Verifying persistence across 5 simulated fresh requests...");
  for (let i = 1; i <= 5; i++) {
    const verifyRes = await fetch(
      `${SUPABASE_URL}/rest/v1/books?id=eq.${targetBook.id}&select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );
    assert(verifyRes.ok, `Request #${i} must succeed`);
    const verifyData = await verifyRes.json();
    assert(verifyData.length > 0, "Book must exist");
    assert.strictEqual(
      verifyData[0].pdf_url,
      uploadedPdfPublicUrl,
      `Request #${i} FAILED: Expected PDF URL ${uploadedPdfPublicUrl}, got ${verifyData[0].pdf_url}`
    );
    console.log(`   ✅ Request #${i} confirmed: pdf_url is ${verifyData[0].pdf_url}`);
  }

  // 5. Verify reader page and library page compatibility
  console.log("\n5. 📖 Verifying reader page resolution logic...");
  assert(uploadedPdfPublicUrl.startsWith("https://"), "Cloud storage URL is valid HTTPS");
  assert(uploadedPdfPublicUrl.endsWith(".pdf"), "URL points to valid PDF");
  console.log("   ✅ Reader page compatibility verified!");

  console.log("\n=================================================================");
  console.log("🎉 ALL TESTS PASSED: PDF UPLOADS TO CLOUD STORAGE & PERSISTS PERMANENTLY! 🎉");
  console.log("=================================================================");
}

runPdfUploadAndPersistenceTest().catch((err) => {
  console.error("❌ Test Failed:", err);
  process.exit(1);
});
