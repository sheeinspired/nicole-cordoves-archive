
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);

  const categoryId = params.get("category");
  const albumId = params.get("album");

  const title = document.getElementById("albumTitle");
  const categoryLabel = document.getElementById("albumCategory");
  const date = document.getElementById("albumDate");
  const location = document.getElementById("albumLocation");
  const description = document.getElementById("albumDescription");
  const photoGrid = document.getElementById("albumPhotoGrid");
  const photoCount = document.getElementById("photoCount");
  const photoEmpty = document.getElementById("photoEmpty");
  const categoryBack = document.getElementById("categoryBack");

  const lightbox = document.getElementById("photoLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let photos = [];
  let activePhoto = 0;

  // Update links back to the main Photos section.
  document.querySelectorAll('a[href="index.html#photos"]').forEach((link) => {
    link.href = "index.html?fromArchive=1#photos";
  });

  function showPhoto(index) {
    if (!photos.length) return;

    activePhoto = (index + photos.length) % photos.length;

    const photo = photos[activePhoto];

    lightboxImage.src = photo.image;
    lightboxImage.alt = photo.alt || "Nicole Cordoves";

    lightboxCaption.textContent = [
      photo.caption,
      photo.credit ? `Photo: ${photo.credit}` : ""
    ]
      .filter(Boolean)
      .join(" · ");

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lightbox-open");
  }

  lightboxClose.addEventListener("click", closeLightbox);

  lightboxPrev.addEventListener("click", () => {
    showPhoto(activePhoto - 1);
  });

  lightboxNext.addEventListener("click", () => {
    showPhoto(activePhoto + 1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
    if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
  });

  try {
    const response = await fetch("data/photo-archive.json");

    if (!response.ok) {
      throw new Error("Unable to load photo archive.");
    }

    const categories = await response.json();

    const category = categories.find(
      (item) => item.id === categoryId
    );

    if (!category) {
      title.textContent = "Collection not found";
      photoGrid.innerHTML = "";
      photoEmpty.hidden = false;
      return;
    }

    const album = (category.albums || []).find(
      (item) => item.id === albumId
    );

    if (!album) {
      title.textContent = "Album not found";
      photoGrid.innerHTML = "";
      photoEmpty.hidden = false;
      return;
    }

    document.title = `${album.title} | Nicole Cordoves Archive`;

    categoryLabel.textContent = category.label.toUpperCase();
    title.textContent = album.title;

    date.textContent = album.date || "";
    location.textContent = album.location || "";
    description.textContent = album.description || "";

    categoryBack.href =
      `photo-category.html?category=${encodeURIComponent(category.id)}`;

    photos = album.photos || [];

    photoCount.textContent =
      `${photos.length} ${photos.length === 1 ? "photograph" : "photographs"}`;

    photoGrid.innerHTML = "";

    if (photos.length === 0) {
      photoEmpty.hidden = false;
      return;
    }

    photoEmpty.hidden = true;

    photos.forEach((photo, index) => {
      const item = document.createElement("button");

      item.type = "button";
      item.className = "album-photo-card";
      item.setAttribute("aria-label", `View photograph ${index + 1}`);

      const image = document.createElement("img");

      image.src = photo.image;
      image.alt = photo.alt || "Nicole Cordoves";
      image.loading = "lazy";

      const caption = document.createElement("span");
      caption.textContent = photo.caption || "";

      item.append(image, caption);

      item.addEventListener("click", () => {
        showPhoto(index);
      });

      photoGrid.appendChild(item);
    });

  } catch (error) {
    console.error("Photo album error:", error);

    title.textContent = "Unable to load album";
    photoGrid.innerHTML = "";

    photoEmpty.hidden = false;
    photoEmpty.textContent =
      "Something went wrong while loading this album.";
  }
});
