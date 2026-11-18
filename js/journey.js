
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

    // Set up a separate scroll observer for timeline entries.
    const timelineItems = container.querySelectorAll(".timeline-item");

    if (!("IntersectionObserver" in window)) {
      timelineItems.forEach((item) => {
        item.classList.add("show");
      });
      return;
    }

    const timelineObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    timelineItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 0.06, 0.3)}s`;
      timelineObserver.observe(item);
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
