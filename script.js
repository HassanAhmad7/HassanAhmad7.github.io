const body = document.body;
const loader = document.querySelector("[data-loader]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Loading screen ---------- */
const LOADER_MS = reduceMotion ? 200 : 2300;
const finishLoading = () => {
  loader?.classList.add("is-done");
  body.classList.remove("is-loading");
  body.classList.add("is-ready");
};
// Kick off the loader's entrance on the next painted frame.
requestAnimationFrame(() => requestAnimationFrame(() => loader?.classList.add("is-in")));
// Start the clock once fonts are ready (or shortly after DOM ready), not after every image.
const start = () => setTimeout(finishLoading, LOADER_MS);
if (document.fonts?.ready) {
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(start);
} else {
  start();
}
// Safety net.
setTimeout(finishLoading, LOADER_MS + 3000);

/* ---------- Rotating role under the name ---------- */
const rotator = document.querySelector("[data-rotator]");
if (rotator && !reduceMotion) {
  const items = [...rotator.children];
  let i = 0;
  setInterval(() => {
    items[i].classList.remove("is-active");
    i = (i + 1) % items.length;
    items[i].classList.add("is-active");
  }, 2600);
}

/* ---------- Hero category cards: cycle images ---------- */
const SLIDE_MS = 4500;
document.documentElement.style.setProperty("--slide-ms", `${SLIDE_MS}ms`);

document.querySelectorAll("[data-card]").forEach((card, cardIndex) => {
  const slides = [...card.querySelectorAll("[data-slide]")];
  const sub = card.querySelector("[data-card-sub]");
  const dots = card.querySelector("[data-card-dots]");
  if (slides.length < 2 || !dots) return;

  dots.innerHTML = slides.map(() => "<i></i>").join("");
  const dotEls = [...dots.children];
  let i = 0;

  const show = (n) => {
    slides[i].classList.remove("is-active");
    dotEls[i].classList.remove("is-active");
    i = n;
    slides[i].classList.add("is-active");
    // Restart the progress animation on the dot.
    dotEls[i].classList.remove("is-active");
    void dotEls[i].offsetWidth;
    dotEls[i].classList.add("is-active");
    if (sub) sub.textContent = slides[i].dataset.slide;
  };

  // Stagger the start so the three cards don't flip in unison.
  setTimeout(() => {
    dotEls[0].classList.add("is-active");
    if (!reduceMotion) setInterval(() => show((i + 1) % slides.length), SLIDE_MS);
  }, cardIndex * 1100);
});

/* ---------- Dock: highlight the current section ---------- */
const navLinks = [...document.querySelectorAll("[data-nav]")];
const targets = navLinks
  .map((link) => document.getElementById(link.dataset.nav))
  .filter(Boolean);

if ("IntersectionObserver" in window && targets.length) {
  const setActive = (id) => navLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.nav === id));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  targets.forEach((target) => observer.observe(target));
}
