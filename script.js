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
const revealTargets = document.querySelectorAll(".price-card, .addons, .deals, .gallery figure, .ba-grid figure, .steps li, details");
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

// Review wheel: arrows, drag and swipe move through the cards; cards fade and shrink
// the further they are from the visible window, like a scroll wheel.
const track = document.querySelector(".review-track");
if (track) {
  const cards = [...track.children];
  const prev = document.querySelector(".wheel-prev");
  const next = document.querySelector(".wheel-next");
  const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);

  const update = () => {
    const box = track.getBoundingClientRect();
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      // How far the card sits outside the visible window, in card widths (0 = fully inside).
      const outside = Math.max(box.left - r.left, r.right - box.right, 0) / r.width;
      const t = Math.min(outside, 1);
      card.style.opacity = String(1 - t * 0.85);
      card.style.transform = `scale(${1 - t * 0.12})`;
    });
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };

  prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
  next.addEventListener("click", () => track.scrollBy({ left: step() }));
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev.click(); }
  });

  // Click-and-drag on desktop (touch devices already swipe natively).
  let startX = 0, startScroll = 0, dragging = false, moved = false;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.target.closest("a, button")) return;
    dragging = true; moved = false; startX = e.clientX; startScroll = track.scrollLeft;
    track.classList.add("dragging"); track.setPointerCapture(e.pointerId);
  });
  track.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    if (Math.abs(e.clientX - startX) > 3) moved = true;
    track.scrollLeft = startScroll - (e.clientX - startX);
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false; track.classList.remove("dragging");
    // Snap to the nearest card after a drag.
    const s = step(); track.scrollTo({ left: Math.round(track.scrollLeft / s) * s });
  };
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("click", (e) => { if (moved) e.preventDefault(); }, true);

  // Cut long reviews to a few lines and add a "…" button that opens the full text.
  const dialog = document.querySelector(".review-dialog");
  const dialogBody = dialog.querySelector(".review-dialog-body");
  const refreshMoreButtons = () => {
    track.querySelectorAll(".review-text").forEach((text) => {
      const card = text.closest(".review-card");
      let btn = card.querySelector(".review-more");
      const cut = text.scrollHeight > text.clientHeight + 2;
      if (cut && !btn) {
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "review-more";
        btn.textContent = "\u2026";
        btn.setAttribute("aria-label", "Read the full review");
        btn.title = "Read the full review";
        btn.addEventListener("click", () => {
          dialogBody.replaceChildren(
            card.querySelector(".stars").cloneNode(true),
            Object.assign(document.createElement("p"), { textContent: text.textContent }),
            card.querySelector("cite").cloneNode(true)
          );
          dialog.showModal();
        });
        text.after(btn);
      } else if (!cut && btn) {
        btn.remove();
      }
    });
  };
  dialog.querySelector(".review-dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  refreshMoreButtons();
  window.addEventListener("resize", refreshMoreButtons);
  if (document.fonts) document.fonts.ready.then(refreshMoreButtons);

  track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  window.addEventListener("resize", update);
  update();
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
