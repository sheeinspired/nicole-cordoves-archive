document.addEventListener("DOMContentLoaded", () => {
  const byId = (id) => document.getElementById(id);

  // Intro screen
  const enterButton = byId("enterBtn");
  const intro = byId("intro");
  if (enterButton && intro) {
    enterButton.addEventListener("click", () => {
      intro.classList.add("hide");
      document.body.classList.remove("no-scroll");
    });
  }

  // Mobile navigation
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
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) closeMenu();
    });
  }

  // Reveal sections as they enter the viewport
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  function observeRevealElements() {
    document.querySelectorAll(".reveal:not(.show)").forEach((element) => revealObserver.observe(element));
  }

  observeRevealElements();
  window.observeArchiveReveals = observeRevealElements;

  // Active navigation state
  const sectionIds = ["home", "about", "journey", "career", "articles", "photos", "social", "contact"];
  const sections = sectionIds.map((id) => byId(id)).filter(Boolean);
  const navItems = document.querySelectorAll(".nav-link");

  function updateActiveNavigation() {
    const position = window.scrollY + 130;
    let activeId = "home";
    sections.forEach((section) => {
      if (position >= section.offsetTop && position < section.offsetTop + section.offsetHeight) {
        activeId = section.id;
      }
    });
    navItems.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
    });
  }

  window.addEventListener("scroll", updateActiveNavigation, { passive: true });
  window.addEventListener("load", updateActiveNavigation);
  updateActiveNavigation();

  // Footer year
  const year = byId("currentYear");
  if (year) year.textContent = new Date().getFullYear();
});
