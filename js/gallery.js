let photoEntries = [];
let activePhotoFilter = "all";

function renderPhotos() {
  const grid = document.getElementById("photoGrid");
  if (!grid) return;

  const filtered = photoEntries.filter((item) =>
    activePhotoFilter === "all" || item.category === activePhotoFilter
  );

  grid.innerHTML = filtered.map((item, index) => `
    <article class="photo-card">
      <div class="photo-placeholder" aria-hidden="true">
        ${String(index + 1).padStart(2, "0")}
      </div>
      <img src="${item.image}" alt="${item.alt}" loading="lazy"
        onerror="this.style.display='none'">
      <div class="photo-caption">
        <strong>${item.title}</strong>
        <span>${item.label}</span>
      </div>
    </article>
  `).join("");
}

async function loadPhotos() {
  try {
    const response = await fetch("data/photos.json");
    if (!response.ok) throw new Error("Could not load photo data.");
    photoEntries = await response.json();
    renderPhotos();
  } catch (error) {
    const grid = document.getElementById("photoGrid");
    if (grid) grid.innerHTML = `<p class="loading-message">The gallery could not be loaded. Please check data/photos.json.</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const filters = document.getElementById("photoFilters");
  if (filters) {
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;

      activePhotoFilter = button.dataset.filter;
      filters.querySelectorAll(".photo-filter").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      renderPhotos();
    });
  }
  loadPhotos();
});
