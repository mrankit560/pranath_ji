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

type Listener = () => void;

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

  private bookmarks: string[] = [];
  private readingHistory: { bookId: string; title: string; page: number; updatedAt: string }[] = [];
  private listeners: Listener[] = [];
  private initialized = false;

  constructor() {
    this.init();
  }

  private isClient(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  private init() {
    if (!this.isClient()) return;
    this.loadFromStorage();
  }

  private ensureLoaded() {
    if (!this.initialized && this.isClient()) {
      this.loadFromStorage();
      this.initialized = true;
    }
  }

  private loadFromStorage() {
    try {
      const storedBooks = localStorage.getItem("prannath_books_v2");
      if (storedBooks) this.books = JSON.parse(storedBooks);

      const storedVideos = localStorage.getItem("prannath_videos_v2");
      if (storedVideos) this.videos = JSON.parse(storedVideos);

      const storedAudio = localStorage.getItem("prannath_audio_v2");
      if (storedAudio) this.audioTracks = JSON.parse(storedAudio);

      const storedEvents = localStorage.getItem("prannath_events_v2");
      if (storedEvents) this.events = JSON.parse(storedEvents);

      const storedArticles = localStorage.getItem("prannath_articles_v2");
      if (storedArticles) this.articles = JSON.parse(storedArticles);

      const storedDhams = localStorage.getItem("prannath_dhams_v2");
      if (storedDhams) this.dhams = JSON.parse(storedDhams);

      const storedAbout = localStorage.getItem("prannath_about_v2");
      if (storedAbout) this.aboutContent = JSON.parse(storedAbout);

      const storedChitwaniBooks = localStorage.getItem("prannath_chitwani_books_v2");
      if (storedChitwaniBooks) this.chitwaniBooks = JSON.parse(storedChitwaniBooks);

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
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }

  private saveToStorage(key: string, data: any) {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`Could not save ${key} to localStorage:`, e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error("Store listener error:", err);
      }
    });
  }

  // --- Reset Store to Defaults ---
  public resetToDefaults() {
    this.books = [...initialBooks];
    this.videos = [...initialVideos];
    this.audioTracks = [...initialAudioTracks];
    this.events = [...initialEvents];
    this.articles = [...initialArticles];
    this.dhams = [...initialDhams];
    this.aboutContent = { ...initialAboutContent };
    this.chitwaniBooks = [...initialChitwaniBooks];
    this.chitwaniVideos = [...initialChitwaniVideos];
    this.dailyThought = { ...initialDailyThought };
    this.settings = { ...initialSettings };

    if (this.isClient()) {
      localStorage.removeItem("prannath_books_v2");
      localStorage.removeItem("prannath_videos_v2");
      localStorage.removeItem("prannath_audio_v2");
      localStorage.removeItem("prannath_events_v2");
      localStorage.removeItem("prannath_articles_v2");
      localStorage.removeItem("prannath_dhams_v2");
      localStorage.removeItem("prannath_about_v2");
      localStorage.removeItem("prannath_chitwani_books_v2");
      localStorage.removeItem("prannath_chitwani_videos_v2");
      localStorage.removeItem("prannath_thought_v2");
      localStorage.removeItem("prannath_settings_v2");
    }
    this.notify();
  }

  // ==========================================
  // 1. HOLY DHAMS
  // ==========================================
  public getDhams(): HolyDham[] {
    this.ensureLoaded();
    return [...this.dhams].sort((a, b) => a.order - b.order);
  }

  public addDham(dham: Omit<HolyDham, "id">): HolyDham {
    this.ensureLoaded();
    const newDham: HolyDham = { ...dham, id: `dham-${Date.now()}` };
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
  // 2. ABOUT US CONTENT
  // ==========================================
  public getAboutContent(): AboutSectionContent {
    this.ensureLoaded();
    return { ...this.aboutContent };
  }

  public updateAboutContent(updates: Partial<AboutSectionContent>) {
    this.ensureLoaded();
    this.aboutContent = { ...this.aboutContent, ...updates };
    this.saveToStorage("prannath_about_v2", this.aboutContent);
    this.notify();
  }

  // ==========================================
  // 3. BOOKS & PDF LIBRARY
  // ==========================================
  public getBooks(): Book[] {
    this.ensureLoaded();
    return [...this.books];
  }

  public getBooksByCategory(category: string): Book[] {
    this.ensureLoaded();
    if (category === "all") return [...this.books];
    return this.books.filter((b) => b.category === category);
  }

  public getBookById(id: string): Book | undefined {
    this.ensureLoaded();
    return this.books.find((b) => b.id === id);
  }

  public addBook(book: Omit<Book, "id" | "createdAt" | "updatedAt">): Book {
    this.ensureLoaded();
    const now = new Date().toISOString();
    const newBook: Book = {
      ...book,
      id: `book-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.books.unshift(newBook);
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
      updatedAt: new Date().toISOString(),
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

  // ==========================================
  // 4. ARTICLES & BLOGS (Shri Prannath Ji, Aadhyatmik Gyan, Chitwani)
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

  // ==========================================
  // 5. CHITWANI BOOKS & VIDEOS
  // ==========================================
  public getChitwaniBooks(): ChitwaniBook[] {
    this.ensureLoaded();
    return [...this.chitwaniBooks];
  }

  public addChitwaniBook(book: Omit<ChitwaniBook, "id">): ChitwaniBook {
    this.ensureLoaded();
    const newBook: ChitwaniBook = { ...book, id: `chitwani-book-${Date.now()}` };
    this.chitwaniBooks.unshift(newBook);
    this.saveToStorage("prannath_chitwani_books_v2", this.chitwaniBooks);
    this.notify();
    return newBook;
  }

  public updateChitwaniBook(id: string, updates: Partial<ChitwaniBook>): boolean {
    this.ensureLoaded();
    const idx = this.chitwaniBooks.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.chitwaniBooks[idx] = { ...this.chitwaniBooks[idx], ...updates };
    this.saveToStorage("prannath_chitwani_books_v2", this.chitwaniBooks);
    this.notify();
    return true;
  }

  public deleteChitwaniBook(id: string): boolean {
    this.ensureLoaded();
    const initialLen = this.chitwaniBooks.length;
    this.chitwaniBooks = this.chitwaniBooks.filter((b) => b.id !== id);
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
  // 6. FESTIVAL EVENTS & EARLIEST EVENT
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

    // 3. Fallback to latest scheduled event
    return sorted.length > 0 ? sorted[0] : null;
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
  // 7. VIDEOS (Media Centre)
  // ==========================================
  public getVideos(): Video[] {
    this.ensureLoaded();
    return [...this.videos];
  }

  public addVideo(video: Omit<Video, "id" | "publishedAt">): Video {
    this.ensureLoaded();
    const newVid: Video = {
      ...video,
      id: `vid-${Date.now()}`,
      publishedAt: new Date().toISOString().split("T")[0],
    };
    this.videos.unshift(newVid);
    this.saveToStorage("prannath_videos_v2", this.videos);
    this.notify();
    return newVid;
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
  // 8. SCRIPTURES, AUDIO, THOUGHT, SETTINGS
  // ==========================================
  public getScriptures(): Scripture[] {
    this.ensureLoaded();
    return [...this.scriptures];
  }

  public getAudioTracks(): AudioTrack[] {
    this.ensureLoaded();
    return [...this.audioTracks];
  }

  public addAudioTrack(track: Omit<AudioTrack, "id">): AudioTrack {
    this.ensureLoaded();
    const newTrack: AudioTrack = { ...track, id: `audio-${Date.now()}` };
    this.audioTracks.push(newTrack);
    this.saveToStorage("prannath_audio_v2", this.audioTracks);
    this.notify();
    return newTrack;
  }

  public deleteAudioTrack(id: string): boolean {
    this.ensureLoaded();
    const initialLen = this.audioTracks.length;
    this.audioTracks = this.audioTracks.filter((t) => t.id !== id);
    if (this.audioTracks.length !== initialLen) {
      this.saveToStorage("prannath_audio_v2", this.audioTracks);
      this.notify();
      return true;
    }
    return false;
  }

  public getDailyThought(): DailyThought {
    this.ensureLoaded();
    return { ...this.dailyThought };
  }

  public updateDailyThought(thought: Partial<DailyThought>) {
    this.ensureLoaded();
    this.dailyThought = { ...this.dailyThought, ...thought };
    this.saveToStorage("prannath_thought_v2", this.dailyThought);
    this.notify();
  }

  public getSettings(): SiteSettings {
    this.ensureLoaded();
    return { ...this.settings };
  }

  public updateSettings(settings: Partial<SiteSettings>) {
    this.ensureLoaded();
    this.settings = { ...this.settings, ...settings };
    this.saveToStorage("prannath_settings_v2", this.settings);
    this.notify();
  }

  public getStats(): PortalStats {
    this.ensureLoaded();
    return {
      pdfBooksCount: this.books.length + 500,
      videosCount: this.videos.length + 100,
      seekersCount: 50000,
      countriesCount: 100,
    };
  }

  // ==========================================
  // 9. BOOKMARKS & READING HISTORY
  // ==========================================
  public getBookmarks(): string[] {
    this.ensureLoaded();
    return [...this.bookmarks];
  }

  public toggleBookmark(bookId: string): boolean {
    this.ensureLoaded();
    const exists = this.bookmarks.includes(bookId);
    if (exists) {
      this.bookmarks = this.bookmarks.filter((id) => id !== bookId);
    } else {
      this.bookmarks.push(bookId);
    }
    this.saveToStorage("prannath_bookmarks_v2", this.bookmarks);
    this.notify();
    return !exists;
  }

  public getReadingHistory() {
    this.ensureLoaded();
    return [...this.readingHistory];
  }

  public updateReadingHistory(bookId: string, title: string, page: number) {
    this.ensureLoaded();
    const idx = this.readingHistory.findIndex((h) => h.bookId === bookId);
    const now = new Date().toISOString();
    if (idx !== -1) {
      this.readingHistory[idx] = { bookId, title, page, updatedAt: now };
    } else {
      this.readingHistory.unshift({ bookId, title, page, updatedAt: now });
    }
    this.saveToStorage("prannath_reading_history_v2", this.readingHistory);
    this.notify();
  }
}

export const store = new DataStore();
