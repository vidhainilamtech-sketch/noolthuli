/* =====================================================================
   NOOLTHULI — js/cart.js
   Cart stored in localStorage (this browser only), slide-in drawer.
   ===================================================================== */
(function () {
  "use strict";
  var KEY = "noolthuli_cart_v1", MAX = 10;
  var NT = window.NT, d = document, listeners = [];

  function read() {
    try { var a = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function write(a) {
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) { /* private mode: cart lives for this page only */ }
    mem = a; changed();
  }
  var mem = read();

  var Cart = window.Cart = {
    /* Cart lines joined with product data; unknown / removed products are skipped */
    items: function () {
      return mem.map(function (l) {
        var p = NT.product(l.id);
        return p ? { id: p.id, qty: l.qty, p: p, total: p.price * l.qty } : null;
      }).filter(Boolean);
    },
    count: function () { return Cart.items().reduce(function (s, l) { return s + l.qty; }, 0); },
    subtotal: function () { return Cart.items().reduce(function (s, l) { return s + l.total; }, 0); },
    add: function (id, qty) {
      var p = NT.product(id); if (!p || p.inStock === false) return false;
      qty = Math.max(1, parseInt(qty, 10) || 1);
      var a = mem.slice(), l = a.filter(function (x) { return x.id === id; })[0];
      if (l) l.qty = Math.min(MAX, l.qty + qty); else a.push({ id: id, qty: Math.min(MAX, qty) });
      write(a); bump(); return true;
    },
    setQty: function (id, qty) {
      qty = parseInt(qty, 10); if (!qty || qty < 1) return Cart.remove(id);
      write(mem.map(function (x) { return x.id === id ? { id: id, qty: Math.min(MAX, qty) } : x; }));
    },
    remove: function (id) { write(mem.filter(function (x) { return x.id !== id; })); },
    clear: function () { write([]); },
    onChange: function (fn) { listeners.push(fn); },
    MAX: MAX
  };

  function changed() { renderCount(); renderDrawer(); listeners.forEach(function (f) { f(); }); }
  function bump() { NT.$$("[data-cart-count]").forEach(function (c) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }); }
  function renderCount() {
    var n = Cart.count();
    NT.$$("[data-cart-count]").forEach(function (c) { c.textContent = n; c.classList.toggle("has", n > 0); });
  }

  /* ---------- Drawer ---------- */
  d.body.insertAdjacentHTML("beforeend",
    '<div class="scrim" data-cart-close></div>' +
    '<aside class="drawer" id="cart" role="dialog" aria-modal="true" aria-labelledby="cartTitle" aria-hidden="true">' +
    '<div class="drawer__head"><h2 id="cartTitle">Your Saree Bag</h2><button class="icon-btn" type="button" data-cart-close aria-label="Close cart">' + NT.ICON.close + "</button></div>" +
    '<div class="drawer__body" id="cartBody"></div><div class="drawer__foot" id="cartFoot"></div></aside>');
  var drawer = NT.$("#cart"), scrim = NT.$(".scrim"), lastFocus = null;

  function qtyHtml(l) {
    return '<div class="qty qty--sm"><button type="button" data-q="-1" data-id="' + l.id + '" aria-label="Decrease quantity">−</button>' +
      '<input type="number" inputmode="numeric" min="1" max="' + MAX + '" value="' + l.qty + '" data-qi="' + l.id + '" aria-label="Quantity for ' + NT.esc(l.p.name) + '">' +
      '<button type="button" data-q="1" data-id="' + l.id + '" aria-label="Increase quantity">+</button></div>';
  }
  Cart.qtyHtml = qtyHtml;

  function renderDrawer() {
    var body = NT.$("#cartBody"), foot = NT.$("#cartFoot"), items = Cart.items();
    if (!body) return;
    if (!items.length) {
      body.innerHTML = '<div class="empty"><span style="display:block;width:64px;margin:0 auto 10px;color:var(--gold)">' + NT.ICON.bag + '</span><h3>Your bag is empty</h3><p>Discover white Kerala cotton sarees made with love.</p><p class="quote quote--sm">Every beautiful drape begins with a single choice.</p><a class="btn btn--gold" href="products.html">Explore Sarees</a></div>';
      foot.hidden = true; return;
    }
    foot.hidden = false;
    body.innerHTML = items.map(function (l) {
      return '<div class="line"><img src="' + NT.img(l.p.image, 200) + '" width="74" height="94" alt="' + NT.esc(l.p.name) + '" loading="lazy">' +
        '<div><a class="line__name" href="product.html?id=' + l.id + '">' + NT.esc(l.p.name) + "</a>" +
        '<div class="line__meta">ID: ' + l.id + " · " + NT.esc(l.p.shortDescription || "") + "</div>" +
        '<div class="line__meta">' + NT.money(l.p.price) + " each</div>" +
        '<div class="line__row">' + qtyHtml(l) + '<span class="line__total">' + NT.money(l.total) + "</span></div>" +
        '<button class="line__rm" type="button" data-rm="' + l.id + '">Remove</button></div></div>';
    }).join("");
    var sub = Cart.subtotal();
    foot.innerHTML = '<p class="quote quote--sm">You chose with love — we will pack it with care.</p><div class="sum"><div><span>Subtotal</span><span>' + NT.money(sub) + '</span></div>' +
      '<div><span>Shipping</span><span class="free">FREE</span></div>' +
      '<div class="grand"><span>Grand Total</span><span>' + NT.money(sub) + "</span></div></div>" +
      '<a class="btn btn--block" href="checkout.html">Proceed to Checkout</a>' +
      '<button class="linkbtn" type="button" data-quote>' + NT.ICON.pdf + " Download Quotation (PDF)</button>";
  }

  function open() {
    lastFocus = d.activeElement;
    drawer.classList.add("open"); scrim.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
    d.body.style.overflow = "hidden";
    setTimeout(function () { var b = drawer.querySelector("[data-cart-close]"); if (b) b.focus(); }, 60);
  }
  function close() {
    if (!drawer.classList.contains("open")) return;
    drawer.classList.remove("open"); scrim.classList.remove("open"); drawer.setAttribute("aria-hidden", "true");
    d.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  Cart.open = open; Cart.close = close;

  /* ---------- Events (delegated, work for every page) ---------- */
  d.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("[data-cart-open]")) { e.preventDefault(); open(); return; }
    if (t.closest("[data-cart-close]")) { close(); return; }
    var q = t.closest("[data-q]");
    if (q) { var id = q.getAttribute("data-id"), l = mem.filter(function (x) { return x.id === id; })[0]; if (l) Cart.setQty(id, l.qty + Number(q.getAttribute("data-q"))); return; }
    var rm = t.closest("[data-rm]");
    if (rm) { Cart.remove(rm.getAttribute("data-rm")); return; }
    if (t.closest("[data-quote]")) { if (window.Checkout) window.Checkout.quotePdf(); return; }
    var add = t.closest("[data-add]");
    if (add) {
      var pid = add.getAttribute("data-add"), p = NT.product(pid);
      if (Cart.add(pid, 1) && p) {
        NT.toast('<img src="' + NT.img(p.image, 120) + '" alt=""><span>Added to bag</span><button type="button" data-cart-open>View bag</button>');
      }
    }
  });
  d.addEventListener("change", function (e) {
    var i = e.target.closest && e.target.closest("[data-qi]");
    if (i) Cart.setQty(i.getAttribute("data-qi"), i.value);
  });
  d.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
    if (e.key === "Tab" && drawer.classList.contains("open")) { /* keep focus inside the drawer */
      var f = NT.$$("a[href],button:not([disabled]),input", drawer); if (!f.length) return;
      if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && d.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  addEventListener("storage", function (e) { if (e.key === KEY) { mem = read(); changed(); } });

  /* Clean up items that no longer exist in data.js */
  if (mem.some(function (l) { return !NT.product(l.id); })) write(mem.filter(function (l) { return NT.product(l.id); }));
  else { renderCount(); renderDrawer(); }
})();
