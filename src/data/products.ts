import type { Product } from "@/types";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

const STANDARD_DETAILS = [
  { label: "Material", value: "Breathable polyester, 140 GSM" },
  { label: "Fit", value: "Regular / true to size" },
  { label: "Collar", value: "Ribbed knit with contrast trim" },
  { label: "Care", value: "Machine wash cold, hang dry" },
  { label: "Delivery", value: "Dispatched within 24 hours" },
];

const RETRO_DETAILS = [
  { label: "Material", value: "Vintage-style polyester, soft handle" },
  { label: "Fit", value: "Relaxed, retro-inspired" },
  { label: "Collar", value: "White rib crew neck" },
  { label: "Care", value: "Machine wash cold, do not iron print" },
  { label: "Delivery", value: "Dispatched within 24 hours" },
];

export const products: Product[] = [
  {
    id: "p-real-madrid-home",
    slug: "real-madrid-home",
    name: "Real Madrid Home Jersey",
    category: "club",
    categoryLabel: "Club Jerseys",
    price: 2450,
    compareAtPrice: 2800,
    image: "/images/products/real-madrid-home.jpg",
    sizes: ALL_SIZES,
    shortDescription: "Classic white with navy trim and gold detailing.",
    description:
      "A crisp white classic finished with navy trim at the collar and cuffs. Cut from a breathable recycled polyester that keeps its shape wash after wash — the everyday kit for match days, training sessions and everything in between.",
    details: STANDARD_DETAILS,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 126,
  },
  {
    id: "p-barcelona-home",
    slug: "barcelona-home",
    name: "FC Barcelona Home Jersey",
    category: "club",
    categoryLabel: "Club Jerseys",
    price: 2200,
    compareAtPrice: 2500,
    image: "/images/photos/barcelona.jpg",
    sizes: ALL_SIZES,
    shortDescription: "Bold garnet and blaugrana stripes in a soft, light weave.",
    description:
      "Signature blaugrana stripes in a lightweight, quick-dry weave with flatlocked seams for comfort. The stretchy rib collar keeps its shape and the printed club crest sits proudly on the chest.",
    details: STANDARD_DETAILS,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 98,
  },
  {
    id: "p-man-utd-home",
    slug: "man-utd-home",
    name: "Manchester United Home Jersey",
    category: "club",
    categoryLabel: "Club Jerseys",
    price: 2350,
    compareAtPrice: 2600,
    image: "/images/products/man-utd-home.jpg",
    sizes: ALL_SIZES,
    shortDescription: "Iconic red with crisp white detailing and a soft finish.",
    description:
      "A faithful take on the classic red home shirt: clean white collar and sleeve trim, tonal crest embroidery and a structured cut that holds its silhouette. A supporter staple in every collection.",
    details: STANDARD_DETAILS,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 143,
  },
  {
    id: "p-liverpool-home",
    slug: "liverpool-home",
    name: "Liverpool FC Home Jersey",
    category: "club",
    categoryLabel: "Club Jerseys",
    price: 2150,
    image: "/images/photos/liverpool.jpg",
    sizes: ALL_SIZES,
    shortDescription: "Deep red, featherlight and built for the stands.",
    description:
      "Bright red, featherlight and cut for the stands. The diamond-knit fabric moves with you, the crest is heat-transferred for extra durability, and the taped neckline stays comfortable all match long.",
    details: STANDARD_DETAILS,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 210,
  },
  {
    id: "p-argentina-home",
    slug: "argentina-home",
    name: "Argentina National Team Jersey",
    category: "national",
    categoryLabel: "National Teams",
    price: 2400,
    compareAtPrice: 2650,
    image: "/images/photos/argentina.jpg",
    sizes: ALL_SIZES,
    shortDescription: "Sky blue and white stripes with the classic golden crest.",
    description:
      "Sky blue and white stripes in a smooth, cool-touch fabric with the golden crest embroidered on the chest. The cut is slightly longer in the body for a modern, relaxed match-day fit.",
    details: STANDARD_DETAILS,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 187,
  },
  {
    id: "p-brazil-home",
    slug: "brazil-home",
    name: "Brazil National Team Jersey",
    category: "national",
    categoryLabel: "National Teams",
    price: 1950,
    compareAtPrice: 2300,
    image: "/images/products/brazil-home.jpg",
    sizes: ALL_SIZES,
    shortDescription: "Canarinho yellow with a green hem and gold crest.",
    description:
      "Bright canarino yellow with a deep green hem block and a gold crest badge. A breathable, wicking fabric keeps things cool, while the dropped shoulder keeps the silhouette modern and easy.",
    details: STANDARD_DETAILS,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 154,
  },
  {
    id: "p-ac-milan-retro",
    slug: "ac-milan-retro",
    name: "AC Milan Retro Jersey",
    category: "retro",
    categoryLabel: "Retro Jerseys",
    price: 2250,
    compareAtPrice: 2500,
    image: "/images/products/ac-milan-retro.png",
    sizes: ALL_SIZES,
    shortDescription: "Rossoneri stripes straight from the late nineties.",
    description:
      "A faithful retro cut: bold red and black stripes, a soft white crew collar and the vintage crest. Made for fans who remember the noise, and for everyone who wants a kit that never dates.",
    details: RETRO_DETAILS,
    isBestSeller: true,
    isNew: true,
    rating: 4.8,
    reviewCount: 96,
  },
  {
    id: "p-classic-retro",
    slug: "classic-retro",
    name: "Classic Football Retro Jersey",
    category: "retro",
    categoryLabel: "Retro Jerseys",
    price: 1650,
    image: "/images/products/classic-retro.jpg",
    sizes: ALL_SIZES,
    shortDescription: "A vintage number-print cut straight from the nineties.",
    description:
      "A collectable nineties silhouette: worn-in red, a big stitched number on the back and soft, faded cotton. Lightweight, unmistakably retro and easy to style with denim or joggers.",
    details: RETRO_DETAILS,
    isBestSeller: true,
    rating: 4.5,
    reviewCount: 74,
  },
  {
    id: "p-juventus-home",
    slug: "juventus-home",
    name: "Juventus Home Jersey",
    category: "club",
    categoryLabel: "Club Jerseys",
    price: 2400,
    image: "/images/photos/juventus.jpg",
    sizes: ALL_SIZES,
    shortDescription: "Black and white stripes with a bright blue finish.",
    description:
      "Bold black and white stripes in a textured, diamond-knit fabric with bright blue shoulder detailing. A modern classic with a slightly boxy, oversized fit.",
    details: STANDARD_DETAILS,
    isNew: true,
    rating: 4.7,
    reviewCount: 88,
  },
  {
    id: "p-chelsea-home",
    slug: "chelsea-home",
    name: "Chelsea FC Home Jersey",
    category: "club",
    categoryLabel: "Club Jerseys",
    price: 2050,
    image: "/images/products/chelsea-home.png",
    sizes: ALL_SIZES,
    shortDescription: "Deep royal blue with a clean, modern finish.",
    description:
      "Deep royal blue in a smooth, low-profile weave. Minimal detailing keeps it sharp, while the elasticated hem and side vents keep it comfortable through a full match.",
    details: STANDARD_DETAILS,
    isNew: true,
    rating: 4.5,
    reviewCount: 61,
  },
  {
    id: "p-germany-home",
    slug: "germany-home",
    name: "Germany National Team Jersey",
    category: "national",
    categoryLabel: "National Teams",
    price: 1850,
    image: "/images/products/germany-home.png",
    sizes: ALL_SIZES,
    shortDescription: "White with the iconic black and red chest band.",
    description:
      "Crisp white with the iconic chest band in black and red, finished with a gold crest badge. Lightweight and cool to the touch, made for long summer evenings in the stands.",
    details: STANDARD_DETAILS,
    isNew: true,
    rating: 4.4,
    reviewCount: 52,
  },
  {
    id: "p-france-home",
    slug: "france-home",
    name: "France National Team Jersey",
    category: "national",
    categoryLabel: "National Teams",
    price: 2300,
    image: "/images/products/france-home.png",
    sizes: ALL_SIZES,
    shortDescription: "Deep blue with a sharp white V-neck trim.",
    description:
      "Deep blue with a sharp white V-neck trim and a woven crest. The fabric has a subtle sheen and a slightly athletic cut that works just as well off the pitch.",
    details: STANDARD_DETAILS,
    isNew: true,
    rating: 4.6,
    reviewCount: 47,
  },
  {
    id: "p-bayern-home",
    slug: "bayern-home",
    name: "Bayern Munich Home Jersey",
    category: "club",
    categoryLabel: "Club Jerseys",
    price: 2250,
    image: "/images/products/bayern-home.png",
    sizes: ALL_SIZES,
    shortDescription: "Bavarian red with a clean diagonal flash.",
    description:
      "Bavarian red with a clean diagonal flash across the body and crisp white trim. Built with a stretch-knit side panel for a close, comfortable fit.",
    details: STANDARD_DETAILS,
    isNew: true,
    rating: 4.6,
    reviewCount: 58,
  },
  {
    id: "p-spain-home",
    slug: "spain-home",
    name: "Spain National Team Jersey",
    category: "national",
    categoryLabel: "National Teams",
    price: 2100,
    compareAtPrice: 2350,
    image: "/images/products/spain-home.jpg",
    sizes: ALL_SIZES,
    shortDescription: "Bold red with gold trim across the shoulders.",
    description:
      "Bold red with gold shoulder trim in a smooth, breathable weave. A supporter favourite that looks as sharp on the street as it does in the stands.",
    details: STANDARD_DETAILS,
    isNew: true,
    rating: 4.7,
    reviewCount: 64,
  },
  {
    id: "p-mexico-home",
    slug: "mexico-home",
    name: "Mexico National Team Jersey",
    category: "national",
    categoryLabel: "National Teams",
    price: 1900,
    image: "/images/products/mexico-home.jpg",
    sizes: ALL_SIZES,
    shortDescription: "Deep green with a fine tonal stripe pattern.",
    description:
      "Deep green with a fine tonal stripe pattern and a light, airy knit. Cool to wear, easy to match and unmistakably national.",
    details: STANDARD_DETAILS,
    isNew: true,
    rating: 4.4,
    reviewCount: 41,
  },
  {
    id: "p-pro-training-top",
    slug: "pro-training-top",
    name: "Pro Training Top",
    category: "training",
    categoryLabel: "Training Wear",
    price: 1450,
    compareAtPrice: 1700,
    badge: "Training",
    image: "/images/products/pro-training-top.png",
    sizes: ALL_SIZES,
    shortDescription: "Sleek quarter-zip training top in deep navy.",
    description:
      "A lightweight quarter-zip training top with a smooth, matte finish and contrast piping. Built for warm-ups, gym days and the walk to the pitch.",
    details: [
      { label: "Material", value: "Lightweight polyester fleece, 130 GSM" },
      { label: "Fit", value: "Athletic, close to body" },
      { label: "Collar", value: "Quarter zip with chin guard" },
      { label: "Care", value: "Machine wash cold, tumble dry low" },
      { label: "Delivery", value: "Dispatched within 24 hours" },
    ],
    isNew: true,
    rating: 4.3,
    reviewCount: 39,
  },
];

export const productCategories = [
  { value: "club", label: "Club Jerseys", image: "/images/photos/category-club.jpg" },
  { value: "national", label: "National Team Jerseys", image: "/images/photos/category-national.jpg" },
  { value: "retro", label: "Retro Jerseys", image: "/images/photos/category-retro.jpg" },
  { value: "training", label: "Training Wear", image: "/images/products/pro-training-top.png" },
] as const;

export const filterOptions = [
  { value: "all", label: "All" },
  { value: "club", label: "Club" },
  { value: "national", label: "National Teams" },
  { value: "retro", label: "Retro" },
] as const;

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products;
  return products.filter((product) => product.category === category);
}

export const bestSellers = products.filter((product) => product.isBestSeller);

export const newArrivals = products.filter((product) => product.isNew);

export function searchProducts(query: string): Product[] {
  const term = query.trim().toLowerCase();
  if (!term) return products;
  return products.filter((product) => {
    const haystack = `${product.name} ${product.categoryLabel} ${product.shortDescription}`.toLowerCase();
    return haystack.includes(term);
  });
}
