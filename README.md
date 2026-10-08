# Noolthuli (நூல்துளி) — Kerala Saree Website

A static website with no backend, built with plain HTML, CSS and JavaScript. Customers order on WhatsApp (+91 63835 58387).
You can open `index.html` with a double-click, or host it free on Netlify, Cloudflare Pages or GitHub Pages.

## Files you edit

| File | What it holds |
|---|---|
| `js/config.js` | **Business details**: name, phone, WhatsApp, email, address, social links, UPI. Values still pending from the customer are marked ⏳. |
| `js/data.js` | **Products**: 26 real sarees (Plain ₹340, Zebra ₹490, Checked ₹510, Embroidery ₹750, Printed ₹1299) with measurements, categories, prices and alt text |
| `images/` | Logo, icons, QR code. Product photos are in `images/sarees/` (SEO file names, plus a `-600` small copy) |

All other files run on their own and need no changes.

```
index.html  products.html  product.html  checkout.html  contact.html  terms.html  policy.html  404.html
css/style.css
js/config.js  js/data.js  js/layout.js  js/cart.js  js/app.js  js/checkout.js
images/  sitemap.xml  robots.txt  favicon.ico  apple-touch-icon.png  scripts/check.py
```

---

## a) Free hosting

### Netlify (easiest, drag and drop)
1. Go to https://app.netlify.com/drop and log in (free).
2. Drag the whole `noolthuli` folder onto the page.
3. The site goes live at a link like `https://random-name.netlify.app`. To rename it, open **Site settings → Change site name** (for example `noolthuli`).
4. To update the site later, open **Deploys** and drag the folder in again.

### GitHub Pages
1. Create a free account at github.com, then a new **public** repository (for example `noolthuli`).
2. Choose **Add file → Upload files** and drag in everything inside the folder. Then click **Commit**.
3. Open **Settings → Pages → Source: Deploy from branch → main / (root)** and save.
4. The site goes live at `https://<username>.github.io/noolthuli/` within a minute or two.

### Cloudflare Pages
1. Go to dash.cloudflare.com, then **Workers & Pages → Create → Pages → Upload assets**.
2. Name the project and upload the folder. It goes live at `https://<name>.pages.dev`.

### Custom domain (for example noolthuli.com)
1. Buy the domain (GoDaddy, Hostinger, Cloudflare and others).
2. Netlify: **Domain management → Add domain**, then follow the DNS steps shown. Cloudflare Pages: **Custom domains → Set up**. GitHub: **Settings → Pages → Custom domain**.
3. HTTPS is switched on automatically.
4. Then update your domain in `js/config.js` → `siteUrl`, and replace `https://noolthuli.com` in every `.html` file (use "find and replace in all files" in VS Code). Finally run `python scripts/check.py`.

---

## b) Add, edit or remove a product

Open `js/data.js`. Each saree is one block:

```js
{
  id: "NT021", name: "New Kasavu Saree", category: "Printed Cotton",
  image: "images/nt021.webp", gallery: ["images/nt021-b.webp"],
  shortDescription: "One line shown on cards.",
  details: "Full description on the product page.",
  price: 1499, oldPrice: 1999, inStock: true, featured: false
},
```

- **To add one:** copy a block, paste it and change the values. The `id` must be new (NT021, NT022 and so on).
- **To edit one:** change the values. Prices are plain numbers, with no ₹ and no quotes.
- **To remove one:** delete the whole `{ ... },` block.
- **Out of stock:** `inStock: false`. The card shows a badge and the page shows a "Notify me on WhatsApp" button.
- **To show it in the home slider:** `featured: true`.
- **Photos:** put your photo in `/images` (WebP or JPG, portrait 3:4, about 900 px wide). Or use `U("unsplash-photo-id")` for an online photo.
- **Category:** use one of the names in `CATEGORIES` at the top of the file. You can also add a new name there.
- Keep it to **20 products or fewer** so the site stays fast.
- Afterwards, run `python scripts/check.py` (needs Python + Node.js). It rebuilds one SEO page per saree in `sarees/`, pre-renders the saree grid in `products.html`, updates `sitemap.xml` (with product photos) and warns about missing images, alt text or repeated ids. **Never edit files in `sarees/` by hand** — they are regenerated.

## c) Change the company name, phone number, email or UPI ID

Everything is in **`js/config.js`**. The header, footer, contact page, WhatsApp messages and PDF receipts all update automatically.

- `phone` is the number as it is displayed. `whatsapp` is digits only with the country code: `916383558387`.
- `email`, `address`, `landmark`, `city`, `mapsLink` and the `social` links are **empty for now (pending)**. Any field left empty is hidden on the site. Fill one in and it appears.
- **UPI is optional.** While `upiId` is `""`, checkout simply sends the order on WhatsApp and you share payment details in the chat. Once you set `upiId` (and `gpayNumber`), a "Pay now via GPay / UPI" option appears with a QR code, an amount and a screenshot upload. Replace `images/gpay-qr.webp` with your real QR code.
- **If the company name changes**, a few things are written into the HTML for Google and WhatsApp previews. Search for `update here if company name changes` and edit the `<title>`, the `meta` tags and the JSON-LD block in each `.html` file. The logo images are in `images/`.

---

## d) Pre-launch checklist

- [ ] Fill in the pending details in `js/config.js`: email, address, Maps link, social links
- [ ] (Optional) Set `upiId` and `gpayNumber`, and replace `images/gpay-qr.webp` with the real QR code
- [ ] Replace the sample Unsplash photos with **real photos of your sarees**, and check the names, prices and descriptions
- [ ] Set `siteUrl` and replace `https://noolthuli.com` in all `.html` files
- [ ] Run `python scripts/check.py` (regenerates `sarees/*.html`, `sitemap.xml` and `robots.txt`)
- [ ] Google Tag Manager `GTM-PPXWFGCL` is on every page — set up GA4 / Meta Pixel tags inside GTM
- [ ] Submit `sitemap.xml` in Google Search Console and create a Google Business Profile (Salem address)
- [ ] On a **real phone**, place a test order: add 3 sarees, check out, confirm that the PDF downloads and WhatsApp opens with the order
- [ ] Test the contact form and the WhatsApp buttons
- [ ] Share the link on WhatsApp and check that the preview shows the logo
- [ ] Add the site to Google Search Console and submit `sitemap.xml`
- [ ] Create a **Google Business Profile** and add the website link

---

### Notes
- **Photos:** the sample photos are free Unsplash images loaded live from images.unsplash.com. Replace them with your own product photos before launch.
- **PDF:** jsPDF loads from cdnjs only when someone downloads a receipt or quotation, so it needs internet. If the logo cannot be loaded (some browsers when the file is opened directly from the computer), the PDF is created without it. Once the site is hosted, the logo appears.
- **Privacy:** no data is stored on any server. The cart lives in the customer's browser and is cleared after the order.
- **Animations:** visitors who turn on "reduce motion" on their device get the site without the opening animation or the drape effect.
