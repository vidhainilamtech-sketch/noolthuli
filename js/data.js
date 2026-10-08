/* =====================================================================
   NOOLTHULI — PRODUCTS  (js/data.js)
   ---------------------------------------------------------------------
   ADD a saree    : copy one { ... } block, paste it, change the values.
                    Give it a NEW unique id (NTB04, NTP07, NTE17 ...).
   REMOVE a saree : delete its { ... } block (and the comma after it).
   OUT OF STOCK   : set inStock: false
   SHOW ON HOME   : set featured: true
   MADE TO ORDER  : add madeToOrder: "ready in 7–12 days" (shown instead of "In stock")

   Images: real Noolthuli photos live in images/sarees/
     • use an SEO file name:  images/sarees/<colour>-<design>-kerala-cotton-saree.webp
     • also save a small copy with "-600" at the end of the name (for fast cards)
     • alt: describe the photo in one sentence (colour, design, border) — helps Google & blind users
   Prices: price = our offer price, oldPrice = MRP (shown struck through)
   ===================================================================== */

/* Category names shown in filters (order matters) */
const CATEGORIES = ["Base Sarees", "Printed Sarees", "Embroidery Sarees"];

/* Prices: price = our offer price, oldPrice = MRP shown struck through */
const PRICE = {
  plain:   { price: 340,  oldPrice: 599 },
  zebra:   { price: 490,  oldPrice: 849 },
  checked: { price: 510,  oldPrice: 899 },
  print:   { price: 1299, oldPrice: 1999 },
  embroi:  { price: 750,  oldPrice: 1299 }
};

/* Saree measurements shown on every product page (same for the whole category) */
const SPECS = {
  base:   [["Width", "50 inch"], ["Border", "3 inch"]],
  print:  [["Width", "50 inch"], ["Saree length", "6.50 metres"], ["Print length", "6.50 metres"], ["Border", "3 inch"]],
  embroi: [["Width", "50 inch"], ["Saree length", "6.25 metres"], ["Border", "3 inch"]]
};
function I(slug) { return "images/sarees/" + slug + ".webp"; }

const PRODUCTS = [
  /* ---------- Base Sarees (plain Kerala cotton, ready for custom print / embroidery) ---------- */
  {
    id: "NTB01", name: "Plain Kerala Cotton Saree – Broad Gold Zari Border", category: "Base Sarees",
    image: I("plain-kerala-cotton-saree-broad-gold-zari-border"), gallery: [],
    alt: "Folded plain off-white Kerala cotton saree with a broad gold zari border",
    shortDescription: "Classic off-white Kerala cotton with a broad gold zari border.",
    details: "Pure off-white Kerala cotton saree with a broad gold zari border and pallu. Wear it plain for Onam, Vishu and temple visits, or send us your design and we will add custom printing or embroidery on this base.",
    specs: SPECS.base, price: PRICE.plain.price, oldPrice: PRICE.plain.oldPrice, inStock: true, featured: true
  },
  {
    id: "NTB02", name: "Kerala Cotton Zebra Saree – Gold Stripes & Zari Border", category: "Base Sarees",
    image: I("kerala-cotton-saree-gold-stripes-zari-border"), gallery: [],
    alt: "Off-white Kerala cotton zebra saree with thin gold stripes and a wide gold zari border",
    shortDescription: "Off-white cotton with fine gold stripes and a wide zari border.",
    details: "Off-white Kerala cotton saree woven with fine gold stripes across the body and a wide gold zari border. Elegant on its own and a lovely base for custom embroidery.",
    specs: SPECS.base, price: PRICE.zebra.price, oldPrice: PRICE.zebra.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTB03", name: "Kerala Cotton Checked Saree – Gold Checks & Zari Border", category: "Base Sarees",
    image: I("kerala-cotton-saree-gold-checks-zari-border"), gallery: [],
    alt: "Off-white Kerala cotton saree with small gold checks and a broad gold zari border",
    shortDescription: "Off-white cotton with small gold checks and a broad zari border.",
    details: "Off-white Kerala cotton saree with small gold checks (kattam) all over and a broad gold zari border. A festive classic, also available with custom printing or embroidery.",
    specs: SPECS.base, price: PRICE.checked.price, oldPrice: PRICE.checked.oldPrice, inStock: true, featured: false
  },

  /* ---------- Printed Sarees ---------- */
  {
    id: "NTP01", name: "Kerala Cotton Saree – Green & Blue Floral Print", category: "Printed Sarees",
    image: I("green-blue-floral-printed-kerala-cotton-saree"), gallery: [I("green-blue-floral-printed-kerala-cotton-saree-poster")],
    alt: "Off-white Kerala cotton saree with green and blue floral prints and a gold zari border, draped on a mannequin",
    shortDescription: "Green and blue floral prints with a gold zari border.",
    details: "Off-white Kerala cotton saree printed with green and blue floral vines on the body, border and pallu, finished with a gold zari border. Soft, breathable and comfortable all day.",
    specs: SPECS.print, price: PRICE.print.price, oldPrice: PRICE.print.oldPrice, inStock: true, featured: true
  },
  {
    id: "NTP02", name: "Kerala Cotton Saree – Maroon Stripe & Mustard Print", category: "Printed Sarees",
    image: I("maroon-stripe-mustard-printed-kerala-cotton-saree"), gallery: [],
    alt: "Off-white Kerala cotton saree with maroon stripes, mustard floral print and gold zari border, draped on a mannequin",
    shortDescription: "Maroon stripes and mustard florals with a gold zari border.",
    details: "Off-white Kerala cotton saree with a striped maroon pallu, mustard floral print and a black geometric border, finished with gold zari. A bold, festive printed saree.",
    specs: SPECS.print, price: PRICE.print.price, oldPrice: PRICE.print.oldPrice, inStock: true, featured: true
  },
  {
    id: "NTP03", name: "Kerala Cotton Saree – Teal & Mustard Print", category: "Printed Sarees",
    image: I("teal-mustard-printed-kerala-cotton-saree"), gallery: [],
    alt: "Off-white Kerala cotton saree with teal and mustard yellow prints and a gold zari border, draped on a mannequin",
    shortDescription: "Teal and mustard prints with a gold zari border.",
    details: "Off-white Kerala cotton saree with teal motifs and mustard bands on the pallu and pleats, finished with a gold zari border. Bright and cheerful for functions and festivals.",
    specs: SPECS.print, price: PRICE.print.price, oldPrice: PRICE.print.oldPrice, inStock: true, featured: true
  },
  {
    id: "NTP04", name: "Kerala Cotton Saree – Orange & Blue Print", category: "Printed Sarees",
    image: I("orange-blue-printed-kerala-cotton-saree"), gallery: [],
    alt: "Off-white Kerala cotton saree with orange zigzag and blue floral prints, draped on a mannequin",
    shortDescription: "Orange zigzag and blue floral prints on white cotton.",
    details: "Off-white Kerala cotton saree with a blue floral border and an orange zigzag pallu. Light, modern and easy to wear every day.",
    specs: SPECS.print, price: PRICE.print.price, oldPrice: PRICE.print.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTP05", name: "Kerala Cotton Saree – Lavender & Green Print", category: "Printed Sarees",
    image: I("lavender-green-printed-kerala-cotton-saree"), gallery: [],
    alt: "Off-white Kerala cotton saree with lavender and green prints and a silver-white border, draped on a mannequin",
    shortDescription: "Soft lavender and green prints on white cotton.",
    details: "Off-white Kerala cotton saree with soft lavender and green printed bands on the border and pallu. Gentle pastel colours for day functions.",
    specs: SPECS.print, price: PRICE.print.price, oldPrice: PRICE.print.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTP06", name: "Kerala Cotton Saree – Black & Grey Block Print", category: "Printed Sarees",
    image: I("black-grey-block-printed-kerala-cotton-saree"), gallery: [],
    alt: "Off-white Kerala cotton saree with black and grey block prints and a silver border, draped on a mannequin",
    shortDescription: "Monochrome black and grey block prints.",
    details: "Off-white Kerala cotton saree with black and grey block prints on the border and pallu. Simple, graceful and great for office and everyday wear.",
    specs: SPECS.print, price: PRICE.print.price, oldPrice: PRICE.print.oldPrice, inStock: true, featured: false
  },

  /* ---------- Embroidery Sarees ---------- */
  {
    id: "NTE01", name: "Peacock Embroidered Kerala Cotton Saree with Tassels", category: "Embroidery Sarees",
    image: I("peacock-embroidered-kerala-cotton-saree-tassels"), gallery: [],
    alt: "White Kerala cotton sarees with gold peacock embroidery, flower vine zari border and coloured tassels",
    shortDescription: "Gold peacock embroidery, flower vine border and tassels.",
    details: "White Kerala cotton saree with large gold-thread peacock embroidery, a gold zari border embroidered with a flower vine, and tassels on the pallu. Available with green, multicolour, purple or maroon tassels.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: true
  },
  {
    id: "NTE02", name: "Kerala Cotton Saree – Baby Krishna Embroidery (Blue)", category: "Embroidery Sarees",
    image: I("baby-krishna-embroidered-kerala-cotton-saree-blue"), gallery: [],
    alt: "White Kerala cotton saree with blue baby Krishna embroidery and a gold zari border",
    shortDescription: "Baby Krishna embroidery in blue with a gold zari border.",
    details: "White Kerala cotton saree embroidered with baby Krishna (Kannan) motifs in blue and gold along the pallu, with small butis and a gold zari border. Perfect for Janmashtami, Guruvayur visits and festivals.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: true
  },
  {
    id: "NTE03", name: "Kerala Cotton Saree – Dancing Peacock Embroidery", category: "Embroidery Sarees",
    image: I("dancing-peacock-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton sarees with colourful dancing peacock embroidery, gold zari border and tassels",
    shortDescription: "Colourful dancing peacocks with a gold zari border.",
    details: "White Kerala cotton saree with colourful dancing peacock embroidery, a gold zari border with bird motifs and tasselled pallu. A cheerful festive saree.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: true
  },
  {
    id: "NTE04", name: "Kerala Cotton Saree – Gold Peacock Vine Embroidery", category: "Embroidery Sarees",
    image: I("gold-peacock-vine-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton saree with gold leaf vines and green peacock embroidery and a bright gold zari border",
    shortDescription: "Gold leaf vines and peacocks all over the pallu.",
    details: "White Kerala cotton saree with rich gold-thread leaf vines and green and maroon peacocks across the pallu, small butis on the body and a bright gold zari border. A grand choice for weddings and Onam.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: true
  },
  {
    id: "NTE17", name: "Kerala Cotton Saree – Magenta & Gold Diamond Embroidery", category: "Embroidery Sarees",
    image: I("magenta-gold-diamond-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton saree with magenta and gold diamond flower embroidery and an embroidered gold zari border",
    shortDescription: "Magenta and gold diamond motifs with an embroidered zari border.",
    details: "White Kerala cotton saree with large diamond motifs of tiny flowers embroidered half in magenta and half in gold, and a broad gold zari border embroidered with magenta diamonds and gold flowers. Rich and festive, perfect for Onam and weddings.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: true
  },
  {
    id: "NTE05", name: "Kerala Cotton Saree – Multicolour Peacock Embroidery", category: "Embroidery Sarees",
    image: I("multicolour-peacock-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton saree with multicolour peacock embroidery on the pallu and a gold zari border",
    shortDescription: "Multicolour peacocks on the pallu with a gold border.",
    details: "White Kerala cotton saree with a row of multicolour peacock embroidery on the pallu, small butis on the body and a gold zari border.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTE06", name: "Kerala Cotton Saree – Green Peacock Embroidery with Tassels", category: "Embroidery Sarees",
    image: I("green-peacock-embroidered-kerala-cotton-saree-tassels"), gallery: [],
    alt: "White Kerala cotton saree with green and gold peacock embroidery, floral zari border and maroon tassels",
    shortDescription: "Green and gold peacocks, floral border and tassels.",
    details: "White Kerala cotton saree with green and gold peacock embroidery on the pallu, leaf butis on the body, an embroidered floral zari border and maroon tassels.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTE07", name: "Kerala Cotton Saree – Orange Peacock Border Embroidery", category: "Embroidery Sarees",
    image: I("orange-peacock-border-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton saree with orange and green peacock embroidery along the border and a gold zari border",
    shortDescription: "Orange peacocks along the border with flower butis.",
    details: "White Kerala cotton saree with orange and green peacock embroidery running along the border, small flower butis and a gold zari border.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTE08", name: "Kerala Cotton Saree – Peacock & Blue Vine Embroidery", category: "Embroidery Sarees",
    image: I("peacock-blue-vine-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton saree with pink and blue peacock embroidery, a blue vine border and gold zari border",
    shortDescription: "Pink and blue peacocks with a blue vine border.",
    details: "White Kerala cotton saree embroidered with pink and blue peacocks on the pallu, a blue flower-vine border and a gold zari border.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTE09", name: "Kerala Cotton Saree – Krishna Embroidery (Red)", category: "Embroidery Sarees",
    image: I("krishna-embroidered-kerala-cotton-saree-red"), gallery: [],
    alt: "White Kerala cotton saree with red and gold Krishna embroidery on the pallu and a gold zari border",
    shortDescription: "Krishna embroidery in red and gold.",
    details: "White Kerala cotton saree embroidered with Krishna motifs in red, peach and gold along the pallu, with small butis and a gold zari border.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTE10", name: "Kerala Cotton Saree – Pink Lotus Mandala Embroidery", category: "Embroidery Sarees",
    image: I("pink-lotus-mandala-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton saree with pink lotus mandala embroidery, zigzag border and gold zari border",
    shortDescription: "Pink lotus mandalas with a zigzag border.",
    details: "White Kerala cotton saree with pink and red lotus mandala embroidery on the pallu, a zigzag embroidered border, small butis and a gold zari border.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTE11", name: "Kerala Cotton Saree – Purple Lotus Mandala Embroidery", category: "Embroidery Sarees",
    image: I("purple-lotus-mandala-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton saree with purple and gold lotus mandala embroidery, zigzag border and gold zari border",
    shortDescription: "Purple and gold lotus mandalas with a zigzag border.",
    details: "White Kerala cotton saree with purple and gold lotus mandala embroidery on the pallu, a zigzag embroidered border and a gold zari border.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTE12", name: "Kerala Cotton Saree – Green & Gold Lotus Embroidery", category: "Embroidery Sarees",
    image: I("green-gold-lotus-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton saree with green and gold lotus embroidery, zigzag border and gold zari border",
    shortDescription: "Green and gold lotus motifs with a zigzag border.",
    details: "White Kerala cotton saree with green and gold lotus embroidery on the pallu, a zigzag embroidered border, leaf butis and a gold zari border.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTE13", name: "Kerala Cotton Saree – Red & Blue Flower Embroidery", category: "Embroidery Sarees",
    image: I("red-blue-flower-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton saree with large red and blue flower embroidery in gold and an embroidered gold zari border",
    shortDescription: "Large red and blue flowers with a rich embroidered border.",
    details: "White Kerala cotton saree with large red and blue flower medallions outlined in gold thread, and a broad gold zari border fully embroidered with red and blue flowers.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTE14", name: "Kerala Cotton Saree – Pink & Blue Paisley Embroidery", category: "Embroidery Sarees",
    image: I("pink-paisley-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "Kerala cotton saree with large pink, blue and gold paisley embroidery and a gold zari border",
    shortDescription: "Large pink, blue and gold paisleys (manga design).",
    details: "Kerala cotton saree with large pink, blue and gold paisley (manga) embroidery on the pallu, small paisley butis and a gold zari border.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTE15", name: "Kerala Cotton Saree – Black Bird Embroidery", category: "Embroidery Sarees",
    image: I("black-bird-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton saree with black and grey bird embroidery, swirl border and gold zari border",
    shortDescription: "Black and grey birds with a swirl border.",
    details: "White Kerala cotton saree with black and grey bird embroidery on the pallu, a swirl embroidered border, black butis and a gold zari border. A striking monochrome look.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  },
  {
    id: "NTE16", name: "Kerala Cotton Saree – Black Floral Embroidery", category: "Embroidery Sarees",
    image: I("black-floral-embroidered-kerala-cotton-saree"), gallery: [],
    alt: "White Kerala cotton saree with black and grey floral embroidery on the pallu and a gold zari border",
    shortDescription: "Black and grey flowers all over the pallu.",
    details: "White Kerala cotton saree with black and grey flower embroidery across the pallu, small black butis on the body and a gold zari border.",
    specs: SPECS.embroi, price: PRICE.embroi.price, oldPrice: PRICE.embroi.oldPrice, inStock: true, featured: false
  }
];
