const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const tiltTarget = document.querySelector("[data-tilt]");

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
}

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  navLinks?.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks?.classList.toggle("is-open", !isOpen);
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("click", (event) => {
  if (!navLinks?.classList.contains("is-open")) return;
  if (event.target.closest("[data-menu-toggle]") || event.target.closest("[data-nav-links]")) return;
  closeMenu();
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -36px" },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-open-dialog]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dialog = document.getElementById(trigger.dataset.openDialog);
    dialog?.showModal();
  });
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog")?.close());
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

if (tiltTarget && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const mainPhoto = tiltTarget.querySelector(".photo-main");
  const smallPhoto = tiltTarget.querySelector(".photo-small");
  tiltTarget.addEventListener("pointermove", (event) => {
    const bounds = tiltTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    mainPhoto.style.transform = `rotate(${2.2 + x * 2.2}deg) translate(${x * 5}px, ${y * 5}px)`;
    smallPhoto.style.transform = `rotate(${-6 + x * 2}deg) translate(${-x * 4}px, ${-y * 4}px)`;
  });
  tiltTarget.addEventListener("pointerleave", () => {
    mainPhoto.style.transform = "";
    smallPhoto.style.transform = "";
  });
}
