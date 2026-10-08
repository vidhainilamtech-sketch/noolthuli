/* =====================================================================
   NOOLTHULI — BUSINESS DETAILS  (js/config.js)
   ---------------------------------------------------------------------
   This is the file to edit when the company details change.
   Leave a value as "" (empty) and that line simply disappears from the
   website (header, footer, contact page, PDF receipt, etc.).

   ⏳ PENDING FROM CUSTOMER — fill these in when they arrive:
      • upiId / gpayNumber / qrImage   (optional — online payment)
      • youtube / pinterest links      (optional)
      • siteUrl        (your real domain after hosting)
   ===================================================================== */

const SITE = {
  name: "Noolthuli",                     // company name (English)
  nameTamil: "நூல்துளி",                  // company name (Tamil)
  tagline: "Tradition Woven with Elegance",
  subTagline: "Cotton Saree Manufacturer",
  owner: "Jairam",

  phone: "+91 63835 58387",              // shown on the site / tap-to-call
  whatsapp: "916383558387",              // country code + number, digits only

  email: "ramjaya068@gmail.com",         // support mail id
  address: "Alagu Nagar, Allikuttai",    // shop / unit address
  landmark: "",                          // e.g. "Near ... Temple" (optional)
  city: "Salem, Tamil Nadu – 636014",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Alagu+Nagar%2C+Allikuttai%2C+Salem+636014",
  hours: "Mon – Sat, 9:30 AM – 8:00 PM",

  /* ---- Online payment (OPTIONAL) ----------------------------------
     Keep upiId "" to hide the payment box completely. Orders still come
     to WhatsApp and you can share payment details in the chat.        */
  upiId: "",                             // ⏳ e.g. "noolthuli@okaxis"
  gpayNumber: "",                        // ⏳ e.g. "6383558387"
  qrImage: "images/gpay-qr.webp",        // replace this image with your real QR

  currency: "₹",
  shipping: "FREE",
  siteUrl: "https://noolthuli.com",     // live website address (no trailing /)

  /* ---- Social media — empty = icon hidden --------------------------- */
  social: {
    instagram: "https://www.instagram.com/noolozhi_salem/",
    facebook: "https://www.facebook.com/share/19RjcyZztS/",
    youtube: "",
    pinterest: ""
  }
};
