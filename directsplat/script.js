const stageContent = [
  {
    kicker: "Capture volume",
    title: "Define the world to convert.",
    copy: "A configurable spatial bound identifies the level region that belongs in the final experience. Multiple regions can be combined while preserving world transforms and orientation.",
    tags: ["Volume aware", "Transform safe", "Multi-region"]
  },
  {
    kicker: "Spatial analysis",
    title: "Build a usable model of the level.",
    copy: "The plugin gathers relevant environment geometry, filters utility actors, and creates a compact spatial proxy for fast collision, visibility, and placement queries.",
    tags: ["Async gather", "Geometry filtering", "Collision proxy"]
  },
  {
    kicker: "Camera planning",
    title: "Generate coverage automatically.",
    copy: "The selected space is divided into adaptive cells. Layered, boundary, internal, and circular camera patterns are generated according to the shape and scale of each region.",
    tags: ["Layered cameras", "Cell-based", "Ring coverage"]
  },
  {
    kicker: "View validation",
    title: "Keep only useful viewpoints.",
    copy: "Depth, local geometry, surface direction, occlusion, and scene complexity are evaluated so empty, blocked, duplicated, or back-facing views can be rejected before capture.",
    tags: ["Occlusion checks", "Back-face rejection", "Complexity aware"]
  },
  {
    kicker: "Automated capture",
    title: "Move, settle, and capture.",
    copy: "A controlled editor workflow moves through the approved camera plan, waits for the viewport to become ready, records the required data, and reports progress without manual intervention.",
    tags: ["One click", "Viewport readiness", "Progress callbacks"]
  },
  {
    kicker: "Output optimization",
    title: "Reduce weight while protecting detail.",
    copy: "GPU simplification and hierarchical merging reduce redundancy across smooth surfaces while retaining edges, color changes, depth variation, and fine structural features.",
    tags: ["GPU compute", "Hierarchical merge", "LOD-ready"]
  },
  {
    kicker: "Web delivery",
    title: "Prepare the environment for the browser.",
    copy: "The completed spatial asset is organized into practical output profiles and handed to the connected web path, turning an Unreal environment into an interactive experience beyond the engine.",
    tags: ["Web-ready", "Portable output", "Interactive 3D"]
  }
];

const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (year) year.textContent = new Date().getFullYear();

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const reveals = document.querySelectorAll(".reveal");
if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px" });

  reveals.forEach((element, index) => {
    if (index < 6) element.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    revealObserver.observe(element);
  });
}

const pipeline = document.querySelector("[data-pipeline]");
const stageButtons = pipeline?.querySelectorAll("[data-stage]") ?? [];
const stageKicker = pipeline?.querySelector("[data-stage-kicker]");
const stageTitle = pipeline?.querySelector("[data-stage-title]");
const stageCopy = pipeline?.querySelector("[data-stage-copy]");
const stageTags = pipeline?.querySelector("[data-stage-tags]");

const setStage = (index) => {
  const content = stageContent[index];
  if (!content) return;

  stageButtons.forEach((button, buttonIndex) => {
    const active = index === buttonIndex;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  if (stageKicker) stageKicker.textContent = content.kicker;
  if (stageTitle) stageTitle.textContent = content.title;
  if (stageCopy) stageCopy.textContent = content.copy;
  if (stageTags) {
    stageTags.replaceChildren(...content.tags.map((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      return span;
    }));
  }
};

stageButtons.forEach((button) => {
  button.addEventListener("click", () => setStage(Number(button.dataset.stage)));
});

const canvas = document.querySelector("[data-particles]");
const context = canvas?.getContext("2d");

if (canvas && context && !reduceMotion.matches) {
  let width = 0;
  let height = 0;
  let frame = 0;
  let particles = [];

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(90, Math.max(35, Math.floor(width / 18)));
    particles = Array.from({ length: count }, (_, index) => ({
      x: width * (.44 + Math.random() * .54),
      y: height * (.2 + Math.random() * .62),
      radius: .45 + Math.random() * 1.5,
      speed: .08 + Math.random() * .24,
      drift: (Math.random() - .5) * .08,
      alpha: .1 + Math.random() * .55,
      phase: index * .35
    }));
  };

  const draw = (time) => {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.speed;
      particle.y += particle.drift + Math.sin(time * .0005 + particle.phase) * .025;

      if (particle.x > width + 5) particle.x = width * .42;

      const glow = context.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius * 5
      );
      glow.addColorStop(0, `rgba(82, 214, 255, ${particle.alpha})`);
      glow.addColorStop(1, "rgba(82, 214, 255, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.ellipse(particle.x, particle.y, particle.radius * 5, particle.radius * 2, .4, 0, Math.PI * 2);
      context.fill();
    });

    frame = requestAnimationFrame(draw);
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });
  frame = requestAnimationFrame(draw);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else frame = requestAnimationFrame(draw);
  });
}
