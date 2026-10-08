/* =====================================================================
   NOOLTHULI — js/app.js
   Home slider, categories, product grid (filter / search / sort),
   product details page with the saree-drape reveal.
   ===================================================================== */
(function () {
  "use strict";
  var NT = window.NT, S = window.SITE || {}, P = window.PRODUCTS || [], C = window.CATEGORIES || [];
  var $ = NT.$, $$ = NT.$$, esc = NT.esc, d = document;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Product card ---------- */
  function card(p, i) {
    var off = NT.off(p), out = p.inStock === false, url = NT.page(p);
    return '<article class="card rv' + (i % 4 ? " d" + (i % 4) : "") + '">' +
      '<div class="card__media">' +
      (out ? '<span class="badge badge--out">Out of stock</span>' : off ? '<span class="badge">' + off + "% OFF</span>" : "") +
      '<img src="' + NT.img(p.image, 540) + '" srcset="' + NT.srcset(p.image) + '" sizes="(min-width:1080px) 280px, (min-width:700px) 31vw, 48vw" width="540" height="720" loading="lazy" decoding="async" alt="' + esc(p.alt || p.name + " – " + p.category) + '"></div>' +
      '<div class="card__body"><span class="card__cat">' + esc(p.category) + "</span>" +
      '<h3 class="card__name"><a href="' + url + '">' + esc(p.name) + "</a></h3>" +
      '<div class="price"><b>' + NT.money(p.price) + "</b>" + (p.oldPrice > p.price ? "<s>" + NT.money(p.oldPrice) + "</s>" : "") + "</div>" +
      '<div class="card__foot"><a class="btn btn--ghost btn--sm" href="' + url + '">View Details</a>' +
      (out ? "" : '<button class="btn btn--sm card__add" type="button" data-add="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to bag">' + NT.ICON.plus + "</button>") +
      "</div></div></article>";
  }

  /* =================== HOME =================== */
  var track = $("#featured");
  if (track) {
    var feat = P.filter(function (p) { return p.featured; });
    if (feat.length < 4) feat = P.slice(0, 8);
    track.innerHTML = feat.map(card).join("");
    NT.reveal(track);
    slider(track);
  }

  function slider(tr) {
    var root = tr.closest(".slider"), dotsEl = $(".slider__dots", root), timer, paused = false;
    function pages() { return Math.max(1, Math.ceil((tr.scrollWidth - 4) / tr.clientWidth)); }
    function current() { return Math.round(tr.scrollLeft / tr.clientWidth); }
    function go(i) { var n = pages(); i = (i + n) % n; tr.scrollTo({ left: i * tr.clientWidth, behavior: reduce ? "auto" : "smooth" }); }
    function dots() {
      var n = pages(), c = Math.min(current(), n - 1);
      if (dotsEl.children.length !== n) {
        dotsEl.innerHTML = "";
        for (var i = 0; i < n; i++) dotsEl.insertAdjacentHTML("beforeend", '<button type="button" aria-label="Go to slide ' + (i + 1) + '" data-i="' + i + '"></button>');
      }
      $$("button", dotsEl).forEach(function (b, i) { b.setAttribute("aria-current", String(i === c)); });
    }
    dotsEl.addEventListener("click", function (e) { var b = e.target.closest("[data-i]"); if (b) go(+b.getAttribute("data-i")); });
    $(".slider__prev", root).addEventListener("click", function () { go(current() - 1); });
    $(".slider__next", root).addEventListener("click", function () { go(current() + 1); });
    var st; tr.addEventListener("scroll", function () { clearTimeout(st); st = setTimeout(dots, 80); }, { passive: true });
    addEventListener("resize", dots);
    ["mouseenter", "focusin", "touchstart"].forEach(function (ev) { root.addEventListener(ev, function () { paused = true; }, { passive: true }); });
    ["mouseleave", "focusout"].forEach(function (ev) { root.addEventListener(ev, function () { paused = false; }); });
    root.addEventListener("touchend", function () { setTimeout(function () { paused = false; }, 4000); }, { passive: true });
    if (!reduce) timer = setInterval(function () { if (!paused && !d.hidden) go(current() + 1); }, 4500);
    dots();
  }

  var cats = $("#cats");
  if (cats) {
    cats.innerHTML = C.map(function (c, i) {
      var list = P.filter(function (p) { return p.category === c; });
      if (!list.length) return "";
      return '<a class="cat rv' + (i ? " d" + i : "") + '" href="products.html?cat=' + encodeURIComponent(c) + '">' +
        '<img src="' + NT.img(list[0].image, 540) + '" srcset="' + NT.srcset(list[0].image) + '" sizes="(min-width:900px) 280px, 48vw" width="540" height="756" loading="lazy" alt="' + esc(c) + " – " + esc(list[0].alt || list[0].name) + '">' +
        '<span class="cat__lbl"><b>' + esc(c) + "</b><small>" + list.length + " designs</small></span></a>";
    }).join("");
    NT.reveal(cats);
  }

  /* Quote band: rotates every 6 s, dots to pick */
  var qb = $("#qband");
  if (qb) {
    var qs = qb.querySelectorAll(".qband__it"), qd = qb.querySelector(".qband__dots"), qi = 0, qt;
    qd.innerHTML = Array.prototype.map.call(qs, function (_, i) {
      return '<button type="button" aria-label="Quote ' + (i + 1) + '"' + (i ? "" : ' aria-current="true"') + "></button>";
    }).join("");
    var qShow = function (n) {
      qi = (n + qs.length) % qs.length;
      Array.prototype.forEach.call(qs, function (el, i) { el.classList.toggle("on", i === qi); });
      Array.prototype.forEach.call(qd.children, function (b, i) { b.setAttribute("aria-current", i === qi ? "true" : "false"); });
    };
    var qPlay = function () { clearInterval(qt); qt = setInterval(function () { qShow(qi + 1); }, 6000); };
    qd.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      qShow(Array.prototype.indexOf.call(qd.children, b)); qPlay();
    });
    if (!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) qPlay();
  }

  /* =================== PRODUCTS PAGE =================== */
  var grid = $("#grid");
  if (grid) {
    var qs = new URLSearchParams(location.search);
    var state = { cat: C.indexOf(qs.get("cat")) > -1 ? qs.get("cat") : "All", q: qs.get("q") || "", sort: "featured" };
    var chips = $("#chips"), search = $("#search"), sort = $("#sort"), note = $("#countNote");
    chips.innerHTML = ["All"].concat(C).map(function (c) {
      return '<button class="chip" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (c === state.cat) + '">' + esc(c) + "</button>";
    }).join("");
    search.value = state.q;

    var draw = function () {
      var q = state.q.trim().toLowerCase();
      var list = P.filter(function (p) {
        return (state.cat === "All" || p.category === state.cat) &&
          (!q || (p.name + " " + p.id + " " + p.category + " " + (p.shortDescription || "")).toLowerCase().indexOf(q) > -1);
      });
      if (state.sort === "low") list.sort(function (a, b) { return a.price - b.price; });
      else if (state.sort === "high") list.sort(function (a, b) { return b.price - a.price; });
      else if (state.sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });
      else list.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.inStock === false) - (b.inStock === false); });
      note.textContent = list.length + (list.length === 1 ? " saree" : " sarees") + (state.cat !== "All" ? " in " + state.cat : "") + (q ? ' matching "' + state.q + '"' : "");
      grid.innerHTML = list.length ? list.map(card).join("") :
        '<div class="empty" style="grid-column:1/-1"><span style="display:block;width:64px;margin:0 auto 10px;color:var(--gold)">' + NT.ICON.search + '</span><h3>No sarees found</h3><p>Try another word or category.</p><button class="btn btn--gold" type="button" id="resetF">Show all sarees</button></div>';
      NT.reveal(grid);
      var u = new URL(location.href);
      state.cat === "All" ? u.searchParams.delete("cat") : u.searchParams.set("cat", state.cat);
      state.q ? u.searchParams.set("q", state.q) : u.searchParams.delete("q");
      try { history.replaceState(null, "", u.pathname + u.search); } catch (e) { /* file:// in some browsers */ }
    };
    chips.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]"); if (!b) return;
      state.cat = b.getAttribute("data-cat");
      $$(".chip", chips).forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
      draw();
    });
    var tmr; search.addEventListener("input", function () { clearTimeout(tmr); tmr = setTimeout(function () { state.q = search.value; draw(); }, 180); });
    sort.addEventListener("change", function () { state.sort = sort.value; draw(); });
    grid.addEventListener("click", function (e) {
      if (e.target.id === "resetF") { state = { cat: "All", q: "", sort: state.sort }; search.value = ""; $$(".chip", chips).forEach(function (c, i) { c.setAttribute("aria-pressed", String(!i)); }); draw(); }
    });
    draw();
  }

  /* =================== PRODUCT DETAILS =================== */
  var pd = $("#pd");
  if (pd) {
    var id = pd.getAttribute("data-id") || new URLSearchParams(location.search).get("id");
    var p = NT.product(id) || (id ? null : P[0]);
    if (!p) {
      pd.innerHTML = '<div class="empty" style="grid-column:1/-1"><h1 style="font-size:1.8rem">Saree not found</h1><p>This design may have been sold out or removed.</p><a class="btn btn--gold" href="products.html">Browse all sarees</a></div>';
      return;
    }
    var imgs = [p.image].concat(p.gallery || []), out = p.inStock === false, off = NT.off(p);
    var askMsg = "Hello " + S.name + ", I am interested in this saree:\n" + p.name + " (ID: " + p.id + ") – " + NT.money(p.price);

    /* SEO: title, description, canonical, JSON-LD */
    d.title = p.name + " | " + S.name + " Salem";
    var md = $('meta[name="description"]'); if (md) md.setAttribute("content", p.name + " – " + p.shortDescription + " Offer " + NT.money(p.price) + (p.oldPrice > p.price ? " (MRP " + NT.money(p.oldPrice) + ")" : "") + ". Free shipping from " + S.name + ", Salem. Order on WhatsApp.");
    [["og:title", d.title], ["og:description", md ? md.getAttribute("content") : ""], ["og:image", NT.abs(p.image)], ["og:url", NT.abs(NT.page(p))]].forEach(function (m) {
      var el = $('meta[property="' + m[0] + '"]'); if (el) el.setAttribute("content", m[1]);
    });
    var cn = $('link[rel="canonical"]'); if (cn) cn.href = NT.abs(NT.page(p));
    var ld = d.createElement("script"); ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Product", name: p.name, sku: p.id, image: imgs.map(NT.abs),
      description: p.details, category: p.category, brand: { "@type": "Brand", name: S.name }, material: "Cotton",
      additionalProperty: (p.specs || []).map(function (r) { return { "@type": "PropertyValue", name: r[0], value: r[1] }; }),
      offers: { "@type": "Offer", url: NT.abs(NT.page(p)), priceCurrency: "INR", price: p.price,
        availability: "https://schema.org/" + (out ? "OutOfStock" : "InStock"), shippingDetails: { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" } } }
    });
    if (!d.querySelector('script[data-ld="product"]')) d.head.appendChild(ld); /* static saree pages already carry it */

    pd.innerHTML =
      '<div class="pd__gal"><div class="stage" id="stage">' +
      '<img id="mainImg" src="' + NT.img(imgs[0], 900) + '" srcset="' + NT.srcset(imgs[0]).replace("800w", "800w, " + NT.img(imgs[0], 1100) + " 1100w") + '" sizes="(min-width:900px) 560px, 100vw" width="900" height="1125" alt="' + esc(p.alt || p.name) + '" fetchpriority="high">' +
      '<span class="drape drape--l" aria-hidden="true"></span><span class="drape drape--r" aria-hidden="true"></span>' +
      '<span class="drape__seal" aria-hidden="true"><img src="images/logo-mark.webp" width="62" height="54" alt=""></span>' +
      (out ? '<span class="badge badge--out">Out of stock</span>' : off ? '<span class="badge">' + off + "% OFF</span>" : "") + "</div>" +
      (imgs.length > 1 ? '<div class="thumbs" role="group" aria-label="More photos">' + imgs.map(function (u, i) {
        return '<button type="button" data-img="' + i + '" aria-current="' + !i + '" aria-label="Photo ' + (i + 1) + " of " + esc(p.name) + '"><img src="' + NT.img(u, 160) + '" width="70" height="88" alt="" loading="lazy"></button>';
      }).join("") + "</div>" : "") + "</div>" +
      '<div class="pd__info"><nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="products.html?cat=' + encodeURIComponent(p.category) + '">' + esc(p.category) + "</a></nav>" +
      "<h1>" + esc(p.name) + "</h1>" +
      '<div class="pd__id">Product ID: <b>' + p.id + "</b> · " + esc(p.category) + "</div>" +
      '<div class="price pd__price"><b>' + NT.money(p.price) + "</b>" + (p.oldPrice > p.price ? "<s>" + NT.money(p.oldPrice) + '</s><span class="off">Save ' + NT.money(p.oldPrice - p.price) + "</span>" : "") + "</div>" +
      '<div class="pd__tax">Inclusive of all taxes · <span class="free">FREE shipping</span></div>' +
      '<span class="stock' + (out ? " stock--out" : "") + '">' + (out ? "Currently out of stock" : p.madeToOrder ? "Made to order – " + esc(p.madeToOrder) : "In stock – ready to ship") + "</span>" +
      '<p class="pd__short" style="margin-top:14px">' + esc(p.shortDescription) + "</p>" +
      '<p class="pd__details">' + esc(p.details) + "</p>" +
      (p.specs && p.specs.length ? '<table class="specs"><caption>Saree measurements</caption><tbody>' + p.specs.map(function (r) {
        return '<tr><th scope="row">' + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>";
      }).join("") + "</tbody></table>" : "") +
      '<div class="pd__buy">' + (out ?
        '<a class="btn btn--wa btn--block" target="_blank" rel="noopener" href="' + NT.wa(askMsg + "\nPlease tell me when it is back in stock.") + '">' + NT.ICON.wa + " Notify me on WhatsApp</a>" :
        '<div class="pd__row"><span style="font-weight:500">Quantity</span><div class="qty"><button type="button" id="qm" aria-label="Decrease quantity">−</button><input id="qv" type="number" inputmode="numeric" min="1" max="' + window.Cart.MAX + '" value="1" aria-label="Quantity"><button type="button" id="qp" aria-label="Increase quantity">+</button></div></div>' +
        '<div class="btns"><button class="btn btn--gold" type="button" id="addBtn">' + NT.ICON.bag + ' Add to Bag</button><button class="btn" type="button" id="buyBtn">Buy Now</button></div>' +
        '<a class="btn btn--ghost btn--block" target="_blank" rel="noopener" href="' + NT.wa(askMsg) + '">' + NT.ICON.wa + " Ask about this saree</a>") + "</div>" +
      '<ul class="perks"><li>' + NT.ICON.truck + "Free shipping on every order across India</li><li>" + NT.ICON.loom + "Directly from the manufacturer – no middlemen</li><li>" + NT.ICON.wa + "Order & support on WhatsApp " + esc(S.phone) + "</li><li>" + NT.ICON.gem + "<span>Want names or your own design on it? <a href=\"custom.html\">See customised sarees</a></span></li><li>" + NT.ICON.shield + "<span>Please check our <a href=\"policy.html\">no return / no refund policy</a> before buying</span></li></ul>" +
      '<p class="quote quote--sm" style="margin-top:14px">Made by hands that stand for hours, for the smile you wear for a lifetime.<small lang="ta">உங்கள் புன்னகையே எங்கள் உழைப்பின் பரிசு.</small></p></div>';

    /* --- Saree drape: covers the photo, then opens like a curtain --- */
    var stage = $("#stage"), main = $("#mainImg");
    var opened = false;
    /* wait for the page-opening curtain to finish so the customer actually sees the drape open */
    function afterIntro(fn) {
      var h = d.documentElement;
      if (reduce || h.classList.contains("intro-done")) return setTimeout(fn, reduce ? 0 : h.classList.contains("intro-gone") ? 500 : 1000);
      var mo = new MutationObserver(function () { if (h.classList.contains("intro-done")) { mo.disconnect(); setTimeout(fn, 1000); } });
      mo.observe(h, { attributes: true, attributeFilter: ["class"] });
    }
    function reveal() { if (opened) return; opened = true; afterIntro(function () { stage.classList.add("open"); }); }
    if (main.complete) reveal(); else { main.addEventListener("load", reveal); main.addEventListener("error", reveal); setTimeout(reveal, 1500); }
    pd.addEventListener("click", function (e) {
      var b = e.target.closest("[data-img]"); if (!b || b.getAttribute("aria-current") === "true") return;
      var u = imgs[+b.getAttribute("data-img")];
      $$(".thumbs button", pd).forEach(function (x) { x.setAttribute("aria-current", String(x === b)); });
      stage.classList.remove("open");
      setTimeout(function () {
        var done = function () { setTimeout(function () { stage.classList.add("open"); }, 120); };
        main.onload = done; main.onerror = done;
        main.srcset = NT.srcset(u); main.src = NT.img(u, 900);
        if (main.complete) done();
      }, reduce ? 0 : 650);
    });

    if (!out) {
      var qv = $("#qv");
      var clamp = function (v) { return Math.min(window.Cart.MAX, Math.max(1, parseInt(v, 10) || 1)); };
      $("#qm").addEventListener("click", function () { qv.value = clamp(+qv.value - 1); });
      $("#qp").addEventListener("click", function () { qv.value = clamp(+qv.value + 1); });
      qv.addEventListener("change", function () { qv.value = clamp(qv.value); });
      $("#addBtn").addEventListener("click", function () {
        window.Cart.add(p.id, clamp(qv.value));
        NT.toast('<img src="' + NT.img(p.image, 120) + '" alt=""><span>' + clamp(qv.value) + ' × added to bag</span><button type="button" data-cart-open>View bag</button>');
      });
      $("#buyBtn").addEventListener("click", function () { window.Cart.add(p.id, clamp(qv.value)); location.href = "checkout.html"; });
    }

    /* Related: same category first, then others */
    var rel = P.filter(function (x) { return x.id !== p.id && x.category === p.category; })
      .concat(P.filter(function (x) { return x.id !== p.id && x.category !== p.category && x.featured; })).slice(0, 4);
    var rg = $("#related");
    if (rg && rel.length) { rg.innerHTML = rel.map(card).join(""); NT.reveal(rg); } else if (rg) rg.closest("section").hidden = true;
  }

  /* =================== CONTACT PAGE =================== */
  var cf = $("#contactForm");
  if (cf) {
    var mb = $("#mapBox");
    if (mb && S.address) mb.innerHTML = '<iframe class="map" title="Map to ' + esc(S.name) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=' + encodeURIComponent(S.name + ", " + S.address + " " + (S.city || "")) + '&output=embed"></iframe>';
    var err = function (k, m) { var f = cf.querySelector('[data-f="' + k + '"]'); f.classList.toggle("invalid", !!m); f.querySelector(".err").textContent = m; };
    cf.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = cf.elements.cname.value.trim(), ph = cf.elements.cphone.value.replace(/[\s-]/g, "").replace(/^(\+?91|0)(?=\d{10}$)/, ""), m = cf.elements.cmsg.value.trim();
      err("cname", n.length < 2 ? "Please enter your name." : "");
      err("cphone", /^[6-9]\d{9}$/.test(ph) ? "" : "Enter a valid 10-digit mobile number.");
      err("cmsg", m.length < 3 ? "Please type your message." : "");
      var bad = cf.querySelector(".invalid input, .invalid textarea"); if (bad) { bad.focus(); return; }
      var url = NT.wa("Hello " + S.name + ",\nName: " + n + "\nMobile: " + ph + "\n\n" + m);
      if (!window.open(url, "_blank")) location.href = url;
    });
  }
})();
