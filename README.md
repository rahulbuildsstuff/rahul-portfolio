# Rahul Nalla – portfolio

A static site (`index.html`) plus one serverless function (`api/contact.js`) that emails contact-form messages.

## Files
- `index.html`   all pages, styles and scripts
- `avatar.jpg`   your portrait (replace with your own file, keep the name)
- `resume.pdf`   opens from every "Download resume" button
- `shots/`       project screenshots (Work page and Home banner); `og-image.jpg` and the favicon files are the link preview and tab icon
- `api/contact.js`  contact form backend (Gmail via Nodemailer)

## Before you go live (edit in index.html, search for the name)
1. `REPOS`   paste each project's exact GitHub repo URL (Work page + Home banner use these)
2. `SOCIAL`  set your X link (LinkedIn is already set)
3. `C` and `A` lists  these hold PLACEHOLDER certifications and hackathons (real course and event names, but not yours). Replace every entry and date with your own, or delete entries you don't have. Then set `PLACEHOLDERS` to false (the browser console shows a warning while it is true).
4. `OPEN_TO_INTERNSHIPS`  set to false to hide the internships line

## Set your website address (for Google and link previews)
In `index.html`, `robots.txt` and `sitemap.xml`, replace `https://rahul-portfolio.vercel.app` with your real address once you know it
(your Vercel project URL or your own domain). It appears in the canonical link, og:url, og:image, twitter:image and the JSON-LD block.

## Run locally
    npm install
    cp .env.example .env.local     # fill in your Gmail app password
    npx vercel dev                 # http://localhost:3000

## Deploy (free) on Vercel
1. Push this folder to a GitHub repo.
2. vercel.com > Add New > Project > import the repo. No build settings needed.
3. Settings > Environment Variables: add GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO (see .env.example). Redeploy.
4. Send yourself a test message from the Contact page.
