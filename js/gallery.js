
let photoEntries = [];
let activePhotoFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  loadPhotos();
});

async function loadPhotos() {
  const grid = document.getElementById("photoGrid");

  if (!grid) return;

  try {
    const response = await fetch("data/photo-archive.json");

    if (!response.ok) {
      throw new Error("Could not load photo archive.");
    }

    photoEntries = await response.json();

    setupPhotoFilters();
    renderPhotos();

  } catch (error) {
    console.error("Gallery error:", error);

    grid.innerHTML = `
      <p class="loading-message">
        The gallery could not be loaded. Please check data/photo-archive.json.
      </p>
    `;
  }
}

function setupPhotoFilters() {
  const grid = document.getElementById("photoGrid");

  if (!grid) return;

  let filters = document.getElementById("photoFilters");

  // Recreate the filter bar if it is missing.
  if (!filters) {
    filters = document.createElement("div");
    filters.id = "photoFilters";
    filters.className = "photo-filters";
    filters.setAttribute("aria-label", "Filter photos");

    grid.parentNode.insertBefore(filters, grid);
  }

  filters.hidden = false;

  // Restore the original filter options.
  filters.innerHTML = `
    <button class="photo-filter active" type="button" data-filter="all">
      All photos
    </button>

    <button class="photo-filter" type="button" data-filter="pageantry">
      Pageantry
    </button>

    <button class="photo-filter" type="button" data-filter="hosting">
      Hosting
    </button>

    <button class="photo-filter" type="button" data-filter="events">
      Events
    </button>

    <button class="photo-filter" type="button" data-filter="editorial">
      Editorial
    </button>
  `;

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

function renderPhotos() {
  const grid = document.getElementById("photoGrid");

  if (!grid) return;

  const filteredPhotos = photoEntries.filter((item) => {
    return (
      activePhotoFilter === "all" ||
      item.filterCategory === activePhotoFilter
    );
  });

  if (filteredPhotos.length === 0) {
    grid.innerHTML = `
      <p class="loading-message">
        No photos found in this category.
      </p>
    `;
    return;
  }

  grid.innerHTML = "";

  filteredPhotos.forEach((item) => {
    const card = document.createElement("a");

    card.className = "photo-card";

    card.href =
      `photo-category.html?category=${encodeURIComponent(item.id)}`;

    const image = document.createElement("img");

    image.src = item.cover;
    image.alt = item.alt || item.description || item.title;
    image.loading = "lazy";

    const caption = document.createElement("div");
    caption.className = "photo-caption";

    const title = document.createElement("strong");
    title.textContent = item.title;

    const label = document.createElement("span");
    label.textContent = item.label;

    const description = document.createElement("p");
    description.className = "photo-description";
    description.textContent = item.description || "";

    caption.append(title, label, description);

    card.append(image, caption);

    grid.appendChild(card);
  });
}
