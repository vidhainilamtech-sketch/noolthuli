/* =====================================================================
   NOOLTHULI — js/layout.js
   Header + footer (written once, injected on every page), data-site
   auto-fill, mobile menu, toast, scroll-reveal, data validation.
   You normally do NOT need to edit this file.
   ===================================================================== */
(function () {
  "use strict";
  var d = document;
  /* config.js / data.js use `const`, which is global but not on window — expose them once */
  /* global SITE, PRODUCTS, CATEGORIES */
  if (typeof SITE !== "undefined") window.SITE = SITE;
  if (typeof PRODUCTS !== "undefined") window.PRODUCTS = PRODUCTS;
  if (typeof CATEGORIES !== "undefined") window.CATEGORIES = CATEGORIES;

  /* ---------- Icons (inline SVG) ---------- */
  var p = function (dd) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + dd + "</svg>"; };
  var ICON = {
    bag: p('<path d="M6 7h12l1 13H5L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/>'),
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A9.9 9.9 0 1 0 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7 3.9zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.2z"/></svg>',
    phone: p('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
    mail: p('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    pin: p('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    clock: p('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    search: p('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    close: p('<path d="M6 6l12 12M18 6 6 18"/>'),
    left: p('<path d="m15 6-6 6 6 6"/>'),
    right: p('<path d="m9 6 6 6-6 6"/>'),
    plus: p('<path d="M12 5v14M5 12h14"/>'),
    truck: p('<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
    gem: p('<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3l3 18 3-18"/>'),
    loom: p('<path d="M4 4v16M20 4v16M4 8h16M4 12h16M4 16h16M8 4v16M12 4v16M16 4v16"/>'),
    rupee: p('<path d="M7 4h10M7 8h10M7 4c6 0 6 8 0 8h-1l8 8"/>'),
    pdf: p('<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M12 11v6m0 0-3-3m3 3 3-3"/>'),
    check: p('<path d="m5 12 5 5 9-10"/>'),
    shield: p('<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>'),
    ig: p('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>'),
    fb: p('<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>'),
    yt: p('<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>'),
    pinterest: p('<circle cx="12" cy="12" r="9"/><path d="M11 8.5c3-1 5 1 4 3.5-.7 1.8-3 2-3.6.6M11.5 10 9.5 20"/>')
  };

  /* ---------- Helpers ---------- */
  var S = window.SITE || {};
  var SM = /^images\/sarees\/.+\.webp$/;
  var small = function (u) { return u.replace(/(-600)?\.webp$/, "-600.webp"); };
  var NT = window.NT = {
    ICON: ICON,
    $: function (s, r) { return (r || d).querySelector(s); },
    $$: function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); },
    esc: function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); },
    money: function (n) { return (S.currency || "₹") + Number(n || 0).toLocaleString("en-IN"); },
    /* Product photos in images/sarees/ have a small "-600" copy for cards and thumbnails */
    img: function (url, w) { return SM.test(url) && w <= 600 ? small(url) : url; },
    srcset: function (url) { return SM.test(url) ? small(url) + " 600w, " + url + " 1200w" : ""; },
    /* Each saree has its own crawlable page: sarees/<photo-name>.html (built by scripts/check.py) */
    page: function (pr) { return "sarees/" + String(pr.image || pr.id).split("/").pop().replace(/\.\w+$/, "") + ".html"; },
    /* Absolute URL (for Google / social previews) */
    abs: function (url) { return /^https?:/.test(url) ? url : (S.siteUrl || "") + "/" + url; },
    wa: function (text) { return "https://wa.me/" + String(S.whatsapp || "").replace(/\D/g, "") + (text ? "?text=" + encodeURIComponent(text) : ""); },
    tel: function () { return "tel:+" + String(S.whatsapp || S.phone || "").replace(/\D/g, "").replace(/^(?!91)(\d{10})$/, "91$1"); },
    product: function (id) { return (window.PRODUCTS || []).filter(function (x) { return x.id === id; })[0]; },
    off: function (pr) { return pr.oldPrice > pr.price ? Math.round((1 - pr.price / pr.oldPrice) * 100) : 0; }
  };
  d.documentElement.classList.add("js");

  /* ---------- Validate data files (console warnings for the owner) ---------- */
  (function validate() {
    if (!window.SITE) console.warn("[Noolthuli] js/config.js is missing or has an error.");
    var list = window.PRODUCTS;
    if (!Array.isArray(list)) { console.warn("[Noolthuli] js/data.js is missing or has an error."); return; }
    var seen = {};
    if (list.length > 30) console.warn("[Noolthuli] " + list.length + " products — 30 or fewer is recommended for speed.");
    list.forEach(function (x, i) {
      ["id", "name", "category", "image", "price"].forEach(function (k) {
        if (x[k] === undefined || x[k] === "") console.warn("[Noolthuli] Product #" + (i + 1) + " (" + (x.id || "no id") + ") is missing: " + k);
      });
      if (seen[x.id]) console.warn("[Noolthuli] Duplicate product id: " + x.id);
      seen[x.id] = 1;
      if (typeof x.price !== "number") console.warn("[Noolthuli] Price must be a number (no quotes) for " + x.id);
    });
  })();

  /* ---------- Header ---------- */
  var page = d.body.getAttribute("data-page") || "";
  var links = [["index.html", "Home", "home"], ["products.html", "Sarees", "products"], ["custom.html", "Customised", "custom"], ["index.html#about", "Our Story", "about"], ["contact.html", "Contact", "contact"]];
  var navHtml = links.map(function (l) { return '<a href="' + l[0] + '"' + (l[2] === page ? ' aria-current="page"' : "") + ">" + l[1] + "</a>"; }).join("");
  var hdr = d.getElementById("site-header");
  if (hdr) {
    hdr.outerHTML =
      '<header class="hdr" id="hdr"><div class="wrap hdr__in">' +
      '<a class="brand" href="index.html" aria-label="' + NT.esc(S.name) + ' home">' +
      '<img class="brand__mark" src="images/logo-mark.webp" width="58" height="50" alt="">' +
      '<span class="brand__txt"><img class="brand__ta" src="images/logo-tamil.webp" width="140" height="33" alt="' + NT.esc(S.nameTamil) + '"><span class="brand__en">' + NT.esc((S.name || "").toUpperCase()) + "</span></span></a>" +
      '<nav class="nav" aria-label="Main">' + navHtml + "</nav>" +
      '<a class="icon-btn icon-btn--call" href="' + NT.tel() + '" aria-label="Call ' + NT.esc(S.name) + ' ' + NT.esc(S.phone) + '">' + ICON.phone + "</a>" +
      '<button class="icon-btn" type="button" data-cart-open aria-label="Open cart">' + ICON.bag + '<span class="cart-count" data-cart-count>0</span></button>' +
      '<button class="icon-btn burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mnav"><span></span></button>' +
      '</div><div class="kasavu kasavu--thin"></div></header>' +
      '<nav class="mnav" id="mnav" aria-label="Mobile">' + navHtml +
      '<a class="btn btn--wa" href="' + NT.wa("Hello " + S.name + ", I would like to know more about your cotton sarees.") + '" target="_blank" rel="noopener">Chat on WhatsApp</a></nav>';
  }

  /* ---------- Footer ---------- */
  var ftr = d.getElementById("site-footer");
  if (ftr) {
    var soc = S.social || {}, socHtml = "";
    [["instagram", "ig", "Instagram"], ["facebook", "fb", "Facebook"], ["youtube", "yt", "YouTube"], ["pinterest", "pinterest", "Pinterest"]].forEach(function (s) {
      if (soc[s[0]]) socHtml += '<a href="' + NT.esc(soc[s[0]]) + '" target="_blank" rel="noopener" aria-label="' + s[2] + '">' + ICON[s[1]] + "</a>";
    });
    var row = function (ic, html) { return "<li style=\"display:flex;gap:10px;align-items:flex-start\"><span style=\"width:18px;flex:none;color:var(--maroon)\">" + ICON[ic] + "</span><span>" + html + "</span></li>"; };
    var contact = row("phone", '<a href="' + NT.tel() + '">' + NT.esc(S.phone) + "</a>") +
      row("wa", '<a href="' + NT.wa() + '" target="_blank" rel="noopener">WhatsApp us</a>') +
      (S.email ? row("mail", '<a href="mailto:' + NT.esc(S.email) + '">' + NT.esc(S.email) + "</a>") : "") +
      (S.address ? row("pin", NT.esc(S.address) + (S.city ? ", " + NT.esc(S.city) : "")) : "") +
      (S.hours ? row("clock", NT.esc(S.hours)) : "");
    ftr.outerHTML =
      '<footer class="ftr"><div class="kasavu"></div><div class="wrap"><div class="ftr__grid">' +
      '<div><img class="ftr__logo" src="images/logo.webp" width="150" height="160" alt="' + NT.esc(S.name) + ' logo" loading="lazy">' +
      '<p style="color:var(--muted);max-width:340px">' + NT.esc(S.subTagline) + " — pure cotton printed and embroidered sarees, custom made to your choice, delivered with free shipping across India.</p>" +
      (socHtml ? '<div class="social">' + socHtml + "</div>" : "") + "</div>" +
      '<div><h3>Shop</h3><ul><li><a href="products.html">All Sarees</a></li>' +
      (window.CATEGORIES || []).map(function (c) { return '<li><a href="products.html?cat=' + encodeURIComponent(c) + '">' + NT.esc(c) + "</a></li>"; }).join("") +
      '<li><a href="custom.html">Customised Sarees</a></li><li><a href="custom.html#bulk">Bulk &amp; Shop Orders</a></li><li><a href="checkout.html">Checkout</a></li></ul></div>' +
      '<div><h3>Reach us</h3><ul>' + contact + "</ul></div>" +
      '</div><div class="ftr__bot"><span>© ' + new Date().getFullYear() + " " + NT.esc(S.name) + " (" + NT.esc(S.nameTamil) + ") · Owner: " + NT.esc(S.owner) + "</span>" +
      '<span><a href="terms.html">Terms</a> · <a href="policy.html">Shipping, Payment &amp; Privacy</a> · <a href="contact.html">Contact</a></span>' +
      '<a class="ftr__dev" href="https://vidhainilam.com" target="_blank" rel="noopener">Designed &amp; developed by <img src="images/vidhainilam.png" width="20" height="20" alt="" loading="lazy"><b>VidhaiNilam</b></a></div></div></footer>' +
      '<a class="call-float" href="' + NT.tel() + '" aria-label="Call us now ' + NT.esc(S.phone) + '">' + ICON.phone + "</a>" +
      '<a class="wa-float" href="' + NT.wa("Hello " + S.name + ", I have a question about your sarees.") + '" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">' + ICON.wa + "</a>" +
      '<div class="toast" role="status" aria-live="polite" id="toast"></div>';
  }

  /* ---------- data-site auto fill ---------- */
  NT.$$("[data-site]").forEach(function (el) {
    var v = S[el.getAttribute("data-site")];
    var wrap = el.closest("[data-opt]");
    if (v) el.textContent = v; else if (wrap) wrap.hidden = true;
  });
  NT.$$("[data-link]").forEach(function (el) {
    var t = el.getAttribute("data-link");
    if (t === "tel") el.href = NT.tel();
    else if (t === "wa") el.href = NT.wa(el.getAttribute("data-msg") || "");
    else if (t === "mail" && S.email) el.href = "mailto:" + S.email;
    else if (t === "maps") { if (S.mapsLink) el.href = S.mapsLink; else { var w = el.closest("[data-opt]"); if (w) w.hidden = true; } }
  });
  NT.$$("[data-icon]").forEach(function (el) { el.innerHTML = ICON[el.getAttribute("data-icon")] || ""; });

  /* ---------- Mobile menu ---------- */
  var burger = NT.$(".burger"), mnav = NT.$("#mnav");
  function closeMenu() { if (!burger) return; burger.setAttribute("aria-expanded", "false"); mnav.classList.remove("open"); }
  if (burger) {
    burger.addEventListener("click", function () {
      var o = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", String(o)); mnav.classList.toggle("open", o);
    });
    mnav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- Sticky header shadow ---------- */
  var h = NT.$("#hdr");
  if (h) addEventListener("scroll", function () { h.classList.toggle("is-scrolled", scrollY > 8); }, { passive: true });

  /* ---------- Toast ---------- */
  var tt;
  NT.toast = function (html) {
    var t = NT.$("#toast"); if (!t) return;
    t.innerHTML = html; t.classList.add("show");
    clearTimeout(tt); tt = setTimeout(function () { t.classList.remove("show"); }, 3200);
  };

  /* ---------- Scroll reveal (also used by app.js for new cards) ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .08 }) : null;
  NT.reveal = function (root) {
    NT.$$(".rv:not(.in)", root).forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });
  };
  NT.reveal();
})();
