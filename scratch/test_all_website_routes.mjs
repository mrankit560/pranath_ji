import assert from "assert";

const BASE_URL = "http://localhost:3000";

const routesToTest = [
  { path: "/", name: "Homepage" },
  { path: "/about", name: "About Sadhauli Dham & Mission" },
  { path: "/prannath-ji", name: "Mahamati Prannath Ji Biography" },
  { path: "/philosophy", name: "Spiritual Philosophy" },
  { path: "/adhyatmik-gyan", name: "Adhyatmik Gyan & Teachings" },
  { path: "/library", name: "Digital Scripture Library" },
  { path: "/library/tartam-vani", name: "Tartam Vani 14 Granths" },
  { path: "/library/reader/book-bitak-saheb", name: "PDF Scripture Reader" },
  { path: "/events", name: "Events & Utsavs" },
  { path: "/articles", name: "Spiritual Articles & Blog" },
  { path: "/articles/how-to-practice-chitwani-meditation", name: "Article Detail View" },
  { path: "/meditation", name: "Chitwani 24 Pakshas Meditation" },
  { path: "/media", name: "Video Satsang & Audio Bhajans" },
  { path: "/contact", name: "Contact & Ashram Location" },
  { path: "/auth/login", name: "Authentication Login" },
  { path: "/dashboard", name: "User Dashboard" },
  { path: "/admin", name: "Admin CMS Dashboard" },
  { path: "/admin/events", name: "Admin Events Management" },
  { path: "/admin/books", name: "Admin Books Management" },
  { path: "/admin/dhams", name: "Admin Dhams Management" },
  { path: "/admin/articles", name: "Admin Articles Management" },
  { path: "/admin/videos", name: "Admin Videos Management" },
  { path: "/admin/audio", name: "Admin Audio Management" },
  { path: "/admin/meditation", name: "Admin Meditation Management" },
  { path: "/admin/prannath-ji", name: "Admin Prannath Ji Content" },
  { path: "/admin/adhyatmik-gyan", name: "Admin Adhyatmik Content" },
  { path: "/admin/about", name: "Admin About Content" },
  { path: "/admin/settings", name: "Admin Portal Settings" },
  { path: "/robots.txt", name: "Robots SEO" },
  { path: "/sitemap.xml", name: "Sitemap SEO" },
  { path: "/api/data", name: "API Data Endpoint", isJson: true },
];

async function testAllRoutes() {
  console.log("=================================================================");
  console.log("🌐  COMPREHENSIVE HTTP AUDIT OF ALL 31 ROUTES & PAGES  🌐");
  console.log("=================================================================\n");

  let passedCount = 0;
  let failedCount = 0;
  const failureDetails = [];

  for (const route of routesToTest) {
    const url = `${BASE_URL}${route.path}`;
    const start = Date.now();
    try {
      const res = await fetch(url, { headers: { "Accept": route.isJson ? "application/json" : "text/html" } });
      const duration = Date.now() - start;

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const bodyText = await res.text();
      if (route.isJson) {
        const json = JSON.parse(bodyText);
        assert(json.books && json.events, "JSON payload missing critical keys");
      } else if (route.path.endsWith(".txt")) {
        assert(bodyText.includes("User-agent") || bodyText.length > 10, "Robots.txt invalid");
      } else {
        assert(bodyText.length > 500, `Page content too small (${bodyText.length} bytes)`);
        assert(!bodyText.includes("Application error: a server-side exception has occurred"), "Server-side exception detected in HTML");
      }

      console.log(`✅ [${res.status}] ${route.name.padEnd(35)} -> ${route.path.padEnd(45)} (${duration}ms, ${bodyText.length} bytes)`);
      passedCount++;
    } catch (err) {
      console.error(`❌ [FAIL] ${route.name.padEnd(35)} -> ${route.path.padEnd(45)}: ${err.message}`);
      failedCount++;
      failureDetails.push({ path: route.path, name: route.name, error: err.message });
    }
  }

  console.log("\n=================================================================");
  console.log(`Audit Finished: ${passedCount} PASSED, ${failedCount} FAILED out of ${routesToTest.length} routes.`);
  console.log("=================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

testAllRoutes().catch((e) => {
  console.error("Audit runner error:", e);
  process.exit(1);
});
