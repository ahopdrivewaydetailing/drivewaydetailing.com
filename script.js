// Where quote requests are sent. Replace with your real business email.
const QUOTE_EMAIL = "info@drivewaydetailing.com";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Sticky header shadow
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const links = document.getElementById("nav-links");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
links.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

// Before/after slider
const compare = document.querySelector(".compare");
const slider = document.querySelector(".compare-slider");
slider.addEventListener("input", () => compare.style.setProperty("--pos", slider.value + "%"));

// Package buttons preselect the form option
const packageSelect = document.getElementById("package-select");
document.querySelectorAll("[data-package]").forEach((btn) => {
  btn.addEventListener("click", () => { packageSelect.value = btn.dataset.package; });
});

// Reveal-on-scroll and count-up stats
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(".card, .price-card, .steps li, .gallery figure, .reviews blockquote, details");
const counters = document.querySelectorAll("[data-count]");

function countUp(el) {
  const target = Number(el.dataset.count);
  const suffix = "+";
  if (reduceMotion) { el.textContent = target.toLocaleString() + suffix; return; }
  const start = performance.now();
  const duration = 1400;
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased).toLocaleString() + (t === 1 ? suffix : "");
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (entry.target.dataset.count) countUp(entry.target);
      else entry.target.classList.add("visible");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  revealTargets.forEach((el) => io.observe(el));
  counters.forEach((el) => io.observe(el));
} else {
  counters.forEach(countUp);
}

// Quote form: validate, then open the visitor's email app with the details filled in.
// To receive submissions without email apps, point the form at a service like Formspree or Netlify Forms.
const form = document.getElementById("quote-form");
const status = form.querySelector(".form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.className = "form-status";

  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const ok = field.value.trim() !== "" && field.checkValidity();
    field.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    status.textContent = "Please fill in your name, phone, and a valid email.";
    status.classList.add("err");
    return;
  }

  const data = new FormData(form);
  const body = [
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Email: ${data.get("email")}`,
    `Address: ${data.get("address") || "-"}`,
    `Surface: ${data.get("surface")}`,
    `Package: ${data.get("package")}`,
    "",
    `${data.get("message") || ""}`,
  ].join("\n");

  const subject = `Quote request - ${data.get("name")}`;
  window.location.href = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.textContent = "Thanks! Your email app should open with your request ready to send.";
  status.classList.add("ok");
});

form.addEventListener("input", (e) => e.target.classList.remove("invalid"));
