export type Role = "user" | "editor" | "admin" | "superadmin";

export type ContentStatus = "draft" | "published" | "archived";

export interface Book {
  id: string;
  titleEn: string;
  titleHi: string;
  authorEn: string;
  authorHi: string;
  descriptionEn: string;
  descriptionHi: string;
  category: "all" | "bitak_saheb" | "tartam_vani" | "other" | string;
  language: "hi" | "en" | "both" | "gujarati";
  coverUrl: string;
  pdfUrl: string;
  pages: number;
  bookBlogEn?: string;
  bookBlogHi?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Verse {
  verseNum: number;
  textHi: string;
  meaningHi: string;
  textEn?: string;
  meaningEn?: string;
}

export interface Chapter {
  chapterNum: number;
  titleEn: string;
  titleHi: string;
  verses: Verse[];
  pdfPage?: number;
}

export interface Scripture {
  id: string;
  granthNumber: number;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  chaptersCount: number;
  versesCount: number;
  coverUrl: string;
  pdfUrl: string;
  chapters: Chapter[];
}

export interface Video {
  id: string;
  youtubeId: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  category: "satsang" | "pravachan" | "vaniGayan" | "bhajan" | "meditation" | "other" | string;
  speaker: string;
  duration: string;
  thumbnail: string;
  featured: boolean;
  published: boolean;
  isLive?: boolean;
  publishedAt: string;
}

export interface AudioTrack {
  id: string;
  titleEn: string;
  titleHi: string;
  audioUrl: string;
  coverUrl: string;
  category: "aarti" | "nityaNiyam" | "vaniGayan" | "bhajan" | "chitwani";
  speaker: string;
  duration: string;
  order: number;
  published: boolean;
}

export interface EventItem {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  startAt: string; // ISO date string or YYYY-MM-DD
  endAt?: string;
  hasSpecificTime?: boolean;
  timeStr?: string; // Optional time display string e.g. "09:00 AM"
  location: string;
  image: string;
  speaker?: string;
  eventType: "satsang" | "festival" | "meditation" | "special" | string;
  livestreamUrl?: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
}

export interface Article {
  id: string;
  titleEn: string;
  titleHi: string;
  contentEn: string;
  contentHi: string;
  summaryEn?: string;
  summaryHi?: string;
  slug: string;
  featuredImage: string;
  author: string;
  category: "prannath-ji" | "adhyatmik-gyan" | "chitwani" | string;
  tags: string[];
  readTime?: string;
  status: ContentStatus;
  publishedAt: string;
}

export interface HolyDham {
  id: string;
  nameHi: string;
  nameEn: string;
  descriptionHi: string;
  descriptionEn: string;
  location: string;
  mapUrl: string;
  imageUrl: string;
  phone?: string;
  order: number;
  featured: boolean;
}

export interface AboutSectionContent {
  titleHi: string;
  titleEn: string;
  welcomeHi: string;
  welcomeEn: string;
  subtitleHi: string;
  subtitleEn: string;
  purposeHeadingHi: string;
  purposeHeadingEn: string;
  purposeBodyHi: string;
  purposeBodyEn: string;
  questionsHeadingHi: string;
  questionsHeadingEn: string;
  questionsHi: string[];
  questionsEn: string[];
  tartamAnswerHi: string;
  tartamAnswerEn: string;
  servicesHeadingHi: string;
  servicesHeadingEn: string;
  servicesListHi: string[];
  servicesListEn: string[];
  messageHeadingHi: string;
  messageHeadingEn: string;
  messageQuoteHi: string;
  messageQuoteEn: string;
  messageCtaHi: string;
  messageCtaEn: string;
}

export interface ChitwaniBook {
  id: string;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  author: string;
  coverUrl: string;
  pdfUrl: string;
  pages: number;
}

export interface ChitwaniVideo {
  id: string;
  titleHi: string;
  titleEn: string;
  youtubeId: string;
  speaker: string;
  duration: string;
  descriptionHi: string;
  descriptionEn: string;
}

export interface SpiritualTopic {
  id: string;
  slug: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  contentEn: string;
  contentHi: string;
  image: string;
  keyConcepts: string[];
  relatedScriptures: string[];
}

export interface DailyThought {
  id: string;
  quoteEn: string;
  quoteHi: string;
  authorEn: string;
  authorHi: string;
  sourceEn: string;
  sourceHi: string;
  date: string;
}

export interface PortalStats {
  pdfBooksCount: number;
  videosCount: number;
  seekersCount: number;
  countriesCount: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: Role;
  language: "hi" | "en";
  bookmarks: string[];
  readingHistory: {
    bookId: string;
    title: string;
    page: number;
    updatedAt: string;
  }[];
  savedAudio: string[];
}

export interface SiteSettings {
  phone: string;
  email: string;
  addressHi: string;
  addressEn: string;
  googleMapsUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
}

export interface AdminCredentials {
  username: string;
  email: string;
  password: string;
  updatedAt?: string;
}

