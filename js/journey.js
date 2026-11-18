
async function loadJourney() {
  const container = document.getElementById("journeyTimeline");
  if (!container) return;

  try {
    const response = await fetch("data/journey.json");

    if (!response.ok) {
      throw new Error("Could not load journey data.");
    }

    const milestones = await response.json();

    container.innerHTML = milestones.map((item) => `
      <article class="timeline-item reveal">
        <div class="timeline-year">${item.year}</div>

        <div class="timeline-card">
          <h3>${item.title}</h3>
          <p>${item.description}</p>

          <div class="timeline-tags">
            ${item.tags.map((tag) =>
              `<span class="timeline-tag">${tag}</span>`
            ).join("")}
          </div>
        </div>
      </article>
    `).join("");

    const timelineItems = container.querySelectorAll(".timeline-item");

    // Fallback for browsers without IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      timelineItems.forEach((item) => item.classList.add("show"));
      return;
    }

    // Independent observer for timeline animation
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px -20px 0px"
    });

    timelineItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 0.08, 0.32)}s`;
      observer.observe(item);
    });

  } catch (error) {
    container.innerHTML = `
      <p class="loading-message">
        The timeline could not be loaded. Please check data/journey.json.
      </p>
    `;

    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", loadJourney);
