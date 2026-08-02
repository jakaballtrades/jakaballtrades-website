# Jakab All Trades website foundation

## What is included
- A professional responsive home page
- A photography branch with portfolio categories and booking links
- A local stays branch
- An organized all-links directory that preserves the existing destinations
- Semantic HTML, accessible navigation, descriptive titles and meta descriptions
- Organization and photography Service structured data
- robots.txt, a sitemap template and a custom 404 page
- Temporary WebP image crops made from the supplied screenshots

## Before publishing
1. Replace every temporary image in `assets/images/` with the original high-resolution photograph using the same filename and dimensions/aspect ratio where practical.
2. Choose the final domain.
3. Add a canonical URL to every page.
4. Add absolute `og:url` and `og:image` values for social sharing.
5. Replace `YOUR-DOMAIN.com` in `sitemap-template.xml`, rename it to `sitemap.xml`, and add its absolute URL to `robots.txt`.
6. Add a Google Search Console verification tag after the property is created.
7. Add an email address, phone/text link and privacy policy before activating a lead form.
8. Replace the temporary “J” lettermark after the brand emblem is designed.
9. Verify every external destination and add the missing TikTok and Cash App links only when their exact public URLs are known.

## Recommended future photography pages
Create a separate page only when there are enough original images and useful text to make it worthwhile:
- `/photography/families/`
- `/photography/couples/`
- `/photography/children/`
- `/photography/weddings-events/`
- `/photography/branding/`

Each page should have a unique title, description, heading, written introduction, descriptive image filenames, helpful captions and a clear booking link.

## Search launch checklist
- Connect the final domain over HTTPS.
- Confirm every page returns HTTP 200 and the 404 page returns HTTP 404.
- Test the mobile menu and keyboard navigation.
- Run Lighthouse/PageSpeed Insights.
- Test structured data with Google Rich Results Test.
- Add the site to Google Search Console and Bing Webmaster Tools.
- Submit `sitemap.xml`.
- Request indexing for the home page and major branch pages.
- Keep adding original, useful content instead of creating thin placeholder pages.

## Hosting note
The site uses relative paths, so it can work on standard static hosting and GitHub Pages project sites. Keep the folder structure intact when uploading.
