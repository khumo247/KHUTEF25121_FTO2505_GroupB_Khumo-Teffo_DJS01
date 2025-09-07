// =====================
// Podcast App — Final JS (matches wireframes)
// =====================

/**
 * Represents a podcast.
 * @class
 */
class Podcast {
  /**
   * @param {Object} o
   * @param {number} o.id
   * @param {string} o.title
   * @param {string} o.cover
   * @param {string} o.description
   * @param {string[]} o.genres
   * @param {{title:string, description:string, episodes:number}[]} o.seasons
   * @param {string|Date} o.updated
   * @param {number} o.popularity
   */
  constructor(o) {
    Object.assign(this, o);
    this.updated = new Date(o.updated);
  }
  /** @returns {number} */
  getSeasonCount() { return this.seasons.length; }

  /** Human-friendly "Updated …" string (landing cards). */
  getLastUpdatedHuman() {
    const days = Math.floor((Date.now() - this.updated) / 86400000);
    if (days <= 0) return "Updated today";
    if (days === 1) return "Updated yesterday";
    if (days < 7) return `Updated ${days} days ago`;
    const weeks = Math.floor(days / 7);
    return `Updated ${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  /** Full date for modal. */
  getFullDate() {
    return this.updated.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }
}

// ---------- Sample Data (8 shows for grid like wireframe) ----------
const podcasts = [
  new Podcast({
    id: 1,
    title: "Tech Talks Daily",
    cover: "cover1.jpg",
    description: "Deep dives into technology trends, AI, and digital transformation with expert interviews and case studies.",
    genres: ["Technology", "Business"],
    seasons: [
      { title: "Season 1: Getting Started", description: "Introduction to the fundamentals", episodes: 12 },
      { title: "Season 2: Advanced Topics", description: "Deep dives into complex subjects", episodes: 15 },
      { title: "Season 3: Industry Insights", description: "Expert perspectives and case studies", episodes: 18 },
      { title: "Season 4: Future Trends", description: "What's coming next in tech", episodes: 20 },
    ],
    updated: "2025-01-15",
    popularity: 95,
  }),
  new Podcast({
    id: 2,
    title: "Crime Junkie",
    cover: "cover2.jpg",
    description: "True crime stories, investigations, and mysteries that keep you on the edge.",
    genres: ["True Crime", "Mystery"],
    seasons: [
      { title: "Season 1: Dark Stories", description: "Chilling cases that shocked the world", episodes: 20 },
      { title: "Season 2: Cold Cases", description: "Unsolved crimes revisited", episodes: 18 },
    ],
    updated: daysAgo(7),
    popularity: 88,
  }),
  new Podcast({
    id: 3,
    title: "Comedy Bang Bang",
    cover: "cover3.jpg",
    description: "Improvised comedy and interviews with a rotating cast of characters.",
    genres: ["Comedy", "Entertainment"],
    seasons: [{ title: "Season 1", description: "Sketches and bits", episodes: 22 }],
    updated: daysAgo(3),
    popularity: 82,
  }),
  new Podcast({
    id: 4,
    title: "How I Built This",
    cover: "cover4.jpg",
    description: "Founders tell the stories behind the movements they built.",
    genres: ["Business", "Entrepreneurship"],
    seasons: [{ title: "Season 1", description: "Origin stories", episodes: 18 }],
    updated: daysAgo(5),
    popularity: 91,
  }),
  new Podcast({
    id: 5,
    title: "The Daily Meditation",
    cover: "cover5.jpg",
    description: "Mindfulness practices and talks for everyday calm.",
    genres: ["Health", "Lifestyle"],
    seasons: [{ title: "Season 1", description: "Breathe and relax", episodes: 30 }],
    updated: daysAgo(1),
    popularity: 70,
  }),
  new Podcast({
    id: 6,
    title: "Hardcore History",
    cover: "cover6.jpg",
    description: "Long-form explorations of pivotal moments and people.",
    genres: ["History", "Education"],
    seasons: [{ title: "Season 1", description: "Ancient wars", episodes: 10 }],
    updated: daysAgo(4),
    popularity: 99,
  }),
  new Podcast({
    id: 7,
    title: "The Sports Desk",
    cover: "cover7.jpg",
    description: "Analysis and interviews from across the sports world.",
    genres: ["Sports", "News"],
    seasons: [{ title: "Season 1", description: "Weekly recaps", episodes: 24 }],
    updated: daysAgo(6),
    popularity: 76,
  }),
  new Podcast({
    id: 8,
    title: "Curious Minds",
    cover: "cover8.jpg",
    description: "Science explained through engaging stories and experiments.",
    genres: ["Science", "Nature"],
    seasons: [{ title: "Season 1", description: "Everyday science", episodes: 16 }],
    updated: daysAgo(8),
    popularity: 85,
  }),
];

function daysAgo(n){ const d=new Date(); d.setDate(d.getDate()-n); return d; }

// ---------- DOM ----------
const grid = document.querySelector(".podcast-grid");
const modal = document.getElementById("podcast-modal");
const modalPanel = modal.querySelector(".modal-panel");
const modalInner = modal.querySelector(".modal-inner");
const closeBtn = modal.querySelector(".close-modal");
const genreFilter = document.getElementById("genre-filter");
const sortFilter = document.getElementById("sort-filter");

// ---------- Rendering ----------
/** Renders all visible podcast cards. */
function renderPodcasts(list){
  grid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "podcast-card";
    card.innerHTML = `
      <div class="cover-placeholder">Podcast Cover</div>
      <div class="podcast-info">
        <h2>${p.title}</h2>
        <p class="meta">
          ${calendarSVG()}
          <span>${p.getSeasonCount()} ${p.getSeasonCount() === 1 ? "season" : "seasons"}</span>
        </p>
        <div class="tags">${p.genres.map(g=>`<span class="tag">${g}</span>`).join("")}</div>
        <p class="update">${p.getLastUpdatedHuman()}</p>
      </div>
    `;
    card.addEventListener("click", () => openModal(p));
    grid.appendChild(card);
  });
}

/** Opens modal populated like the wireframe. */
function openModal(p){
  modalInner.innerHTML = `
    <h2 id="modal-title" class="modal-title">${p.title}</h2>
    <div class="modal-top">
      <div class="large-cover">Large Cover Image</div>
      <div>
        <div class="section-title">Description</div>
        <p class="description">${p.description}</p>

        <div class="section-title">Genres</div>
        <div class="modal-tags">${p.genres.map(g=>`<span class="tag">${g}</span>`).join("")}</div>

        <div class="modal-updated">
          ${calendarSVG()}
          <span>Last updated: ${p.getFullDate()}</span>
        </div>
      </div>
    </div>

    <div class="seasons">
      <h3>Seasons</h3>
      <ul class="season-list">
        ${p.seasons.map(s => `
          <li class="season-row">
            <div class="season-meta">
              <div class="season-title">${s.title}</div>
              <div class="season-desc">${s.description ?? ""}</div>
            </div>
            <span class="episodes-count">${s.episodes} episodes</span>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
  showModal();
}

function showModal(){ modal.classList.add("show"); modal.setAttribute("aria-hidden","false"); }
function hideModal(){ modal.classList.remove("show"); modal.setAttribute("aria-hidden","true"); }

/** Filter by genre (All Genres returns all). */
function filterByGenre(list, genre){
  if (!genre || genre === "All Genres") return list;
  return list.filter(p => p.genres.includes(genre));
}

/** Sort by dropdown choice. */
function sortList(list, type){
  const arr = [...list];
  if (type === "Most Popular") return arr.sort((a,b)=>b.popularity-a.popularity);
  if (type === "Newest") return arr.sort((a,b)=>b.updated-a.updated);
  // Recently Updated (default)
  return arr.sort((a,b)=>b.updated-a.updated);
}

/** Populate genre dropdown with unique values. */
function populateGenres(){
  const set = new Set();
  podcasts.forEach(p => p.genres.forEach(g => set.add(g)));
  const opts = ["All Genres", ...Array.from(set)];
  genreFilter.innerHTML = opts.map(g => `<option${g==="All Genres"?" selected":""}>${g}</option>`).join("");
}

/** Re-render based on current controls. */
function updateUI(){
  const genre = genreFilter.value;
  const sortType = sortFilter.value;
  const filtered = filterByGenre(podcasts, genre);
  const sorted = sortList(filtered, sortType);
  renderPodcasts(sorted);
}

// ---------- Events ----------
closeBtn.addEventListener("click", hideModal);
modal.addEventListener("click", (e)=>{ if(e.target === modal) hideModal(); });
document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") hideModal(); });
genreFilter.addEventListener("change", updateUI);
sortFilter.addEventListener("change", updateUI);

// ---------- Icons ----------
function calendarSVG(){
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M16 3v4M8 3v4M3 11h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

// ---------- Init ----------
populateGenres();
updateUI();
