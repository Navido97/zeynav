// =========================
// ja.js — Ja-Seite Logik
// =========================

// Hearts background wird bereits von main.js gestartet
// (spawnHearts via DOMContentLoaded)

// =========================
// Scroll-reveal für Gallery Cards
// =========================
function initCardReveal() {
  const cards = document.querySelectorAll(".card");
  if (!cards.length) return;

  // IntersectionObserver: Card wird sichtbar wenn sie ins Viewport kommt
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // einmal reicht
        }
      });
    },
    {
      threshold: 0.12,      // 12% sichtbar → trigger
      rootMargin: "0px 0px -40px 0px",
    }
  );

  cards.forEach((card) => observer.observe(card));
}

// =========================
// Auf dieser Seite kein Curtain — Content direkt zeigen
// =========================
document.body.classList.remove("intro");
document.body.classList.add("ready");

document.addEventListener("DOMContentLoaded", () => {
  initCardReveal();
});