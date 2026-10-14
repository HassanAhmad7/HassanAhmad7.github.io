const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (year) year.textContent = new Date().getFullYear();

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const reveals = document.querySelectorAll(".reveal");
if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .13, rootMargin: "0px 0px -45px" });

  reveals.forEach((element, index) => {
    if (index < 5) element.style.transitionDelay = `${Math.min(index * 75, 250)}ms`;
    observer.observe(element);
  });
}

const reel = document.querySelector("[data-project-reel]");
const previousProject = document.querySelector("[data-reel-prev]");
const nextProject = document.querySelector("[data-reel-next]");

const scrollReel = (direction) => {
  if (!reel) return;
  reel.scrollBy({
    left: direction * Math.min(reel.clientWidth * .72, 720),
    behavior: reduceMotion.matches ? "auto" : "smooth"
  });
};

previousProject?.addEventListener("click", () => scrollReel(-1));
nextProject?.addEventListener("click", () => scrollReel(1));
