# श्री प्राणनाथ जी परमधाम (Shri Prannath Ji Paramdham)
### A Full-Stack Multilingual Spiritual Knowledge & Digital Library Platform
**Shri Nijanand Ashram Sadhauli Dham, Haridwar, Uttarakhand (श्री निजानंद आश्रम साढौली धाम, हरिद्वार)**

---

## 🌟 Overview & Key Features

1. **Luxurious Spiritual Temple Aesthetic**:
   - Deep Spiritual Navy (`#0D0A08`), Antique Gold (`#D4AF37`), Radiant Gold Glimmer, and cosmic Tartam Paramdham Mandala.
   - Faithful visual reproduction of the official Sadhauli Dham design direction.
2. **First-Visit Spiritual Language Selection**:
   - Welcome modal offering immediate choice of **[ हिन्दी ]** or **[ English ]**.
   - Sticky Header language switcher with instant UI localization across all pages.
3. **Tartam Vani 14 Holy Granths Reader**:
   - Complete chapter and prakaran navigation with verses (chaupais) and Hindi/English commentaries.
4. **In-Browser PDF Library & Reader**:
   - Responsive reader with zoom (50%–200%), page jump, bookmarks, and direct download.
5. **Video & Live Satsang Hub**:
   - Automatic YouTube ID parser, speaker filtering, and live stream marker (`🔴 LIVE NOW`).
6. **Persistent Global Audio Player**:
   - Bottom docked player with background playback across pages for Aarti, Nitya Niyam, Vani Gayan, and Bhajan.
7. **Chitwani & Meditation Sanctuary**:
   - Soothing breathing guide animation (Inhale, Hold, Exhale), ambient sound generator (Tanpura, Om, Flute), and countdown timer.
8. **Dynamic Events & Live Satsang Countdown**:
   - Real-time countdown calculation from database to the next scheduled Satsang.
9. **Spiritual Philosophy (Brahm Gyan)**:
   - Topic cards exploring Brahm, Aksharatit, Maya, Soul, Guru Tatva, and Moksha.
10. **Protected Admin CMS Dashboard (`/admin`)**:
    - Full CRUD management for Books, Videos, Audio, Events, Bilingual Articles, and Daily Spiritual Quotes.

---

## 🚀 Getting Started (Quick Setup)

### 1. Prerequisites
- **Node.js**: v18 or v20+
- **npm** or **yarn**

### 2. Installation
Open your terminal inside the project directory and run:
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔐 Administrator CMS Access

To access the administrative management portal:
1. Navigate to: [http://localhost:3000/auth/login](http://localhost:3000/auth/login) or click **लॉगिन / रजिस्टर** in the header.
2. Enter the administrator credentials:
   - **Username / Email**: `admin` (or `admin@sadhaulidham.com`)
   - **Password**: `admin123`
3. You will be automatically redirected to the **Admin CMS Dashboard** (`/admin`).

---

## 📚 Managing Content via CMS

- **Updating Today's Spiritual Thought**:
  Go to `/admin` -> Edit the Hindi and English quote fields -> Click **होमपेज पर विचार अपडेट करें**. The homepage updates immediately!
- **Adding New PDF Books**:
  Go to `/admin/books` -> Click **नई पुस्तक जोड़ें** -> Enter title, author, page count, and PDF link -> Click **पुस्तक प्रकाशित करें**.
- **Adding YouTube Satsangs & Videos**:
  Go to `/admin/videos` -> Click **नया वीडियो जोड़ें** -> Paste the YouTube URL -> The system extracts the video ID and thumbnail automatically.
- **Adding Ashram Events & Live Satsangs**:
  Go to `/admin/events` -> Click **नया कार्यक्रम जोड़ें** -> Set date and time -> The homepage countdown timer syncs in real-time.

---

## 🌐 Deploying to Production

### Option A: Vercel (One-Click)
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Click **Deploy**.

### Option B: Firebase / Google Cloud Hosting
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy using Firebase CLI:
   ```bash
   firebase deploy
   ```

---

## 🪷 Contact & Association

- **Ashram**: Shri Nijanand Ashram Sadhauli Dham, Haridwar, Uttarakhand
- **Phone**: `+91 99271 97390`
- **Email**: `sadhaulidham@gmail.com`
- **YouTube**: [Sadhauli Dham Official Channel](https://youtube.com/@sadhaulidham3424)
