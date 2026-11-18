
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get("category");

  const title = document.getElementById("categoryTitle");
  const label = document.getElementById("categoryLabel");
  const description = document.getElementById("categoryDescription");
  const albumGrid = document.getElementById("albumGrid");
  const albumCount = document.getElementById("albumCount");
  const albumEmpty = document.getElementById("albumEmpty");

  // Return directly to the Photos section, skipping the intro.
  document.querySelectorAll('a[href="index.html#photos"]').forEach((link) => {
    link.href = "index.html?fromArchive=1#photos";
  });

  try {
    const response = await fetch("data/photo-archive.json");

    if (!response.ok) {
      throw new Error("Unable to load archive.");
    }

    const categories = await response.json();

    const category = categories.find(
      (item) => item.id === categoryId
    );

    if (!category) {
      document.title = "Collection Not Found | Nicole Cordoves";

      title.textContent = "Collection not found.";
      label.textContent = "PHOTO ARCHIVE";
      description.textContent =
        "The requested collection could not be found.";

      albumGrid.innerHTML = "";
      albumCount.textContent = "0 albums";
      albumEmpty.hidden = false;
      return;
    }

    document.title = `${category.title} | Nicole Cordoves Archive`;

    label.textContent = category.label.toUpperCase();
    title.textContent = category.title;
    description.textContent = category.description;

    const albums = category.albums || [];

    albumCount.textContent =
      `${albums.length} ${albums.length === 1 ? "album" : "albums"}`;

    albumGrid.innerHTML = "";

    if (albums.length === 0) {
      albumEmpty.hidden = false;
      return;
    }

    albumEmpty.hidden = true;

    albums.forEach((album) => {
      const card = document.createElement("a");

      card.className = "archive-album-card";

      card.href =
        `photo-album.html?category=${encodeURIComponent(category.id)}&album=${encodeURIComponent(album.id)}`;

      const image = document.createElement("img");

      image.src =
        album.cover ||
        (album.photos && album.photos.length
          ? album.photos[0].image
          : "");

      image.alt = album.title;
      image.loading = "lazy";

      const content = document.createElement("div");
      content.className = "archive-album-info";

      const date = document.createElement("span");
      date.className = "archive-album-date";
      date.textContent = album.date || "";

      const heading = document.createElement("h3");
      heading.textContent = album.title;

      const location = document.createElement("p");
      location.textContent = album.location || "";

      const arrow = document.createElement("span");
      arrow.className = "archive-album-arrow";
      arrow.textContent = "↗";

      content.append(date, heading, location, arrow);
      card.append(image, content);

      albumGrid.appendChild(card);
    });

  } catch (error) {
    console.error("Category archive error:", error);

    title.textContent = "Unable to load collection";
    albumGrid.innerHTML = "";

    albumEmpty.hidden = false;
    albumEmpty.textContent =
      "Something went wrong while loading this collection.";
  }
});
