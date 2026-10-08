"""
Noolthuli — build + check helper (needs Python 3 and Node.js, no extra packages).

    python scripts/check.py

What it does:
  1. Reads js/config.js (business details) and js/data.js (products) through Node
  2. Warns about duplicate product ids and missing images
  3. Builds one crawlable page per saree:  sarees/<photo-name>.html
     (real title, description, price, photo, Google product data and WhatsApp preview)
  4. Pre-renders the saree grid inside products.html so Google sees every saree
  5. Rebuilds sitemap.xml (with product photos for Google Images) and robots.txt
Run it every time you add / remove / edit products or change the domain.
"""
import html
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = "sarees"


def path(*p):
    return os.path.join(ROOT, *p)


def read(p):
    with open(path(p), encoding="utf8") as f:
        return f.read()


def write(p, text):
    with open(path(p), "w", encoding="utf8", newline="\n") as f:
        f.write(text)


def load_data():
    js = ("const fs=require('fs');eval(fs.readFileSync('js/config.js','utf8')+fs.readFileSync('js/data.js','utf8')+"
          "';process.stdout.write(JSON.stringify({S:SITE,P:PRODUCTS,C:CATEGORIES}))');")
    try:
        out = subprocess.run(["node", "-e", js], cwd=ROOT, capture_output=True, text=True, encoding="utf8", check=True).stdout
    except FileNotFoundError:
        sys.exit("! Node.js is needed: install it from https://nodejs.org and run again.")
    except subprocess.CalledProcessError as e:
        sys.exit("! js/config.js or js/data.js has an error:\n" + e.stderr)
    d = json.loads(out)
    return d["S"], d["P"], d["C"]


SITE, PRODUCTS, CATEGORIES = load_data()
site = SITE.get("siteUrl", "https://noolthuli.com").rstrip("/")
e = lambda s: html.escape(str(s if s is not None else ""), quote=True)


def money(n):
    return "₹" + f"{int(n):,}"


def slug(p):
    return os.path.splitext(os.path.basename(p["image"]))[0]


def page_of(p):
    return f"{OUT_DIR}/{slug(p)}.html"


def small(img):
    return re.sub(r"(-600)?\.webp$", "-600.webp", img) if img.startswith("images/sarees/") else img


def off(p):
    return round((1 - p["price"] / p["oldPrice"]) * 100) if p.get("oldPrice", 0) > p["price"] else 0


def wa(text):
    from urllib.parse import quote
    return "https://wa.me/" + re.sub(r"\D", "", SITE.get("whatsapp", "")) + "?text=" + quote(text)


# ------------------------------------------------------------------ checks
problems = 0
seen = set()
for p in PRODUCTS:
    if p["id"] in seen:
        print(f"! Duplicate product id: {p['id']}"); problems += 1
    seen.add(p["id"])
    for img in [p["image"]] + p.get("gallery", []):
        for f in {img, small(img)}:
            if not os.path.exists(path(f)):
                print(f"! Missing image file: {f}"); problems += 1
    if not p.get("alt"):
        print(f"! {p['id']} has no alt text (helps Google Images)"); problems += 1
print(f"Products found: {len(PRODUCTS)}" + ("  (more than 30 - consider removing some)" if len(PRODUCTS) > 30 else ""))


# ------------------------------------------------------------------ shared card html (same as js/app.js card())
def card(p, prefix=""):
    url = prefix + page_of(p)
    o = off(p)
    return ('<article class="card"><div class="card__media">' + (f'<span class="badge">{o}% OFF</span>' if o else "") +
            f'<img src="{prefix}{small(p["image"])}" width="540" height="720" loading="lazy" decoding="async" alt="{e(p.get("alt") or p["name"])}"></div>'
            f'<div class="card__body"><span class="card__cat">{e(p["category"])}</span>'
            f'<h3 class="card__name"><a href="{url}">{e(p["name"])}</a></h3>'
            f'<div class="price"><b>{money(p["price"])}</b>' + (f"<s>{money(p['oldPrice'])}</s>" if o else "") + "</div>"
            f'<div class="card__foot"><a class="btn btn--ghost btn--sm" href="{url}">View Details</a></div></div></article>')


def product_ld(p):
    return {
        "@context": "https://schema.org", "@type": "Product", "name": p["name"], "sku": p["id"],
        "image": [f"{site}/{i}" for i in [p["image"]] + p.get("gallery", [])],
        "description": p.get("details", ""), "category": p["category"], "material": "Cotton",
        "brand": {"@type": "Brand", "name": SITE.get("name", "Noolthuli")},
        "additionalProperty": [{"@type": "PropertyValue", "name": k, "value": v} for k, v in p.get("specs", [])],
        "offers": {"@type": "Offer", "url": f"{site}/{page_of(p)}", "priceCurrency": "INR", "price": p["price"],
                   "itemCondition": "https://schema.org/NewCondition",
                   "availability": "https://schema.org/" + ("OutOfStock" if p.get("inStock") is False else "InStock"),
                   "seller": {"@type": "Organization", "name": SITE.get("name", "Noolthuli")},
                   "shippingDetails": {"@type": "OfferShippingDetails",
                                       "shippingRate": {"@type": "MonetaryAmount", "value": 0, "currency": "INR"},
                                       "shippingDestination": {"@type": "DefinedRegion", "addressCountry": "IN"}}},
    }


def crumbs_ld(p):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{site}/"},
        {"@type": "ListItem", "position": 2, "name": p["category"], "item": f"{site}/products.html?cat={p['category'].replace(' ', '%20')}"},
        {"@type": "ListItem", "position": 3, "name": p["name"], "item": f"{site}/{page_of(p)}"}]}


def set_meta(s, title, desc, url, image):
    s = re.sub(r"<title>.*?</title>", lambda m: f"<title>{e(title)}</title>", s)
    for pat, val in [(r'(<meta name="description" content=")[^"]*', desc), (r'(<meta property="og:description" content=")[^"]*', desc),
                     (r'(<meta name="twitter:description" content=")[^"]*', desc), (r'(<meta property="og:title" content=")[^"]*', title),
                     (r'(<meta name="twitter:title" content=")[^"]*', title), (r'(<meta property="og:url" content=")[^"]*', url),
                     (r'(<link rel="canonical" href=")[^"]*', url), (r'(<meta property="og:image" content=")[^"]*', image),
                     (r'(<meta name="twitter:image" content=")[^"]*', image)]:
        s = re.sub(pat, lambda m, v=val: m.group(1) + e(v), s)
    return s


# ------------------------------------------------------------------ 3. one static page per saree
template = read("product.html")
if os.path.isdir(path(OUT_DIR)):
    shutil.rmtree(path(OUT_DIR))
os.makedirs(path(OUT_DIR))
for p in PRODUCTS:
    url = f"{site}/{page_of(p)}"
    title = f"{p['name']} | {SITE.get('name')} Salem"
    desc = (f"{p['name']} – {p.get('shortDescription', '')} Offer {money(p['price'])}"
            + (f" (MRP {money(p['oldPrice'])})" if off(p) else "")
            + ". " + ", ".join(f"{k} {v}" for k, v in p.get("specs", [])) + ". Free shipping from Salem. Order on WhatsApp.")
    s = set_meta(template, title, desc, url, f"{site}/{p['image']}")
    s = s.replace('<meta property="og:type" content="website">', '<meta property="og:type" content="product">')
    # all relative links (css, js, images, nav) resolve from the site root
    s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="../">', 1)
    s = s.replace('href="#main"', f'href="{page_of(p)}#main"')
    lds = (f'<script type="application/ld+json" data-ld="product">{json.dumps(product_ld(p), ensure_ascii=False)}</script>\n'
           f'<script type="application/ld+json">{json.dumps(crumbs_ld(p), ensure_ascii=False)}</script>\n')
    s = s.replace("</head>", lds + "</head>", 1)
    specs = "".join(f'<tr><th scope="row">{e(k)}</th><td>{e(v)}</td></tr>' for k, v in p.get("specs", []))
    ask = f"Hello {SITE.get('name')}, I am interested in this saree:\n{p['name']} (ID: {p['id']}) – {money(p['price'])}"
    static = (f'<div class="pd__gal"><div class="stage"><img src="{p["image"]}" width="900" height="1125" alt="{e(p.get("alt") or p["name"])}"></div></div>'
              f'<div class="pd__info"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / '
              f'<a href="products.html?cat={e(p["category"])}">{e(p["category"])}</a></nav>'
              f'<h1>{e(p["name"])}</h1><div class="pd__id">Product ID: <b>{p["id"]}</b> · {e(p["category"])}</div>'
              f'<div class="price pd__price"><b>{money(p["price"])}</b>' + (f"<s>{money(p['oldPrice'])}</s>" if off(p) else "") + "</div>"
              f'<p class="pd__short">{e(p.get("shortDescription"))}</p><p class="pd__details">{e(p.get("details"))}</p>'
              + (f'<table class="specs"><caption>Saree measurements</caption><tbody>{specs}</tbody></table>' if specs else "")
              + f'<a class="btn btn--wa btn--block" href="{e(wa(ask))}" target="_blank" rel="noopener">Order on WhatsApp</a></div>')
    s = s.replace('<div class="pd" id="pd"><p class="empty" style="grid-column:1/-1">Loading saree…</p></div>',
                  f'<div class="pd" id="pd" data-id="{p["id"]}">{static}</div>')
    rel = [x for x in PRODUCTS if x["id"] != p["id"] and x["category"] == p["category"]][:4]
    s = s.replace('<div class="grid" id="related"></div>', '<div class="grid" id="related">' + "".join(card(x) for x in rel) + "</div>")
    assert f'data-id="{p["id"]}"' in s, "product.html template changed – update scripts/check.py"
    write(page_of(p), s)
print(f"{len(PRODUCTS)} saree pages written to /{OUT_DIR}/")

# old links product.html?id=… keep working: product.html points Google to the static page
# ------------------------------------------------------------------ 4. pre-render grid + ItemList in products.html
pp = read("products.html")
grid = "".join(card(p) for p in PRODUCTS)
pp = re.sub(r'<div class="grid" id="grid">.*?</div>\n  </div>\n</section>',
            lambda m: f'<div class="grid" id="grid">{grid}</div>\n  </div>\n</section>', pp, flags=re.S)
item_list = {"@context": "https://schema.org", "@type": "ItemList", "name": "Noolthuli Kerala cotton sarees",
             "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": f"{site}/{page_of(p)}", "name": p["name"]}
                                 for i, p in enumerate(PRODUCTS)]}
tag = f'<script type="application/ld+json" data-ld="itemlist">{json.dumps(item_list, ensure_ascii=False)}</script>'
pp = re.sub(r'<script type="application/ld\+json" data-ld="itemlist">.*?</script>\n?', "", pp)
pp = pp.replace("</head>", tag + "\n</head>", 1)
write("products.html", pp)
print("products.html: saree grid pre-rendered for search engines")

# ------------------------------------------------------------------ 5. sitemap with images + robots
today = date.today().isoformat()
urls = []
for pg, pr in [("", "1.0"), ("products.html", "0.9"), ("custom.html", "0.9"), ("contact.html", "0.6"), ("terms.html", "0.3"), ("policy.html", "0.3")]:
    extra = ""
    if pg == "custom.html":
        extra = "".join(f"<image:image><image:loc>{site}/images/custom/{f}</image:loc></image:image>"
                        for f in sorted(os.listdir(path("images", "custom"))) if f.endswith(".webp") and not f.endswith("-600.webp"))
    urls.append(f"  <url><loc>{site}/{pg}</loc><lastmod>{today}</lastmod><priority>{pr}</priority>{extra}</url>")
for p in PRODUCTS:
    imgs = "".join(f"<image:image><image:loc>{site}/{i}</image:loc><image:caption>{e(p.get('alt') or p['name'])}</image:caption></image:image>"
                   for i in [p["image"]] + p.get("gallery", []))
    urls.append(f"  <url><loc>{site}/{page_of(p)}</loc><lastmod>{today}</lastmod><priority>0.8</priority>{imgs}</url>")
xml = ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
       'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + "\n".join(urls) + "\n</urlset>\n")
write("sitemap.xml", xml)
write("robots.txt", f"User-agent: *\nAllow: /\nDisallow: /checkout.html\n\nSitemap: {site}/sitemap.xml\n")
print(f"sitemap.xml written with {len(urls)} URLs (+ product photos), robots.txt updated.")
print("All good!" if not problems else f"{problems} problem(s) found - see above.")
sys.exit(1 if problems else 0)
