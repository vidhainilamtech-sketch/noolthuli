"""
Noolthuli — optional helper (needs Python 3, no extra packages).

    python scripts/check.py

What it does:
  1. Reads js/config.js (siteUrl) and js/data.js (products)
  2. Warns about duplicate product ids and missing local images
  3. Rebuilds sitemap.xml with every page + every product.html?id=...
Run it every time you add / remove products or change the domain.
"""
import os
import re
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def read(path):
    with open(os.path.join(ROOT, path), encoding="utf8") as f:
        return f.read()


def strip_comments(js):
    js = re.sub(r"/\*.*?\*/", "", js, flags=re.S)
    # drop "// ..." comments that are not inside a string (URLs like https:// are kept)
    return re.sub(r'(?m)^\s*//.*$|\s+//[^"\n]*$', "", js)


config = strip_comments(read("js/config.js"))
data = strip_comments(read("js/data.js"))

m = re.search(r'siteUrl:\s*"([^"]+)"', config)
site = (m.group(1) if m else "https://noolthuli.com").rstrip("/")

ids = re.findall(r'\bid:\s*"([^"]+)"', data)
problems = 0
seen = set()
for i in ids:
    if i in seen:
        print(f"! Duplicate product id: {i}")
        problems += 1
    seen.add(i)
print(f"Products found: {len(ids)}" + ("  (more than 20 - consider removing some)" if len(ids) > 20 else ""))

# Local images only (online U("...") photos are skipped)
for img in re.findall(r'"(images/[^"]+)"', data + config):
    if not os.path.exists(os.path.join(ROOT, img)):
        print(f"! Missing image file: {img}")
        problems += 1

pages = ["", "products.html", "contact.html", "terms.html", "policy.html"]
today = date.today().isoformat()
urls = []
for p in pages:
    pr = "1.0" if p == "" else "0.8" if p == "products.html" else "0.5"
    urls.append(f"  <url><loc>{site}/{p}</loc><lastmod>{today}</lastmod><priority>{pr}</priority></url>")
for i in ids:
    urls.append(f"  <url><loc>{site}/product.html?id={i}</loc><lastmod>{today}</lastmod><priority>0.7</priority></url>")

xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(urls) + "\n</urlset>\n"
with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf8", newline="\n") as f:
    f.write(xml)
with open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf8", newline="\n") as f:
    f.write(f"User-agent: *\nAllow: /\nDisallow: /checkout.html\n\nSitemap: {site}/sitemap.xml\n")

print(f"sitemap.xml written with {len(urls)} URLs, robots.txt updated.")
print("All good!" if not problems else f"{problems} problem(s) found - see above.")
sys.exit(1 if problems else 0)
