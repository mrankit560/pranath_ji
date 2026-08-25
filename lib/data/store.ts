import {
  Book,
  Scripture,
  Video,
  AudioTrack,
  EventItem,
  Article,
  SpiritualTopic,
  DailyThought,
  PortalStats,
  SiteSettings,
  HolyDham,
  AboutSectionContent,
  ChitwaniBook,
  ChitwaniVideo,
  AdminCredentials,
} from "./types";

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
} from "./seedData";

const defaultAdminCredentials: AdminCredentials = {
  username: "admin",
  email: "admin@sadhaulidham.com",
  password: "admin123",
  updatedAt: new Date().toISOString(),
};

type Listener = () => void;

function getServerDatabaseSnapshot(): any {
  if (typeof window === "undefined") {
    try {
      // Safe Node require that doesn't trigger Webpack bundling in client build
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
  return null;
}

class DataStore {
  private books: Book[] = initialBooks;
  private scriptures: Scripture[] = initialScriptures;
  private videos: Video[] = initialVideos;
  private audioTracks: AudioTrack[] = initialAudioTracks;
  private events: EventItem[] = initialEvents;
  private articles: Article[] = initialArticles;
  private topics: SpiritualTopic[] = initialSpiritualTopics;
  private dailyThought: DailyThought = initialDailyThought;
  private stats: PortalStats = initialStats;
  private settings: SiteSettings = initialSettings;
  private dhams: HolyDham[] = initialDhams;
  private aboutContent: AboutSectionContent = initialAboutContent;
  private chitwaniBooks: ChitwaniBook[] = initialChitwaniBooks;
  private chitwaniVideos: ChitwaniVideo[] = initialChitwaniVideos;
  private adminCredentials: AdminCredentials = defaultAdminCredentials;

  private bookmarks: string[] = [];
  private readingHistory: { bookId: string; title: string; page: number; updatedAt: string }[] = [];
  private listeners: Listener[] = [];
  private initialized = false;
  private isSyncing = false;

  constructor() {
    this.init();
  }

  private isClient(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  private init() {
    if (typeof window === "undefined") {
      // Server-side (Node.js runtime): load latest disk database for SSR
      const snapshot = getServerDatabaseSnapshot();
      if (snapshot) {
        if (Array.isArray(snapshot.books)) this.books = snapshot.books;
        if (Array.isArray(snapshot.events)) this.events = snapshot.events;
        if (Array.isArray(snapshot.dhams)) this.dhams = snapshot.dhams;
        if (Array.isArray(snapshot.articles)) this.articles = snapshot.articles;
        if (Array.isArray(snapshot.videos)) this.videos = snapshot.videos;
        if (Array.isArray(snapshot.audioTracks)) this.audioTracks = snapshot.audioTracks;
        if (Array.isArray(snapshot.chitwaniBooks)) this.chitwaniBooks = snapshot.chitwaniBooks;
        if (Array.isArray(snapshot.chitwaniVideos)) this.chitwaniVideos = snapshot.chitwaniVideos;
        if (Array.isArray(snapshot.scriptures)) this.scriptures = snapshot.scriptures;
        if (Array.isArray(snapshot.topics)) this.topics = snapshot.topics;
        if (snapshot.dailyThought) this.dailyThought = snapshot.dailyThought;
        if (snapshot.settings) this.settings = snapshot.settings;
        if (snapshot.aboutContent) this.aboutContent = snapshot.aboutContent;
        if (snapshot.adminCredentials) this.adminCredentials = snapshot.adminCredentials;
      }
      return;
    }

    // Client-side: load from localStorage and sync with server API
    this.initialized = true;
    this.loadFromStorage();
    this.syncWithServer();

    try {
      window.addEventListener("storage", () => {
        this.loadFromStorage();
        this.notify();
      });
      window.addEventListener("sadhauli_dham_store_updated", () => {
        this.loadFromStorage();
        this.notify();
      });
    } catch {
      // Ignore if window event listeners are unavailable
    }
  }

  private ensureLoaded() {
    if (!this.initialized && this.isClient()) {
      this.loadFromStorage();
      this.initialized = true;
    }
  }

  // Asynchronously sync with the persistent server disk database (/api/data)
  public async syncWithServer(): Promise<void> {
    if (!this.isClient() || this.isSyncing) return;
    this.isSyncing = true;
    try {
      const res = await fetch(`/api/data?t=${Date.now()}&nocache=${Math.random()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
        },
      });
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && typeof serverData === "object") {
          let hasUpdates = false;
          const serverUpdatedTime = serverData.updatedAt ? new Date(serverData.updatedAt).getTime() : 0;

          // Helper to check whether server data should overwrite local cache.
          // If the user made a local edit in this browser after or equal to the server's build timestamp,
          // we PRESERVE the user's edits and NEVER let a stale edge/Cloudflare snapshot overwrite them!
          const shouldApplyServerData = (storageKey: string) => {
            const localSavedTime = Number(localStorage.getItem(`${storageKey}_timestamp`) || "0");
            if (localSavedTime > 0 && localSavedTime >= serverUpdatedTime) {
              return false;
            }
            return true;
          };

          if (Array.isArray(serverData.books) && shouldApplyServerData("prannath_books_v2")) {
            this.books = serverData.books;
            localStorage.setItem("prannath_books_v2", JSON.stringify(this.books));
            hasUpdates = true;
          }
          if (Array.isArray(serverData.events) && shouldApplyServerData("prannath_events_v2")) {
            this.events = serverData.events;
            localStorage.setItem("prannath_events_v2", JSON.stringify(this.events));
            hasUpdates = true;
          }
          if (Array.isArray(serverData.dhams) && shouldApplyServerData("prannath_dhams_v2")) {
            this.dhams = serverData.dhams;
            localStorage.setItem("prannath_dhams_v2", JSON.stringify(this.dhams));
            hasUpdates = true;
          }
          if (Array.isArray(serverData.articles) && shouldApplyServerData("prannath_articles_v2")) {
            this.articles = serverData.articles;
            localStorage.setItem("prannath_articles_v2", JSON.stringify(this.articles));
            hasUpdates = true;
          }
          if (Array.isArray(serverData.videos) && shouldApplyServerData("prannath_videos_v2")) {
            this.videos = serverData.videos;
            localStorage.setItem("prannath_videos_v2", JSON.stringify(this.videos));
            hasUpdates = true;
          }
          if (Array.isArray(serverData.audioTracks) && shouldApplyServerData("prannath_audio_v2")) {
            this.audioTracks = serverData.audioTracks;
            localStorage.setItem("prannath_audio_v2", JSON.stringify(this.audioTracks));
            hasUpdates = true;
          }
          if (Array.isArray(serverData.chitwaniBooks) && shouldApplyServerData("prannath_chitwani_books_v2")) {
            this.chitwaniBooks = serverData.chitwaniBooks;
            localStorage.setItem("prannath_chitwani_books_v2", JSON.stringify(this.chitwaniBooks));
            hasUpdates = true;
          }
          if (Array.isArray(serverData.chitwaniVideos) && shouldApplyServerData("prannath_chitwani_videos_v2")) {
            this.chitwaniVideos = serverData.chitwaniVideos;
            localStorage.setItem("prannath_chitwani_videos_v2", JSON.stringify(this.chitwaniVideos));
            hasUpdates = true;
          }
          if (serverData.dailyThought && shouldApplyServerData("prannath_thought_v2")) {
            this.dailyThought = serverData.dailyThought;
            localStorage.setItem("prannath_thought_v2", JSON.stringify(this.dailyThought));
            hasUpdates = true;
          }
          if (serverData.settings && shouldApplyServerData("prannath_settings_v2")) {
            this.settings = serverData.settings;
            localStorage.setItem("prannath_settings_v2", JSON.stringify(this.settings));
            hasUpdates = true;
          }
          if (serverData.aboutContent && shouldApplyServerData("prannath_about_v2")) {
            this.aboutContent = serverData.aboutContent;
            localStorage.setItem("prannath_about_v2", JSON.stringify(this.aboutContent));
            hasUpdates = true;
          }
          if (serverData.adminCredentials && shouldApplyServerData("prannath_admin_credentials_v2")) {
            this.adminCredentials = serverData.adminCredentials;
            localStorage.setItem("prannath_admin_credentials_v2", JSON.stringify(this.adminCredentials));
          }

          if (hasUpdates) {
            this.notify();
          }
        }
      }
    } catch (err) {
      console.warn("[Store] Server sync warning:", err);
    } finally {
      this.isSyncing = false;
    }
  }

  private loadFromStorage() {
    try {
      const storedBooks = localStorage.getItem("prannath_books_v2");
      if (storedBooks) {
        try {
          const parsed = JSON.parse(storedBooks);
          this.books = parsed.map((b: Book) => {
            if (b.pdfUrl && b.pdfUrl.includes("archive.org/download/tartam-vani-sample/")) {
              const filename = b.pdfUrl.split("/").pop() || "shri-bitak-saheb.pdf";
              return { ...b, pdfUrl: `/assets/${filename}` };
            }
            return b;
          });
        } catch {
          this.books = initialBooks;
        }
      }

      const storedVideos = localStorage.getItem("prannath_videos_v2");
      if (storedVideos) this.videos = JSON.parse(storedVideos);

      const storedAudio = localStorage.getItem("prannath_audio_v2");
      if (storedAudio) this.audioTracks = JSON.parse(storedAudio);

      const storedEvents = localStorage.getItem("prannath_events_v2");
      if (storedEvents) this.events = JSON.parse(storedEvents);

      const storedArticles = localStorage.getItem("prannath_articles_v2");
      if (storedArticles) this.articles = JSON.parse(storedArticles);

      const storedDhams = localStorage.getItem("prannath_dhams_v2");
      if (storedDhams) {
        try {
          const parsed: HolyDham[] = JSON.parse(storedDhams);
          this.dhams = parsed.map((d) => {
            const seed = initialDhams.find((s) => s.id === d.id);
            const images = d.images && d.images.length > 0 ? d.images : seed?.images || [d.imageUrl || "/assets/sadhauli-dham-2.jpg"];
            return {
              ...d,
              imageUrl: d.imageUrl || seed?.imageUrl || images[0],
              images,
            };
          });
        } catch {
          this.dhams = [...initialDhams];
        }
      }

      const storedAbout = localStorage.getItem("prannath_about_v2");
      if (storedAbout) this.aboutContent = JSON.parse(storedAbout);

      const storedChitwaniBooks = localStorage.getItem("prannath_chitwani_books_v2");
      if (storedChitwaniBooks) {
        try {
          const parsed = JSON.parse(storedChitwaniBooks);
          this.chitwaniBooks = parsed.map((cb: ChitwaniBook) => {
            if (cb.pdfUrl && cb.pdfUrl.includes("archive.org/download/tartam-vani-sample/")) {
              return { ...cb, pdfUrl: "/assets/chitwani-guide.pdf" };
            }
            return cb;
          });
        } catch {
          this.chitwaniBooks = initialChitwaniBooks;
        }
      }

      const storedChitwaniVideos = localStorage.getItem("prannath_chitwani_videos_v2");
      if (storedChitwaniVideos) this.chitwaniVideos = JSON.parse(storedChitwaniVideos);

      const storedThought = localStorage.getItem("prannath_thought_v2");
      if (storedThought) this.dailyThought = JSON.parse(storedThought);

      const storedSettings = localStorage.getItem("prannath_settings_v2");
      if (storedSettings) this.settings = JSON.parse(storedSettings);

      const storedBookmarks = localStorage.getItem("prannath_bookmarks_v2");
      if (storedBookmarks) this.bookmarks = JSON.parse(storedBookmarks);

      const storedHistory = localStorage.getItem("prannath_reading_history_v2");
      if (storedHistory) this.readingHistory = JSON.parse(storedHistory);

      const storedAdminAuth = localStorage.getItem("prannath_admin_credentials_v2");
      if (storedAdminAuth) this.adminCredentials = JSON.parse(storedAdminAuth);
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }

  // Save to client localStorage and persist to server /api/data
  public async saveToStorage(key: string, data: any): Promise<boolean> {
    if (!this.isClient()) return false;
    const now = Date.now();

    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}_timestamp`, String(now));
      localStorage.setItem("prannath_last_global_mutation", String(now));

      // Dispatch real-time local event across tabs & components
      try {
        window.dispatchEvent(new CustomEvent("sadhauli_dham_store_updated", { detail: { key, timestamp: now } }));
      } catch {}

      // Map storage keys to server JSON database keys
      const keyMap: Record<string, string> = {
        prannath_books_v2: "books",
        prannath_videos_v2: "videos",
        prannath_audio_v2: "audioTracks",
        prannath_events_v2: "events",
        prannath_articles_v2: "articles",
        prannath_dhams_v2: "dhams",
        prannath_about_v2: "aboutContent",
        prannath_chitwani_books_v2: "chitwaniBooks",
        prannath_chitwani_videos_v2: "chitwaniVideos",
        prannath_thought_v2: "dailyThought",
        prannath_settings_v2: "settings",
        prannath_admin_credentials_v2: "adminCredentials",
      };

      const serverKey = keyMap[key];
      if (serverKey) {
        console.log("SAVE ATTEMPT /api/data", { serverKey, itemsCount: Array.isArray(data) ? data.length : 1 });
        const response = await fetch("/api/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({ key: serverKey, data }),
          keepalive: true,
        });
        console.log("SAVE RESULT /api/data", { ok: response.ok, status: response.status, statusText: response.statusText });
        return response.ok;
      }
      return true;
    } catch (e) {
      console.warn("Could not save to localStorage or server:", e);
      return false;
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Error in store listener:", err);
      }
    });
  }

  // ==========================================
  // 1. HOLY DHAMS
  // ==========================================
  public getDhams(): HolyDham[] {
    this.ensureLoaded();
    return [...this.dhams].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public getDhamById(id: string): HolyDham | undefined {
    this.ensureLoaded();
    return this.dhams.find((d) => d.id === id);
  }

  public addDham(dham: Omit<HolyDham, "id">): HolyDham {
    this.ensureLoaded();
    const newDham: HolyDham = {
      ...dham,
      id: `dham-${Date.now()}`,
      order: dham.order || this.dhams.length + 1,
    };
    this.dhams.push(newDham);
    this.saveToStorage("prannath_dhams_v2", this.dhams);
    this.notify();
    return newDham;
  }

  public updateDham(id: string, updates: Partial<HolyDham>): boolean {
    this.ensureLoaded();
    const idx = this.dhams.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    this.dhams[idx] = { ...this.dhams[idx], ...updates };
    this.saveToStorage("prannath_dhams_v2", this.dhams);
    this.notify();
    return true;
  }

  public deleteDham(id: string): boolean {
    this.ensureLoaded();
    const initialLen = this.dhams.length;
    this.dhams = this.dhams.filter((d) => d.id !== id);
    if (this.dhams.length !== initialLen) {
      this.saveToStorage("prannath_dhams_v2", this.dhams);
      this.notify();
      return true;
    }
    return false;
  }

  // ==========================================
  // 2. BOOKS & SCRIPTURES
  // ==========================================
  public getBooks(): Book[] {
    this.ensureLoaded();
    return [...this.books];
  }

  public getBookById(id: string): Book | undefined {
    this.ensureLoaded();
    return this.books.find((b) => b.id === id);
  }

  public getBooksByCategory(category: string): Book[] {
    this.ensureLoaded();
    return this.books.filter((b) => b.category === category);
  }

  public getFeaturedBooks(): Book[] {
    this.ensureLoaded();
    return this.books.filter((b) => b.featured);
  }

  public addBook(book: any): Book {
    this.ensureLoaded();
    const newBook: Book = {
      id: `book-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      ...book,
    };
    this.books.push(newBook);
    this.saveToStorage("prannath_books_v2", this.books);
    this.notify();
    return newBook;
  }

  public updateBook(id: string, updates: Partial<Book>): boolean {
    this.ensureLoaded();
    const idx = this.books.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.books[idx] = {
      ...this.books[idx],
      ...updates,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    this.saveToStorage("prannath_books_v2", this.books);
    this.notify();
    return true;
  }

  public deleteBook(id: string): boolean {
    this.ensureLoaded();
    const initialLen = this.books.length;
    this.books = this.books.filter((b) => b.id !== id);
    if (this.books.length !== initialLen) {
      this.saveToStorage("prannath_books_v2", this.books);
      this.notify();
      return true;
    }
    return false;
  }

  public getScriptures(): Scripture[] {
    this.ensureLoaded();
    return [...this.scriptures];
  }

  public getScriptureById(id: string): Scripture | undefined {
    this.ensureLoaded();
    return this.scriptures.find((s) => s.id === id);
  }

  // ==========================================
  // 3. CHITWANI BOOKS & VIDEOS
  // ==========================================
  public getChitwaniBooks(): ChitwaniBook[] {
    this.ensureLoaded();
    return [...this.chitwaniBooks];
  }

  public getChitwaniBookById(id: string): ChitwaniBook | undefined {
    this.ensureLoaded();
    return this.chitwaniBooks.find((cb) => cb.id === id);
  }

  public addChitwaniBook(book: Omit<ChitwaniBook, "id">): ChitwaniBook {
    this.ensureLoaded();
    const newBook: ChitwaniBook = { ...book, id: `chitwani-book-${Date.now()}` };
    this.chitwaniBooks.push(newBook);
    this.saveToStorage("prannath_chitwani_books_v2", this.chitwaniBooks);
    this.notify();
    return newBook;
  }

  public updateChitwaniBook(id: string, updates: Partial<ChitwaniBook>): boolean {
    this.ensureLoaded();
    const idx = this.chitwaniBooks.findIndex((cb) => cb.id === id);
    if (idx === -1) return false;
    this.chitwaniBooks[idx] = { ...this.chitwaniBooks[idx], ...updates };
    this.saveToStorage("prannath_chitwani_books_v2", this.chitwaniBooks);
    this.notify();
    return true;
  }

  public deleteChitwaniBook(id: string): boolean {
    this.ensureLoaded();
    const initialLen = this.chitwaniBooks.length;
    this.chitwaniBooks = this.chitwaniBooks.filter((cb) => cb.id !== id);
    if (this.chitwaniBooks.length !== initialLen) {
      this.saveToStorage("prannath_chitwani_books_v2", this.chitwaniBooks);
      this.notify();
      return true;
    }
    return false;
  }

  public getChitwaniVideos(): ChitwaniVideo[] {
    this.ensureLoaded();
    return [...this.chitwaniVideos];
  }

  public addChitwaniVideo(video: Omit<ChitwaniVideo, "id">): ChitwaniVideo {
    this.ensureLoaded();
    const newVideo: ChitwaniVideo = { ...video, id: `chitwani-vid-${Date.now()}` };
    this.chitwaniVideos.unshift(newVideo);
    this.saveToStorage("prannath_chitwani_videos_v2", this.chitwaniVideos);
    this.notify();
    return newVideo;
  }

  public updateChitwaniVideo(id: string, updates: Partial<ChitwaniVideo>): boolean {
    this.ensureLoaded();
    const idx = this.chitwaniVideos.findIndex((v) => v.id === id);
    if (idx === -1) return false;
    this.chitwaniVideos[idx] = { ...this.chitwaniVideos[idx], ...updates };
    this.saveToStorage("prannath_chitwani_videos_v2", this.chitwaniVideos);
    this.notify();
    return true;
  }

  public deleteChitwaniVideo(id: string): boolean {
    this.ensureLoaded();
    const initialLen = this.chitwaniVideos.length;
    this.chitwaniVideos = this.chitwaniVideos.filter((v) => v.id !== id);
    if (this.chitwaniVideos.length !== initialLen) {
      this.saveToStorage("prannath_chitwani_videos_v2", this.chitwaniVideos);
      this.notify();
      return true;
    }
    return false;
  }

  // ==========================================
  // 4. ARTICLES & BLOGS & PHILOSOPHY
  // ==========================================
  public getArticles(): Article[] {
    this.ensureLoaded();
    return [...this.articles];
  }

  public getArticlesByCategory(cat: string): Article[] {
    this.ensureLoaded();
    return this.articles.filter((a) => a.category === cat);
  }

  public getPrannathArticles(): Article[] {
    return this.getArticlesByCategory("prannath-ji");
  }

  public getAdhyatmikBlogs(): Article[] {
    return this.getArticlesByCategory("adhyatmik-gyan");
  }

  public getChitwaniArticles(): Article[] {
    return this.getArticlesByCategory("chitwani");
  }

  public getArticleById(id: string): Article | undefined {
    this.ensureLoaded();
    return this.articles.find((a) => a.id === id || a.slug === id);
  }

  public getArticleBySlug(slug: string): Article | undefined {
    return this.getArticleById(slug);
  }

  public addArticle(art: Omit<Article, "id" | "publishedAt">): Article {
    this.ensureLoaded();
    const newArticle: Article = {
      ...art,
      id: `art-${Date.now()}`,
      publishedAt: new Date().toISOString().split("T")[0],
    };
    this.articles.unshift(newArticle);
    this.saveToStorage("prannath_articles_v2", this.articles);
    this.notify();
    return newArticle;
  }

  public updateArticle(id: string, updates: Partial<Article>): boolean {
    this.ensureLoaded();
    const idx = this.articles.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.articles[idx] = { ...this.articles[idx], ...updates };
    this.saveToStorage("prannath_articles_v2", this.articles);
    this.notify();
    return true;
  }

  public deleteArticle(id: string): boolean {
    this.ensureLoaded();
    const initialLen = this.articles.length;
    this.articles = this.articles.filter((a) => a.id !== id);
    if (this.articles.length !== initialLen) {
      this.saveToStorage("prannath_articles_v2", this.articles);
      this.notify();
      return true;
    }
    return false;
  }

  public getSpiritualTopics(): SpiritualTopic[] {
    this.ensureLoaded();
    return [...this.topics];
  }

  // ==========================================
  // 5. FESTIVAL EVENTS & EARLIEST UPCOMING EVENT
  // ==========================================
  public getEvents(): EventItem[] {
    this.ensureLoaded();
    return [...this.events].sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
  }

  public getEarliestUpcomingEvent(): EventItem | null {
    this.ensureLoaded();
    const now = new Date().getTime();
    const sorted = [...this.events].sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );

    // 1. First look for future upcoming event
    const upcoming = sorted.find((e) => new Date(e.startAt).getTime() >= now);
    if (upcoming) return upcoming;

    // 2. Look for live event in progress
    const live = sorted.find((e) => e.status === "live");
    if (live) return live;

    // 3. Fallback to earliest scheduled event
    return sorted.length > 0 ? sorted[0] : null;
  }

  public getNextUpcomingEvent(): EventItem | null {
    return this.getEarliestUpcomingEvent();
  }

  public addEvent(event: Omit<EventItem, "id">): EventItem {
    this.ensureLoaded();
    const newEvent: EventItem = { ...event, id: `event-${Date.now()}` };
    this.events.push(newEvent);
    this.saveToStorage("prannath_events_v2", this.events);
    this.notify();
    return newEvent;
  }

  public updateEvent(id: string, updates: Partial<EventItem>): boolean {
    this.ensureLoaded();
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.events[idx] = { ...this.events[idx], ...updates };
    this.saveToStorage("prannath_events_v2", this.events);
    this.notify();
    return true;
  }

  public deleteEvent(id: string): boolean {
    this.ensureLoaded();
    const initialLen = this.events.length;
    this.events = this.events.filter((e) => e.id !== id);
    if (this.events.length !== initialLen) {
      this.saveToStorage("prannath_events_v2", this.events);
      this.notify();
      return true;
    }
    return false;
  }

  // ==========================================
  // 6. VIDEOS
  // ==========================================
  public getVideos(): Video[] {
    this.ensureLoaded();
    return [...this.videos];
  }

  public getFeaturedVideos(): Video[] {
    this.ensureLoaded();
    return this.videos.filter((v) => v.featured);
  }

  public addVideo(video: any): Video {
    this.ensureLoaded();
    const newVideo: Video = {
      id: `vid-${Date.now()}`,
      publishedAt: new Date().toISOString().split("T")[0],
      ...video,
    };
    this.videos.unshift(newVideo);
    this.saveToStorage("prannath_videos_v2", this.videos);
    this.notify();
    return newVideo;
  }

  public updateVideo(id: string, updates: Partial<Video>): boolean {
    this.ensureLoaded();
    const idx = this.videos.findIndex((v) => v.id === id);
    if (idx === -1) return false;
    this.videos[idx] = { ...this.videos[idx], ...updates };
    this.saveToStorage("prannath_videos_v2", this.videos);
    this.notify();
    return true;
  }

  public deleteVideo(id: string): boolean {
    this.ensureLoaded();
    const initialLen = this.videos.length;
    this.videos = this.videos.filter((v) => v.id !== id);
    if (this.videos.length !== initialLen) {
      this.saveToStorage("prannath_videos_v2", this.videos);
      this.notify();
      return true;
    }
    return false;
  }

  // ==========================================
  // 7. AUDIO TRACKS
  // ==========================================
  public getAudioTracks(): AudioTrack[] {
    this.ensureLoaded();
    return [...this.audioTracks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public addAudioTrack(track: Omit<AudioTrack, "id">): AudioTrack {
    this.ensureLoaded();
    const newTrack: AudioTrack = {
      ...track,
      id: `audio-${Date.now()}`,
      order: track.order || this.audioTracks.length + 1,
    };
    this.audioTracks.push(newTrack);
    this.saveToStorage("prannath_audio_v2", this.audioTracks);
    this.notify();
    return newTrack;
  }

  public updateAudioTrack(id: string, updates: Partial<AudioTrack>): boolean {
    this.ensureLoaded();
    const idx = this.audioTracks.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.audioTracks[idx] = { ...this.audioTracks[idx], ...updates };
    this.saveToStorage("prannath_audio_v2", this.audioTracks);
    this.notify();
    return true;
  }

  public deleteAudioTrack(id: string): boolean {
    this.ensureLoaded();
    const initialLen = this.audioTracks.length;
    this.audioTracks = this.audioTracks.filter((a) => a.id !== id);
    if (this.audioTracks.length !== initialLen) {
      this.saveToStorage("prannath_audio_v2", this.audioTracks);
      this.notify();
      return true;
    }
    return false;
  }

  // ==========================================
  // 8. DAILY THOUGHT
  // ==========================================
  public getDailyThought(): DailyThought {
    this.ensureLoaded();
    return { ...this.dailyThought };
  }

  public updateDailyThought(thought: Partial<DailyThought>): void {
    this.ensureLoaded();
    this.dailyThought = { ...this.dailyThought, ...thought };
    this.saveToStorage("prannath_thought_v2", this.dailyThought);
    this.notify();
  }

  // ==========================================
  // 9. SITE SETTINGS
  // ==========================================
  public getSettings(): SiteSettings {
    this.ensureLoaded();
    return { ...this.settings };
  }

  public updateSettings(settings: Partial<SiteSettings>): void {
    this.ensureLoaded();
    this.settings = { ...this.settings, ...settings };
    this.saveToStorage("prannath_settings_v2", this.settings);
    this.notify();
  }

  // ==========================================
  // 10. ABOUT CONTENT
  // ==========================================
  public getAboutContent(): AboutSectionContent {
    this.ensureLoaded();
    return { ...this.aboutContent };
  }

  public updateAboutContent(content: Partial<AboutSectionContent>): void {
    this.ensureLoaded();
    this.aboutContent = { ...this.aboutContent, ...content };
    this.saveToStorage("prannath_about_v2", this.aboutContent);
    this.notify();
  }

  // ==========================================
  // 11. ADMIN AUTH & CREDENTIALS
  // ==========================================
  public getAdminCredentials(): AdminCredentials {
    this.ensureLoaded();
    return { ...this.adminCredentials };
  }

  public updateAdminCredentials(creds: Partial<AdminCredentials>): void {
    this.ensureLoaded();
    this.adminCredentials = {
      ...this.adminCredentials,
      ...creds,
      updatedAt: new Date().toISOString(),
    };
    this.saveToStorage("prannath_admin_credentials_v2", this.adminCredentials);
    this.notify();
  }

  public verifyAdminCredentials(user: string, pass: string): boolean {
    this.ensureLoaded();
    return (
      (user === this.adminCredentials.username || user === this.adminCredentials.email) &&
      pass === this.adminCredentials.password
    );
  }

  public isAdminAuthenticated(): boolean {
    if (!this.isClient()) return false;
    return localStorage.getItem("prannath_admin_session") === "true";
  }

  public setAdminSession(auth: boolean, email?: string): void {
    if (!this.isClient()) return;
    if (auth) {
      localStorage.setItem("prannath_admin_session", "true");
      if (email) {
        localStorage.setItem("prannath_admin_email", email);
      }
    } else {
      localStorage.removeItem("prannath_admin_session");
      localStorage.removeItem("prannath_admin_email");
    }
    this.notify();
  }

  // ==========================================
  // 12. STATS & BOOKMARKS & HISTORY
  // ==========================================
  public getStats(): PortalStats {
    this.ensureLoaded();
    return {
      pdfBooksCount: this.books.length + this.chitwaniBooks.length,
      videosCount: this.videos.length + this.chitwaniVideos.length,
      seekersCount: this.stats.seekersCount || 108000,
      countriesCount: this.stats.countriesCount || 45,
    };
  }

  public getBookmarks(): string[] {
    this.ensureLoaded();
    return [...this.bookmarks];
  }

  public toggleBookmark(bookId: string): boolean {
    this.ensureLoaded();
    const idx = this.bookmarks.indexOf(bookId);
    let isBookmarked = false;
    if (idx > -1) {
      this.bookmarks.splice(idx, 1);
    } else {
      this.bookmarks.push(bookId);
      isBookmarked = true;
    }
    this.saveToStorage("prannath_bookmarks_v2", this.bookmarks);
    this.notify();
    return isBookmarked;
  }

  public isBookmarked(bookId: string): boolean {
    this.ensureLoaded();
    return this.bookmarks.includes(bookId);
  }

  public saveReadingProgress(bookId: string, title: string, page: number): void {
    this.ensureLoaded();
    const existing = this.readingHistory.findIndex((h) => h.bookId === bookId);
    const item = { bookId, title, page, updatedAt: new Date().toISOString() };
    if (existing > -1) {
      this.readingHistory[existing] = item;
    } else {
      this.readingHistory.unshift(item);
      if (this.readingHistory.length > 20) this.readingHistory.pop();
    }
    this.saveToStorage("prannath_reading_history_v2", this.readingHistory);
    this.notify();
  }

  public getReadingProgress(bookId: string): number {
    this.ensureLoaded();
    const record = this.readingHistory.find((h) => h.bookId === bookId);
    return record ? record.page : 1;
  }

  public getReadingHistory() {
    this.ensureLoaded();
    return [...this.readingHistory];
  }

  public getRecentReadingHistory() {
    return this.getReadingHistory();
  }

  public resetToDefaults(): void {
    this.books = [...initialBooks];
    this.events = [...initialEvents];
    this.dhams = [...initialDhams];
    this.articles = [...initialArticles];
    this.videos = [...initialVideos];
    this.audioTracks = [...initialAudioTracks];
    this.chitwaniBooks = [...initialChitwaniBooks];
    this.chitwaniVideos = [...initialChitwaniVideos];
    this.dailyThought = { ...initialDailyThought };
    this.settings = { ...initialSettings };
    this.aboutContent = { ...initialAboutContent };
    this.adminCredentials = { ...defaultAdminCredentials };
    if (this.isClient()) {
      localStorage.clear();
    }
    this.notify();
  }
}

export const store = new DataStore();
