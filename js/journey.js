async function loadJourney() {
  const container = document.getElementById("journeyTimeline");
  if (!container) return;

  try {
    const response = await fetch("data/journey.json");
    if (!response.ok) throw new Error("Could not load journey data.");
    const milestones = await response.json();

    container.innerHTML = milestones.map((item) => `
      <article class="timeline-item reveal">
        <div class="timeline-year">${item.year}</div>
        <div class="timeline-card">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <div class="timeline-tags">
            ${item.tags.map((tag) => `<span class="timeline-tag">${tag}</span>`).join("")}
          </div>
        </div>
      </article>
    `).join("");

    if (window.observeArchiveReveals) window.observeArchiveReveals();
  } catch (error) {
    container.innerHTML = `<p class="loading-message">The timeline could not be loaded. Please check that the site is being viewed through a local server.</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", loadJourney);
