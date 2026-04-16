# LumaBoard - Personalized Content Dashboard
### SDE Intern - Frontend Development Assignment

LumaBoard is a strictly typed, highly polished, personalized content aggregation dashboard built as a solution for the SDE Frontend Assignment. Built on **Next.js (App Router)** and **TypeScript**, it unifies news pipelines, rich media recommendations, and social timelines into a singular, dynamic, and customizable user feed.

---

### Requirements

**1. Core Features**
* **Personalized Content Feed & Preferences:** Users can configure content preferences (categories, social profiles) which are persisted natively inside browser storage and hydrated dynamically alongside Redux.
* **Data Fetching:** 
  * Integrates real external REST APIs: **NewsAPI** (News), and **TMDB** (Recommendations/Movies).
  * Integrates a robust internal mock **Social Feed** data layer that correctly mimics a live ecosystem by filtering fake posts by hashtags and profiles.
* **Interactive Content Cards:** Supported by manual/infinite pagination patterns.

**2. User Dashboard Layout**
* **Main Layout:** Fully responsive dashboard matrix with a floating left sidebar panel (horizontal rail on mobile) and a sticky top header housing search schemas and profile integrations.
* **Sections:** Distinctly structures a unified **Personalized Feed**, a smaller accelerated **Trending Highlights** window, and a pinned **Favorites Vault**.

**3. Search Functionality**
* **Debounced Search Bar:** Clean debounce logic hooked into RTK Query efficiently drives cross-source searches without exhausting API call limits.

**4. Advanced UI/UX Features**
* **Drag-and-Drop:** Intuitive, physics-based reordering logic utilizing `@dnd-kit/core` enables absolute control over the feed layout.
* **Dark Mode:** Deep CSS-variable integration natively powering seamless system Theme toggles.
* **Animations:** Beautiful, modern layered mounting interactions powered by **Framer Motion`.
* **PWA Integration:** Completely installable Progressive Web App utilizing Next.js layout metadata and offline Service Workers.

**5. State Management & Logic Handling**
* **Redux Toolkit & RTK Query:** Entire architectural networking logic relies exclusively on RTK Query for caching, request de-duplication, and paginated background fetching.

**7. Bonus Features (Partially Completed)**
* **Mock Authentication:** Implemented a mocked entry splash-screen protecting the layouts and mapping a fake user session locally.

### ❌ Not Implemented

**6. Testing**
* **No Automated Testing:** Unit testing (via React Testing Library or Jest), Integration Testing, and End-to-End (E2E) testing (with Cypress/Playwright) were **not implemented** in this application. 

---

## 🗺 Internal Architecture
The application cleanly complies with a decoupled API-first data boundary:
* **Next.js Route Handlers (`src/app/api/...`):** Individual endpoints act as the isolated single source of truth for all external network APIs. 
* **RTK Query Mappers:** The dashboard application purely queries against local endpoints (`/api/feed`, `/api/trending`) instead of orchestrating exposed keys across the component tree.

## 🛠 Tech Stack
* **Framework:** Next.js 14+ (App Router)
* **Language:** React 19 & TypeScript
* **State / Networking:** Redux Toolkit + RTK Query
* **Design:** Tailwind CSS v4 + Vanilla CSS Layout Tokens
* **Motion & Drag:** Framer Motion + `@dnd-kit/core`

## ⚡ Getting Started

1. **Install Dependencies:**
   ```bash
   npm install 
   # or pnpm install
   ```

2. **Environment Variables:**
   Create a `.env.local` to fuel the live integrations. 

   ```env
   NEWS_API_KEY=your_newsapi_key
   TMDB_API_KEY=your_tmdb_key_v3
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   # or pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) inside your browser.

- **Live Deployment:** https://luma-board.vercel.app/
- **Repository:** https://github.com/KshKnsl/LumaBoard