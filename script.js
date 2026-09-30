// ---- Business settings ------------------------------------------------------
// Booking requests from the form are texted to this number.
const TEXT_NUMBER = "+17138186853";
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
const revealTargets = document.querySelectorAll(".price-card, .addons, .deals, .gallery figure, .ba-grid figure, .steps li, .reviews blockquote, details");
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

// Booking request form: validate, then open the visitor's texting app with the request
// filled in and addressed to TEXT_NUMBER, so it arrives on the business phone as a text.
const form = document.getElementById("quote-form");
const status = form.querySelector(".form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.className = "form-status";

  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    let ok = field.type === "checkbox" ? field.checked : field.value.trim() !== "" && field.checkValidity();
    if (field.name === "phone") ok = field.value.replace(/\D/g, "").length >= 10;
    field.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    status.textContent = "Please fill in your name, a valid phone number and your vehicle, and check the pricing box.";
    status.classList.add("err");
    return;
  }

  const data = new FormData(form);
  const body = [
    "New detail request from the website",
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Address: ${data.get("address") || "-"}`,
    `Vehicle: ${data.get("vehicle")}`,
    `Package: ${data.get("package")}`,
    data.get("message") ? `Notes: ${data.get("message")}` : "",
    "I understand prices may vary and the final price will be confirmed before work begins.",
  ].filter(Boolean).join("\n");

  // iPhones expect "&body=", everything else "?body=".
  const sep = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) ? "&" : "?";
  window.location.href = `sms:${TEXT_NUMBER}${sep}body=${encodeURIComponent(body)}`;

  status.innerHTML = 'Your texting app should open with your request ready &mdash; just hit send. ' +
    'Not opening? Text us at <a href="sms:' + TEXT_NUMBER + '">(713) 818-6853</a>.';
  status.classList.add("ok");
});

form.addEventListener("input", (e) => e.target.classList.remove("invalid"));
form.addEventListener("change", (e) => e.target.classList.remove("invalid"));
