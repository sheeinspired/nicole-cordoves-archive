
async function loadCareerCards() {
  const container = document.getElementById("careerGrid");
  if (!container) return;

  try {
    const response = await fetch("data/career.json");
    if (!response.ok) throw new Error("Could not load career data.");
    const careers = await response.json();

    container.innerHTML = careers.map((item) => `
      <article class="career-card reveal">
        <div class="career-card-art">
          <img
            src="${item.image}"
            alt="${item.category} - Nicole Cordoves"
            loading="lazy"
          >
        </div>

        <div class="career-card-body">
          <span class="card-number">${item.number} · ${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <a class="career-card-link" href="${item.link}">${item.linkLabel}</a>
        </div>
      </article>
    `).join("");

    if (window.observeArchiveReveals) {
      window.observeArchiveReveals();
    }

  } catch (error) {
    container.innerHTML = `
      <p class="loading-message">
        Career cards could not be loaded. Please check the data folder.
      </p>
    `;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", loadCareerCards);
