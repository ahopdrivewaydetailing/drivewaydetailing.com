# Driveway Detailing — website

Static one-page site for Driveway Detailing Co., a student-owned, fully mobile car detailing business in North Dallas (Plano, Richardson, Allen, Frisco, McKinney, Addison, Carrollton, Dallas).

Files: `index.html`, `styles.css`, `script.js`, `images/`. No build step — open `index.html` in a browser.

Content comes from the business's Google Drive (logos, pricing/deal graphics, job photos and before/after comparisons) and Gmail (Google reviews, review link). License plates in customer photos are blurred.

## Settings (top of `script.js`)
- `TEXT_NUMBER` — the phone number booking requests from the form are texted to
- `BOOKING_URL` — paste your Calendly link and every "Book" button opens it

## Adding before/after photos
Before & After sliders use a pair of photos per car: `images/ba-<name>-before.jpg` and `images/ba-<name>-after.jpg`. Copy a `<figure class="ba-slider">` block in `index.html` and point it at the new pair.

## Hosting
Works on any static host (GitHub Pages, Netlify, Cloudflare Pages). The request form opens the visitor's texting app with their request addressed to `TEXT_NUMBER`.
