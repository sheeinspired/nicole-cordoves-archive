let articleEntries = [];
let activeArticleFilter = "all";

function renderArticles() {
  const grid = document.getElementById("articlesGrid");
  const search = document.getElementById("articleSearch");
  const count = document.getElementById("articleCount");
  const empty = document.getElementById("articlesEmpty");
  if (!grid || !search || !count || !empty) return;

  const keyword = search.value.toLowerCase().trim();

  const filtered = articleEntries.filter((item) => {
    const matchesCategory = activeArticleFilter === "all" || item.categories.includes(activeArticleFilter);
    const searchable = `${item.title} ${item.description} ${item.publication} ${item.type}`.toLowerCase();
    return matchesCategory && searchable.includes(keyword);
  });

  grid.innerHTML = filtered.map((item) => `
    <article class="article-card">
      <div class="article-date">${item.year}<small>${item.date}</small></div>
      <div>
        <span class="article-category">${item.type}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="article-source">${item.publication}</span>
        <a class="article-link" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.linkLabel} ↗</a>
      </div>
    </article>
  `).join("");

  count.textContent = filtered.length;
  empty.hidden = filtered.length !== 0;
}

async function loadArticles() {
  try {
    const response = await fetch("data/articles.json");
    if (!response.ok) throw new Error("Could not load article data.");
    articleEntries = await response.json();
    renderArticles();
  } catch (error) {
    const grid = document.getElementById("articlesGrid");
    if (grid) grid.innerHTML = `<p class="loading-message">Articles could not be loaded. Please check the data folder.</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("articleSearch");
  const filters = document.getElementById("articleFilters");

  if (search) search.addEventListener("input", renderArticles);

  if (filters) {
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;

      activeArticleFilter = button.dataset.filter;
      filters.querySelectorAll(".article-filter").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      renderArticles();
    });
  }

  loadArticles();
});
