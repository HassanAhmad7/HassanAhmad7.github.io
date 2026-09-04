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

const canvas = document.querySelector("[data-hero-canvas]");
const context = canvas?.getContext("2d");

if (canvas && context && !reduceMotion.matches) {
  let width = 0;
  let height = 0;
  let frame = 0;
  let points = [];

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(130, Math.max(60, Math.floor(width / 12)));
    points = Array.from({ length: count }, (_, index) => ({
      x: width * (.57 + Math.random() * .42),
      y: height * (.12 + Math.random() * .76),
      rx: .8 + Math.random() * 2.8,
      ry: .35 + Math.random() * 1.1,
      vx: -.08 - Math.random() * .18,
      vy: (Math.random() - .5) * .09,
      alpha: .08 + Math.random() * .5,
      phase: index * .27,
      hue: Math.random() > .78 ? "67, 143, 255" : "118, 231, 255"
    }));
  };

  const draw = (time) => {
    context.clearRect(0, 0, width, height);
    points.forEach((point) => {
      point.x += point.vx;
      point.y += point.vy + Math.sin(time * .00045 + point.phase) * .02;
      if (point.x < width * .48) point.x = width + 8;

      const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.rx * 6);
      glow.addColorStop(0, `rgba(${point.hue}, ${point.alpha})`);
      glow.addColorStop(1, `rgba(${point.hue}, 0)`);
      context.fillStyle = glow;
      context.beginPath();
      context.ellipse(point.x, point.y, point.rx * 6, point.ry * 6, -.25, 0, Math.PI * 2);
      context.fill();
    });
    frame = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });
  frame = requestAnimationFrame(draw);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else frame = requestAnimationFrame(draw);
  });
}
