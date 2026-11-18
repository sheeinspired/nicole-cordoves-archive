
// Prevent the browser from restoring the previous scroll position.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

document.addEventListener("DOMContentLoaded", () => {
  const byId = (id) => document.getElementById(id);

  // INTRO SCREEN
  const enterButton = byId("enterBtn");
  const intro = byId("intro");

  const params = new URLSearchParams(window.location.search);
  const returningFromArchive = params.get("fromArchive") === "1";

  function scrollToPhotosAfterContentLoads() {
    const sectionsToCheck = [
      byId("journeyTimeline"),
      byId("careerGrid"),
      byId("articlesGrid")
    ].filter(Boolean);

    const startTime = Date.now();

    function checkContent() {
      const stillLoading = sectionsToCheck.some((section) =>
        section.querySelector(".loading-message")
      );

      const timedOut = Date.now() - startTime > 6000;

      if (stillLoading && !timedOut) {
        setTimeout(checkContent, 100);
        return;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const photosSection = byId("photos");

          if (!photosSection) return;

          document.documentElement.style.scrollBehavior = "auto";

          const photosPosition =
            photosSection.getBoundingClientRect().top + window.scrollY;

          window.scrollTo(0, photosPosition);

          updateActiveNavigation();

          history.replaceState(
            null,
            "",
            window.location.pathname + "#photos"
          );
        });
      });
    }

    checkContent();
  }

  if (returningFromArchive) {
    if (intro) {
      intro.classList.add("hide");
    }

    document.body.classList.remove("no-scroll");

    // Wait for the page content before scrolling.
    scrollToPhotosAfterContentLoads();

  } else if (enterButton && intro) {
    enterButton.addEventListener("click", () => {
      intro.classList.add("hide");
      document.body.classList.remove("no-scroll");
    });
  }

  // MOBILE NAVIGATION
  const menuToggle = byId("menuToggle");
  const navLinks = byId("navLinks");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) closeMenu();
    });
  }

  // REVEAL SECTIONS
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    function observeRevealElements() {
      document.querySelectorAll(".reveal:not(.show)").forEach((element) => {
        revealObserver.observe(element);
      });
    }

    observeRevealElements();
    window.observeArchiveReveals = observeRevealElements;

  } else {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("show");
    });
  }

  // ACTIVE NAVIGATION STATE
  const sectionIds = [
    "home",
    "about",
    "journey",
    "career",
    "articles",
    "photos",
    "social",
    "contact"
  ];

  const sections = sectionIds
    .map((id) => byId(id))
    .filter(Boolean);

  const navItems = document.querySelectorAll(".nav-link");

  function updateActiveNavigation() {
    const position = window.scrollY + 130;
    let activeId = "home";

    sections.forEach((section) => {
      if (
        position >= section.offsetTop &&
        position < section.offsetTop + section.offsetHeight
      ) {
        activeId = section.id;
      }
    });

    navItems.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${activeId}`
      );
    });
  }

  window.addEventListener("scroll", updateActiveNavigation, {
    passive: true
  });

  window.addEventListener("load", updateActiveNavigation);

  updateActiveNavigation();

  // FOOTER YEAR
  const year = byId("currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
