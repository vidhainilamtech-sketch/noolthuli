/* =====================================================================
   NOOLTHULI — PRODUCTS  (js/data.js)
   ---------------------------------------------------------------------
   ADD a saree    : copy one { ... } block, paste it, change the values.
                    Give it a NEW unique id (NT021, NT022 ...).
   REMOVE a saree : delete its { ... } block (and the comma after it).
   OUT OF STOCK   : set inStock: false
   SHOW ON HOME   : set featured: true
   MADE TO ORDER  : add madeToOrder: "ready in 7–12 days" (shown instead of "In stock")

   Images: you can use
     • your own photo  ->  image: "images/nt021.webp"   (put file in /images)
     • an online photo ->  image: U("photo-id")           (Unsplash photo id)
   Maximum 20 products is recommended for a fast website.
   ===================================================================== */

/* Helper for live Unsplash photos — do not change */
function U(id) { return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&q=72&w=900"; }

/* Category names shown in filters (order matters) */
const CATEGORIES = ["Printed Cotton", "Embroidered Cotton", "Kerala Cotton", "Custom Made"];

/* NOTE: all photos below are DUMMY stock photos (Unsplash) — replace them with
   real Noolthuli product photos when available. Every saree is white Kerala cotton. */
const PRODUCTS = [
  /* ---------- Printed Cotton ---------- */
  {
    id: "NT001", name: "White Kerala Cotton Saree – Leaf Print", category: "Printed Cotton",
    image: U("1752468178780-2368233d691c"), gallery: [U("1752469113612-019661e82d20"), U("1752469113089-d1c68f5a6f85")],
    shortDescription: "White Kerala cotton with colourful leaf prints.",
    details: "Soft white Kerala cotton saree printed with scattered leaves in rose, mustard and green, finished with a gold border. Leaf colours can be customised to match your blouse. Length 5.5 m + 0.8 m blouse piece.",
    price: 1599, oldPrice: 2199, inStock: true, featured: true
  },
  {
    id: "NT002", name: "White Kerala Cotton Saree – Red Floral Print", category: "Printed Cotton",
    image: U("1710967357078-ce58cf17500c"), gallery: [],
    shortDescription: "White cotton with a soft red floral print.",
    details: "White Kerala cotton saree with a delicate red floral print across the body and pallu. Light, breathable and perfect with a red blouse for festivals and functions.",
    price: 1399, oldPrice: 1899, inStock: true, featured: true
  },
  {
    id: "NT003", name: "White Kerala Cotton Saree – Floral Border Print", category: "Printed Cotton",
    image: U("1600066275318-f0006719f854"), gallery: [],
    shortDescription: "White cotton with a bold black and red floral border.",
    details: "Crisp white Kerala cotton saree with a wide printed floral border in black and red. A modern twist on the classic white saree — border colours can be customised.",
    price: 1499, oldPrice: 1999, inStock: true, featured: true
  },
  {
    id: "NT004", name: "White Kerala Cotton Saree – Pastel Leaf Print", category: "Printed Cotton",
    image: U("1752469135696-f87983c56f2b"), gallery: [U("1752469113089-d1c68f5a6f85")],
    shortDescription: "Cream-white cotton with pastel leaf prints.",
    details: "Cream-white Kerala cotton saree with pastel leaf prints and a fine gold edge. Gentle, artistic and comfortable all day.",
    price: 1549, oldPrice: 2099, inStock: true, featured: false
  },
  {
    id: "NT005", name: "White Kerala Cotton Saree – Pink Stripe Print", category: "Printed Cotton",
    image: U("1711688588602-dc9add74d1ff"), gallery: [U("1711688590034-0a3428dbd57b")],
    shortDescription: "White cotton with a pink striped border.",
    details: "White Kerala cotton saree with a soft textured body and printed pink stripe border and pallu. Fresh and graceful for day functions.",
    price: 1299, oldPrice: 1799, inStock: true, featured: true
  },
  {
    id: "NT006", name: "Ivory Kerala Cotton Saree – Block Print Butis", category: "Printed Cotton",
    image: U("1769275060489-19d93bf1eeec"), gallery: [],
    shortDescription: "Ivory cotton with small block-printed butis.",
    details: "Ivory-white Kerala cotton saree with small block-printed butis all over and a printed border. Simple, elegant and easy to wear every day.",
    price: 1249, oldPrice: 1699, inStock: true, featured: false
  },
  {
    id: "NT007", name: "White Kerala Cotton Saree – Red Stripe Print", category: "Printed Cotton",
    image: U("1711688590009-539d18c9d56f"), gallery: [],
    shortDescription: "White cotton with fine red stripes on the pallu.",
    details: "White Kerala cotton saree with fine red printed stripes on the border and pallu. Light and comfortable — a lovely everyday festive saree.",
    price: 1199, oldPrice: 1649, inStock: true, featured: false
  },

  /* ---------- Embroidered Cotton ---------- */
  {
    id: "NT008", name: "White Kerala Cotton Saree – Sequin Embroidered Border", category: "Embroidered Cotton",
    image: U("1704552973572-9deabbad9f82"), gallery: [U("1704552978534-390953932ea0")],
    shortDescription: "Off-white cotton with sequin and thread embroidery.",
    details: "Off-white Kerala cotton saree with sequin and thread embroidery along the gold border — sparkles beautifully under lights. Great for receptions and college fests.",
    price: 1899, oldPrice: 2599, inStock: true, featured: true
  },
  {
    id: "NT009", name: "White Kerala Cotton Saree – Red Embroidered Border", category: "Embroidered Cotton",
    image: U("1710967357894-7d93f1bffcb2"), gallery: [U("1710967357101-843e3a9ac9ee")],
    shortDescription: "White cotton with a red thread-embroidered border.",
    details: "White Kerala cotton saree with red thread embroidery along the border and pallu, paired with a red embroidered blouse piece. Thread colour can be customised.",
    price: 1799, oldPrice: 2399, inStock: true, featured: true
  },
  {
    id: "NT010", name: "White Kerala Cotton Saree – Pink Embroidered Border", category: "Embroidered Cotton",
    image: U("1729101143891-a8fed18023f2"), gallery: [],
    shortDescription: "White cotton with a pink embroidered border.",
    details: "White Kerala cotton saree with a pink border finished in fine thread embroidery. Soft and pretty — perfect for haldi, birthdays and day events.",
    price: 1699, oldPrice: 2299, inStock: true, featured: false
  },
  {
    id: "NT011", name: "White Kerala Cotton Saree – Gold Buti Embroidery", category: "Embroidered Cotton",
    image: U("1710967356893-342efd3bd4f4"), gallery: [],
    shortDescription: "White cotton with gold butis and a gold border.",
    details: "Bright white Kerala cotton saree with embroidered gold butis across the body and a broad gold border. A festive classic for Onam, Vishu and weddings.",
    price: 1899, oldPrice: 2499, inStock: true, featured: true
  },
  {
    id: "NT012", name: "Off-White Kerala Cotton Saree – Thread Work Pallu", category: "Embroidered Cotton",
    image: U("1710967355346-ae5ce0e35991"), gallery: [],
    shortDescription: "Off-white cotton with thread work on the pallu.",
    details: "Off-white Kerala cotton saree with delicate thread work on the pallu and a gold border. Pairs well with a gold or contrast blouse.",
    price: 1649, oldPrice: 2199, inStock: true, featured: false
  },
  {
    id: "NT013", name: "White Kerala Cotton Saree – Rani Pink Embroidered Pallu", category: "Embroidered Cotton",
    image: U("1786300114351-c0c73bb6fe85"), gallery: [],
    shortDescription: "White cotton with a rani-pink embroidered pallu.",
    details: "White Kerala cotton saree with a striking rani-pink pallu and embroidered border. Comes with a matching blouse piece.",
    price: 1749, oldPrice: 2349, inStock: true, featured: false
  },

  /* ---------- Kerala Cotton (classic white) ---------- */
  {
    id: "NT014", name: "Classic White Kerala Cotton Saree – Gold Border", category: "Kerala Cotton",
    image: U("1679849922748-f59ba2e10c10"), gallery: [U("1778770217853-a907b882b0c9")],
    shortDescription: "Off-white pure cotton with a gold border.",
    details: "Pure cotton Kerala saree in natural off-white with a gold border and matching pallu. Soft, breathable and perfect for Onam, Vishu and temple visits. Add custom printing or embroidery on request.",
    price: 1199, oldPrice: 1699, inStock: true, featured: true
  },
  {
    id: "NT015", name: "Onam Set White Kerala Cotton Saree", category: "Kerala Cotton",
    image: U("1787295779699-e2c006307746"), gallery: [U("1787295779668-6ad1171580ff"), U("1787295779612-b3182bea0a81")],
    shortDescription: "White cotton set saree with green blouse piece.",
    details: "Traditional Kerala set saree in crisp white cotton with a gold border and contrast bottle-green blouse piece. Ideal for family and group Onam celebrations — bulk orders welcome.",
    price: 1099, oldPrice: 1599, inStock: true, featured: false
  },
  {
    id: "NT016", name: "Temple Visit Plain White Kerala Cotton Saree", category: "Kerala Cotton",
    image: U("1742677052550-33422264e846"), gallery: [],
    shortDescription: "Simple white cotton for daily and temple wear.",
    details: "Pure white Kerala cotton saree with a neat gold border — simple, sacred and comfortable. A must-have in every wardrobe.",
    price: 999, oldPrice: 1399, inStock: true, featured: false
  },
  {
    id: "NT017", name: "White Kerala Cotton Saree – Broad Gold Border", category: "Kerala Cotton",
    image: U("1742677052542-580678a8d585"), gallery: [U("1742677052539-c914ba59c497")],
    shortDescription: "White cotton with a broad gold border.",
    details: "White Kerala cotton saree with a broad gold border and pallu. Classic, elegant and easy to drape for functions and festivals.",
    price: 1149, oldPrice: 1599, inStock: true, featured: false
  },
  {
    id: "NT018", name: "White Kerala Cotton Saree – Fine Gold Line", category: "Kerala Cotton",
    image: U("1659293554631-d7a38642c5e3"), gallery: [U("1774814327264-45f6a47e4d36")],
    shortDescription: "White cotton with a slim gold line border.",
    details: "Graceful white Kerala cotton saree with a slim gold line border and plain pallu. Minimal and timeless — a perfect base for custom embroidery.",
    price: 1049, oldPrice: 1499, inStock: true, featured: false
  },

  /* ---------- Custom Made (price shown is the starting price) ---------- */
  {
    id: "NT019", name: "Custom Print White Kerala Cotton Saree – Your Design", category: "Custom Made",
    image: U("1787295779641-28182ac10feb"), gallery: [U("1787295779632-0d3689d03b0a")],
    shortDescription: "Your print on white Kerala cotton — made to order.",
    details: "Tell us your print style (floral, leaf, paisley, block, logo or name) and colours — we print it on white Kerala cotton for you. Starting price shown; final price depends on design and quantity. Bulk orders for families, functions and teams welcome. Making time 7–12 days.",
    price: 1499, oldPrice: 1999, inStock: true, featured: true, madeToOrder: "ready in 7–12 days"
  },
  {
    id: "NT020", name: "Custom Embroidery White Kerala Cotton Saree – Name / Motif", category: "Custom Made",
    image: U("1774814325557-5d2f88744906"), gallery: [U("1774814327264-45f6a47e4d36")],
    shortDescription: "Your motif or name embroidered on white cotton.",
    details: "Get your own motif, name, logo or design embroidered on a white Kerala cotton saree, in the thread colours you choose. Starting price shown; final price depends on embroidery size and quantity. Share your design on WhatsApp. Making time 10–15 days.",
    price: 1999, oldPrice: 2599, inStock: true, featured: true, madeToOrder: "ready in 10–15 days"
  }
];
