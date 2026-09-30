// ---- Business settings ------------------------------------------------------
// Where booking requests from the form are sent.
const QUOTE_EMAIL = "ahopdrivewaydetailing@gmail.com";
// Paste your Calendly booking link here (e.g. "https://calendly.com/your-name/mobile-detail")
// and every "Book" button will open it. Leave empty to send people to the request form.
const BOOKING_URL = "https://calendly.com/ahopdrivewaydetailing/bookadetail";
// -----------------------------------------------------------------------------

document.getElementById("year").textContent = new Date().getFullYear();

// Booking link
if (BOOKING_URL) {
  document.querySelectorAll("[data-book]").forEach((a) => {
    a.href = BOOKING_URL;
    a.target = "_blank";
    a.rel = "noopener";
  });
  const bookingBtn = document.querySelector("[data-booking-link]");
  bookingBtn.href = BOOKING_URL;
  bookingBtn.hidden = false;
}

// Package buttons preselect the form option
const packageSelect = document.getElementById("package-select");
document.querySelectorAll("[data-package]").forEach((btn) => {
  btn.addEventListener("click", () => { packageSelect.value = btn.dataset.package; });
});

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

// Reveal on scroll
const revealTargets = document.querySelectorAll(".price-card, .addons, .deals, .gallery figure, .steps li, .reviews blockquote, details");
if ("IntersectionObserver" in window) {
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  revealTargets.forEach((el) => io.observe(el));
}

// Booking request form: validate, then open the visitor's email app with the details filled in.
// To receive submissions without an email app, point the form at a service like Formspree.
const form = document.getElementById("quote-form");
const status = form.querySelector(".form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.className = "form-status";

  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const ok = field.type === "checkbox" ? field.checked : field.value.trim() !== "" && field.checkValidity();
    field.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    status.textContent = "Please fill in your name, phone, email and vehicle, and check the pricing box.";
    status.classList.add("err");
    return;
  }

  const data = new FormData(form);
  const body = [
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Email: ${data.get("email")}`,
    `Service address: ${data.get("address") || "-"}`,
    `Vehicle: ${data.get("vehicle")}`,
    `Package: ${data.get("package")}`,
    "",
    `${data.get("message") || ""}`,
    "",
    "I understand listed prices are starting estimates and the final price will be confirmed before work begins.",
  ].join("\n");

  const subject = `Mobile detail request - ${data.get("name")} (${data.get("vehicle")})`;
  window.location.href = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.textContent = "Thanks! Your email app should open with your request ready to send.";
  status.classList.add("ok");
});

form.addEventListener("input", (e) => e.target.classList.remove("invalid"));
form.addEventListener("change", (e) => e.target.classList.remove("invalid"));
