
let photoEntries = [];
let activePhotoFilter = "all";

function renderPhotos() {
  const grid = document.getElementById("photoGrid");
  if (!grid) return;

  const filtered = photoEntries.filter((item) =>
    activePhotoFilter === "all" || item.category === activePhotoFilter
  );

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="loading-message">No photos found in this category.</p>`;
    return;
  }

  grid.innerHTML = filtered.map((item) => `
    <article class="photo-card">
      <img
        src="${item.image}"
        alt="${item.alt}"
        loading="lazy"
      >

      <div class="photo-caption">
        <strong>${item.title}</strong>
        <span>${item.label}</span>
      </div>
    </article>
  `).join("");
}

async function loadPhotos() {
  const grid = document.getElementById("photoGrid");
  if (!grid) return;

  try {
    const response = await fetch("data/photos.json");

    if (!response.ok) {
      throw new Error("Could not load photo data.");
    }

    photoEntries = await response.json();
    renderPhotos();

  } catch (error) {
    grid.innerHTML = `
      <p class="loading-message">
        The gallery could not be loaded. Please check data/photos.json.
      </p>
    `;

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
