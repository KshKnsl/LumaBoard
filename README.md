# LumaBoard

LumaBoard is a personalized content dashboard built with Next.js, Redux, and Tailwind. It pulls in data from different places—like news, movies, and social media—and drops it all into one clean, customizable feed.

## Links
- **Live Demo:** https://luma-board.vercel.app/
- **Repository:** https://github.com/KshKnsl/LumaBoard

---

## What I Built

**1. Core Features**
- **Personalized Feed:** Users can pick their favorite categories in the settings. These preferences are saved automatically in local storage.
- **Data APIs:** I hooked up NewsAPI for news and TMDB for movies. For the social feed, I built a reliable mock data integration to filter tags and profiles since real social APIs are heavily rate-limited.
- **Interactive Cards:** Feed items are displayed as styled cards with images, text, and CTAs. Infinite scrolling/pagination is working out of the box.

**2. Dashboard Layout**
- Fully responsive design with a collapsible sidebar and a fixed top search area.
- Three main sections: the **Unified Feed**, a **Trending** tab, and your **Favorites**.

**3. Search**
- Search is fully implemented across all data sources, using a debounced input to prevent spamming the APIs.

**4. Advanced UI/UX**
- **Drag-and-Drop:** You can easily drag and reorder cards in your feed (powered by `@dnd-kit/core`).
- **Dark Mode:** Easily toggleable using native CSS variables.
- **Animations:** Used Framer Motion for smooth page transitions and hover effects.
- **Bonus:** Configured a Service Worker and manifest so it works natively as a PWA!

**5. State Management**
- **Redux Toolkit & RTK Query:** Handled all the global state, API fetching, and caching nicely so the UI doesn't stutter or double-fetch.

**Bonus: Auth**
- Added a simple mock login screen to block the dashboard and simulate a real user session.

### What I didn't get to (Not Implemented)
- **Testing:** I didn't write unit/E2E tests (Jest/Cypress). 
- **Real-time & i18n:** Skipped WebSockets and multi-language support to focus all my time on the core UI and architecture.

---

## Tech Stack
- Next.js (App Router)
- React 19 & TypeScript
- Redux Toolkit & RTK Query
- Tailwind CSS v4
- Framer Motion & dnd-kit

## How to run it locally

1. Install dependencies:
```bash
npm install 
# or pnpm install
```

2. Add your API keys. Create a `.env.local` file in the root directory:
```env
NEWS_API_KEY=your_newsapi_key_here
TMDB_API_KEY=your_tmdb_key_here
```

3. Start the dev server:
```bash
npm run dev
```
Then visit [http://localhost:3000](http://localhost:3000) in your browser.