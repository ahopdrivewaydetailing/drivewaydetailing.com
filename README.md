# Driveway Detailing — website

Static one-page site for Driveway Detailing Co., a student-owned, fully mobile car detailing business in North Dallas (Plano, Richardson, Allen, Frisco, McKinney, Addison, Carrollton, Dallas).

Files: `index.html`, `styles.css`, `script.js`, `images/`. No build step — open `index.html` in a browser.

Content comes from the business's Google Drive (logos, pricing/deal graphics, job photos and before/after comparisons) and Gmail (Google reviews, review link). License plates in customer photos are blurred.

## Settings (top of `script.js`)
- `QUOTE_EMAIL` — where booking requests from the form go
- `BOOKING_URL` — paste your Calendly link and every "Book" button opens it

## Updating photos
Add web-sized JPGs (about 1200px on the long side) to `images/` and add a `<figure>` to the `#work` gallery in `index.html`.

## Hosting
Works on any static host (GitHub Pages, Netlify, Cloudflare Pages). The request form opens the visitor's email app; for direct submissions, point it at Formspree.
