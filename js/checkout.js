/* =====================================================================
   NOOLTHULI — js/checkout.js
   Validation, order ID, optional GPay/UPI, PDF receipt & quotation
   (jsPDF loads only when needed), WhatsApp order message.
   To connect a real backend later, change only submitOrder(order).
   ===================================================================== */
(function () {
  "use strict";
  var NT = window.NT, S = window.SITE || {}, Cart = window.Cart, d = document;
  var $ = NT.$, $$ = NT.$$, esc = NT.esc;
  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var JSPDF = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  var AUTOTABLE = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";

  /* ---------- Small helpers ---------- */
  var rs = function (n) { return "Rs. " + Number(n || 0).toLocaleString("en-IN"); }; // PDF-safe currency
  function rand(n) { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < n; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
  function ymd(dt) { return dt.getFullYear() + ("0" + (dt.getMonth() + 1)).slice(-2) + ("0" + dt.getDate()).slice(-2); }
  function newId(prefix) { return (prefix || "NT") + "-" + ymd(new Date()) + "-" + rand(4); }
  function stamp(dt) { return dt.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  function loadScript(src) {
    return new Promise(function (ok, fail) {
      var s = d.createElement("script"); s.src = src; s.async = true; s.crossOrigin = "anonymous";
      s.onload = ok; s.onerror = function () { fail(new Error("Could not load " + src)); }; d.head.appendChild(s);
    });
  }
  var pdfLib;
  function loadPdf() {
    if (!pdfLib) pdfLib = loadScript(JSPDF).then(function () { return loadScript(AUTOTABLE); }).then(function () { return window.jspdf.jsPDF; });
    pdfLib.catch(function () { pdfLib = null; });
    return pdfLib;
  }
  /* Logo for the PDF (skipped silently if the browser blocks it, e.g. file://) */
  function logoData() {
    return new Promise(function (ok) {
      var im = new Image(); im.onload = function () {
        try { var c = d.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext("2d").drawImage(im, 0, 0); ok({ src: c.toDataURL("image/jpeg", .9), w: im.naturalWidth, h: im.naturalHeight }); }
        catch (e) { ok(null); }
      }; im.onerror = function () { ok(null); }; im.src = "images/logo-pdf.jpg";
    });
  }
  /* Shrink a payment screenshot so the PDF stays small */
  function shrink(dataUrl) {
    return new Promise(function (ok) {
      var im = new Image(); im.onload = function () {
        var k = Math.min(1, 1100 / Math.max(im.width, im.height)), c = d.createElement("canvas");
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
        ok({ src: c.toDataURL("image/jpeg", .82), w: c.width, h: c.height });
      }; im.onerror = function () { ok(null); }; im.src = dataUrl;
    });
  }

  /* =================== PDF =================== */
  var MAROON = [122, 21, 48], GOLD = [184, 137, 47], CREAM = [251, 245, 233], INK = [43, 33, 24];

  function buildPdf(order, kind) {
    return Promise.all([loadPdf(), logoData(), order.payment && order.payment.screenshot ? shrink(order.payment.screenshot) : null]).then(function (r) {
      var jsPDF = r[0], logo = r[1], shot = r[2];
      var doc = new jsPDF({ unit: "mm", format: "a4" }), W = 210, H = 297, M = 14, y;
      var quote = kind === "quote";

      // Header band
      doc.setFillColor.apply(doc, MAROON); doc.rect(0, 0, W, 5, "F");
      doc.setFillColor.apply(doc, GOLD); doc.rect(0, 5, W, 1.4, "F");
      var x0 = M;
      if (logo) { var lh = 30, lw = lh * logo.w / logo.h; doc.addImage(logo.src, "JPEG", M, 10, lw, lh); x0 = M + lw + 5; }
      doc.setFont("times", "bold"); doc.setFontSize(22); doc.setTextColor.apply(doc, MAROON);
      doc.text((S.name || "").toUpperCase(), x0, 20);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor.apply(doc, GOLD);
      doc.text((S.subTagline || "") + "  |  " + (S.tagline || ""), x0, 25.5);
      doc.setTextColor.apply(doc, INK);
      var info = ["Phone / WhatsApp: " + S.phone];
      if (S.email) info.push("Email: " + S.email);
      if (S.address) info = info.concat(doc.splitTextToSize(S.address + (S.city ? ", " + S.city : "") + (S.landmark ? " (" + S.landmark + ")" : ""), 95));
      doc.text(info, x0, 30.5);

      // Title block (right)
      doc.setFont("times", "bold"); doc.setFontSize(15); doc.setTextColor.apply(doc, MAROON);
      doc.text(quote ? "QUOTATION" : "ORDER RECEIPT", W - M, 18, { align: "right" });
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor.apply(doc, INK);
      doc.text([quote ? "Reference" : "Order Reference", (quote ? "Ref: " : "Order ID: ") + order.id, "Date: " + stamp(order.date)], W - M, 24, { align: "right" });

      y = Math.max(46, 30.5 + info.length * 4 + 4);
      doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(.6); doc.line(M, y, W - M, y); y += 7;

      // Customer
      if (!quote) {
        doc.setFillColor.apply(doc, CREAM); doc.roundedRect(M, y - 4, W - 2 * M, 27, 2, 2, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor.apply(doc, MAROON); doc.text("DELIVER TO", M + 4, y + 1.5);
        doc.setFont("helvetica", "normal"); doc.setTextColor.apply(doc, INK); doc.setFontSize(9.5);
        var c = order.customer;
        var addr = doc.splitTextToSize(c.address + " - " + c.pincode, W - 2 * M - 8).slice(0, 3);
        doc.text(["Name: " + c.name + "     Mobile: " + c.phone].concat(addr), M + 4, y + 7);
        y += 29;
      }

      // Items table
      doc.autoTable({
        startY: y, margin: { left: M, right: M, bottom: 24 },
        head: [["S.No", "Product ID", "Saree", "Qty", "Unit price", "Line total"]],
        body: order.items.map(function (l, i) { return [i + 1, l.id, l.name, l.qty, rs(l.price), rs(l.price * l.qty)]; }),
        styles: { font: "helvetica", fontSize: 9, cellPadding: 2.6, textColor: INK, lineColor: [233, 211, 168], lineWidth: .2, overflow: "linebreak" },
        headStyles: { fillColor: MAROON, textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: CREAM },
        columnStyles: { 0: { cellWidth: 15, halign: "center" }, 1: { cellWidth: 22 }, 3: { cellWidth: 12, halign: "center" }, 4: { cellWidth: 27, halign: "right" }, 5: { cellWidth: 29, halign: "right" } },
        didDrawPage: function () { footer(doc, W, H, M, quote); }
      });
      y = doc.lastAutoTable.finalY + 6;
      if (y > H - 70) { doc.addPage(); footer(doc, W, H, M, quote); y = 20; }

      // Totals
      var bx = W - M - 78;
      doc.setFontSize(10); doc.setTextColor.apply(doc, INK);
      doc.text("Subtotal", bx + 4, y + 4); doc.text(rs(order.subtotal), W - M - 4, y + 4, { align: "right" });
      doc.text("Shipping", bx + 4, y + 10); doc.setTextColor(47, 122, 62); doc.text("FREE", W - M - 4, y + 10, { align: "right" });
      doc.setFillColor.apply(doc, GOLD); doc.roundedRect(bx, y + 14, 78, 13, 2, 2, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(12.5); doc.setTextColor(255, 255, 255);
      doc.text("GRAND TOTAL", bx + 4, y + 22.5); doc.text(rs(order.total), W - M - 4, y + 22.5, { align: "right" });

      // Payment
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor.apply(doc, MAROON);
      doc.text(quote ? "HOW TO ORDER" : "PAYMENT", M, y + 4);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor.apply(doc, INK);
      var pl = quote ? doc.splitTextToSize("Send this quotation to " + S.name + " on WhatsApp " + S.phone + " to confirm your order. Prices are subject to stock availability.", bx - M - 6)
        : order.payment.paid ? ["Mode: GPay / UPI", "Amount paid: " + rs(order.total), "Transaction ID / UTR: " + (order.payment.utr || "See screenshot"), "Status: Awaiting confirmation by seller"]
        : ["Mode: To be confirmed on WhatsApp", "Amount payable: " + rs(order.total), "Status: Awaiting confirmation by seller"];
      doc.text(pl, M, y + 10);
      y += 36;

      // Screenshot
      if (shot) {
        var mw = 80, mh = 120, k = Math.min(mw / shot.w, mh / shot.h), iw = shot.w * k, ih = shot.h * k;
        if (y + ih + 10 > H - 26) { doc.addPage(); footer(doc, W, H, M, quote); y = 20; }
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor.apply(doc, MAROON); doc.text("PAYMENT SCREENSHOT", M, y);
        doc.addImage(shot.src, "JPEG", M, y + 3, iw, ih); doc.setDrawColor.apply(doc, GOLD); doc.rect(M, y + 3, iw, ih);
      }

      // Page numbers
      var n = doc.getNumberOfPages();
      for (var i = 1; i <= n; i++) { doc.setPage(i); doc.setFontSize(8); doc.setTextColor(140, 120, 100); doc.text("Page " + i + " of " + n, W - M, H - 6, { align: "right" }); }
      return doc;
    });
  }
  function footer(doc, W, H, M, quote) {
    doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(.4); doc.line(M, H - 20, W - M, H - 20);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.6); doc.setTextColor(110, 95, 80);
    doc.text(doc.splitTextToSize((quote ? "This is a quotation, not a confirmed order. " : "This is a customer-generated order reference. ") +
      "Final confirmation is done by " + S.name + " on WhatsApp " + S.phone + ". Free shipping. No refund or return once purchased.", W - 2 * M - 22), M, H - 15);
  }
  function savePdf(order, kind) {
    return buildPdf(order, kind).then(function (doc) {
      doc.save(S.name.replace(/\s+/g, "") + "-" + (kind === "quote" ? "Quotation" : "Order") + "-" + order.id + ".pdf");
      return true;
    });
  }

  /* =================== WhatsApp message =================== */
  function waMessage(o, short) {
    var line = function (l, i) {
      var nm = short === 2 ? "" : short ? l.name.slice(0, 26) + (l.name.length > 26 ? "…" : "") + " | " : l.name + " | ";
      return (i + 1) + ") ID: " + l.id + " | " + nm + "Qty: " + l.qty + " x ₹" + l.price.toLocaleString("en-IN") + " = ₹" + (l.qty * l.price).toLocaleString("en-IN");
    };
    var c = o.customer, pay = o.payment;
    return ["🛍️ *New Order – " + S.name + "*", "Order ID: " + o.id, "Customer: " + c.name + " | Mobile: " + c.phone,
      "Address: " + c.address + ", " + c.pincode, "-----------------"].concat(o.items.map(line)).concat([
      "-----------------", "Shipping: FREE", "*Grand Total: ₹" + o.total.toLocaleString("en-IN") + "*",
      pay.paid ? "Payment: GPay | Txn ID: " + (pay.utr || "see screenshot") : "Payment: Pay later – please share payment details",
      pay.paid ? "📎 Payment screenshot will be attached by the customer in this chat" : "",
      c.note ? "Note: " + c.note : ""]).filter(Boolean).join("\n");
  }
  function waUrl(o) {
    var u = NT.wa(waMessage(o));
    if (u.length > 3800) u = NT.wa(waMessage(o, 1));
    if (u.length > 3800) u = NT.wa(waMessage(o, 2));
    return u;
  }

  /* =================== submitOrder =================== */
  /* Generates the PDF, then opens WhatsApp. Replace the body with an API call later if needed.
     Must be called directly from the click so the WhatsApp window is not blocked. */
  function submitOrder(order) {
    var url = waUrl(order), win = null;
    try { win = window.open("", "_blank"); if (win) win.document.write("<p style='font:16px sans-serif;padding:24px'>Opening WhatsApp…</p>"); } catch (e) { win = null; }
    return savePdf(order, "receipt").then(function () { return true; }, function (e) { console.warn(e); return false; })
      .then(function (pdfOk) {
        var waOk = false;
        if (win && !win.closed) { try { win.location.href = url; waOk = true; } catch (e) { waOk = false; } }
        if (!waOk) { var w2 = window.open(url, "_blank"); waOk = !!w2; }
        return { pdf: pdfOk, wa: waOk, url: url };
      });
  }

  window.Checkout = {
    submitOrder: submitOrder,
    quotePdf: function () {
      var items = Cart.items(); if (!items.length) return;
      var o = { id: newId("QT"), date: new Date(), items: items.map(function (l) { return { id: l.id, name: l.p.name, qty: l.qty, price: l.p.price }; }), subtotal: Cart.subtotal(), total: Cart.subtotal() };
      NT.toast("<span>Preparing your quotation PDF…</span>");
      savePdf(o, "quote").catch(function () { NT.toast("<span>Could not create the PDF. Please check your internet and try again.</span>"); });
    }
  };

  /* =================== CHECKOUT PAGE =================== */
  var form = $("#coForm");
  if (!form) return;
  var orderId;
  try { orderId = sessionStorage.getItem("nt_oid"); } catch (e) { /* ignore */ }
  if (!orderId) { orderId = newId("NT"); try { sessionStorage.setItem("nt_oid", orderId); } catch (e) { /* ignore */ } }
  var shot = null, lastOrder = null, payNow = false;

  function renderSummary() {
    var items = Cart.items(), sub = Cart.subtotal();
    $("#coEmpty").hidden = !!items.length || !$("#done").hidden;
    $("#co").hidden = !items.length;
    if (!items.length) return;
    $("#mini").innerHTML = items.map(function (l) {
      return '<div class="mini__it"><img src="' + NT.img(l.p.image, 120) + '" width="52" height="66" alt="" loading="lazy"><div><b>' + esc(l.p.name) + "</b><small>ID: " + l.id + " · Qty " + l.qty + " × " + NT.money(l.p.price) + "</small></div><b>" + NT.money(l.total) + "</b></div>";
    }).join("");
    $("#coSum").innerHTML = '<div><span>Subtotal (' + Cart.count() + ' items)</span><span>' + NT.money(sub) + '</span></div><div><span>Shipping</span><span class="free">FREE</span></div><div class="grand"><span>Grand Total</span><span>' + NT.money(sub) + "</span></div>";
    $$("[data-amt]").forEach(function (e) { e.textContent = NT.money(sub); });
    var upi = $("#upiBtn");
    if (upi) upi.href = "upi://pay?pa=" + encodeURIComponent(S.upiId) + "&pn=" + encodeURIComponent(S.name) + "&am=" + sub + "&cu=INR&tn=" + encodeURIComponent(orderId);
  }
  Cart.onChange(renderSummary);

  /* Payment box (only if a UPI ID is set in config.js) */
  var payPanel = $("#payPanel");
  if (S.upiId) {
    payPanel.hidden = false;
    $("#upiId").textContent = S.upiId;
    $("#gpayNo").textContent = S.gpayNumber || S.phone;
    $("#qrImg").src = S.qrImage;
    $("#oidPay").textContent = orderId;
    if (!isMobile) $("#upiBtn").hidden = true;
    $$("[name=paymode]").forEach(function (r) {
      r.addEventListener("change", function () { payNow = r.value === "now" && r.checked; $("#paidBox").hidden = !payNow; });
    });
    $("#copyUpi").addEventListener("click", function () {
      var b = this; (navigator.clipboard ? navigator.clipboard.writeText(S.upiId) : Promise.reject()).then(function () { b.textContent = "Copied"; }, function () { b.textContent = "Select & copy"; });
    });
  }
  $("#stepConfirm").textContent = S.upiId ? "3" : "2";

  /* Screenshot */
  var fileIn = $("#shot");
  fileIn.addEventListener("change", function () {
    var f = fileIn.files[0], prev = $("#shotPrev"); shot = null; prev.hidden = true; setErr("shot", "");
    if (!f) return;
    if (!/^image\//.test(f.type)) { setErr("shot", "Please choose an image file (JPG, PNG, WebP)."); fileIn.value = ""; return; }
    if (f.size > 5 * 1024 * 1024) { setErr("shot", "Image is larger than 5 MB. Please choose a smaller screenshot."); fileIn.value = ""; return; }
    var r = new FileReader();
    r.onload = function () { shot = r.result; prev.src = shot; prev.hidden = false; };
    r.readAsDataURL(f);
  });

  /* Validation */
  function setErr(name, msg) {
    var f = form.querySelector('[data-f="' + name + '"]'); if (!f) return;
    f.classList.toggle("invalid", !!msg); var e = f.querySelector(".err"); if (e) e.textContent = msg;
    var inp = f.querySelector("input,textarea"); if (inp) inp.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function cleanPhone(v) { v = String(v).replace(/[\s-]/g, ""); return v.replace(/^(\+?91|0)(?=\d{10}$)/, ""); }
  var rules = {
    name: function (v) { return v.trim().length < 2 ? "Please enter your full name." : ""; },
    phone: function (v) { return /^[6-9]\d{9}$/.test(cleanPhone(v)) ? "" : "Enter a valid 10-digit mobile number."; },
    address: function (v) { return v.trim().length < 10 ? "Please enter your full delivery address (house, street, area, city)." : ""; },
    pincode: function (v) { return /^[1-9]\d{5}$/.test(v.trim()) ? "" : "Enter a valid 6-digit pincode."; },
    utr: function (v) { return !v.trim() || /^\d{12}$/.test(v.trim()) ? "" : "UTR / Transaction ID must be 12 digits (or leave it empty)."; }
  };
  Object.keys(rules).forEach(function (k) {
    var el = form.elements[k]; if (!el) return;
    el.addEventListener("blur", function () { if (el.value) setErr(k, rules[k](el.value)); });
    el.addEventListener("input", function () { if (el.closest(".invalid")) setErr(k, rules[k](el.value)); });
  });
  function validate() {
    var bad = [];
    ["name", "phone", "address", "pincode"].forEach(function (k) { var m = rules[k](form.elements[k].value); setErr(k, m); if (m) bad.push(form.elements[k]); });
    if (S.upiId && payNow) {
      var m = rules.utr(form.elements.utr.value); setErr("utr", m); if (m) bad.push(form.elements.utr);
      setErr("shot", shot ? "" : "Please attach your payment screenshot."); if (!shot) bad.push(fileIn);
      var ck = form.elements.paidOk; setErr("paidOk", ck.checked ? "" : "Please tick this box to continue."); if (!ck.checked) bad.push(ck);
    }
    if (bad.length) bad[0].focus();
    return !bad.length;
  }

  /* Confirm */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var items = Cart.items(); if (!items.length) { renderSummary(); return; }
    if (!validate()) return;
    var el = form.elements, btn = $("#confirmBtn");
    var order = {
      id: orderId, date: new Date(),
      customer: { name: el.name.value.trim(), phone: cleanPhone(el.phone.value), address: el.address.value.trim().replace(/\s+/g, " "), pincode: el.pincode.value.trim(), note: (el.note.value || "").trim() },
      items: items.map(function (l) { return { id: l.id, name: l.p.name, qty: l.qty, price: l.p.price }; }),
      subtotal: Cart.subtotal(), shipping: 0, total: Cart.subtotal(),
      payment: { paid: !!(S.upiId && payNow), utr: S.upiId && payNow ? el.utr.value.trim() : "", screenshot: S.upiId && payNow ? shot : null }
    };
    btn.disabled = true; btn.textContent = "Preparing your order…";
    submitOrder(order).then(function (res) {
      lastOrder = order;
      showDone(order, res);
      Cart.clear();                                   // only after PDF + WhatsApp steps
      try { sessionStorage.removeItem("nt_oid"); } catch (e2) { /* ignore */ }
    });
  });

  function showDone(o, res) {
    var done = $("#done");
    $("#co").hidden = true; $("#coEmpty").hidden = true;
    done.innerHTML = '<div class="done"><div class="done__tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m5 12 5 5 9-10"/></svg></div>' +
      "<h1>Order Placed!</h1><p>Thank you, <b>" + esc(o.customer.name) + "</b>. Your order <b>" + o.id + "</b> has been sent to " + esc(S.name) + " on WhatsApp. We will confirm it shortly.</p>" +
      '<p class="quote" style="margin:0 auto 18px">நன்றி! Your saree is on its way to meet your smile.</p>' +
      (res.wa ? "" : '<p class="note" style="text-align:left">Your browser blocked WhatsApp from opening. Please tap <b>Open WhatsApp</b> below to send your order.</p>') +
      (res.pdf ? "" : '<p class="note" style="text-align:left">The PDF could not be downloaded automatically. Tap <b>Download Order Receipt</b> below (internet needed).</p>') +
      (o.payment.paid ? '<p class="note" style="text-align:left">📎 <b>Important:</b> In the WhatsApp chat, please attach the same payment screenshot you uploaded here.</p>' : "") +
      '<div class="panel"><h2 style="font-size:1.1rem">Order summary</h2><div class="mini">' + o.items.map(function (l) {
        return '<div class="mini__it" style="grid-template-columns:1fr auto"><div><b>' + esc(l.name) + "</b><small>ID: " + l.id + " · " + l.qty + " × " + NT.money(l.price) + "</small></div><b>" + NT.money(l.qty * l.price) + "</b></div>";
      }).join("") + '</div><div class="sum"><div><span>Shipping</span><span class="free">FREE</span></div><div class="grand"><span>Grand Total</span><span>' + NT.money(o.total) + "</span></div></div></div>" +
      '<div class="btns"><a class="btn btn--wa" href="' + res.url + '" target="_blank" rel="noopener">' + NT.ICON.wa + ' Open WhatsApp</a><button class="btn btn--gold" type="button" id="dlAgain">' + NT.ICON.pdf + " Download Order Receipt (PDF)</button></div>" +
      '<p style="margin-top:22px"><a href="products.html">Continue shopping →</a></p></div>';
    done.hidden = false;
    scrollTo(0, 0);
    $("#dlAgain").addEventListener("click", function () {
      var b = this; b.disabled = true;
      savePdf(lastOrder, "receipt").catch(function () { NT.toast("<span>PDF failed. Please check your internet and try again.</span>"); }).then(function () { b.disabled = false; });
    });
  }

  renderSummary();
})();
