export const SIZE_CHARTS = [
  {
    id: "tops",
    label: "Tops & jackets",
    title: "Tops and jackets (cm)",
    headers: ["Size", "Chest", "Length", "Shoulder"],
    rows: [
      ["XS", "88", "64", "40"],
      ["S", "94", "67", "42"],
      ["M", "100", "70", "44"],
      ["L", "106", "73", "46"],
      ["XL", "112", "76", "48"],
      ["XXL", "118", "79", "50"],
    ],
  },
  {
    id: "bottoms-letter",
    label: "Leggings & joggers",
    title: "Leggings, joggers and shorts (cm)",
    headers: ["Size", "Waist", "Hip"],
    rows: [
      ["XS", "64", "88"],
      ["S", "68", "92"],
      ["M", "72", "96"],
      ["L", "77", "101"],
      ["XL", "82", "106"],
      ["XXL", "87", "111"],
    ],
  },
  {
    id: "bottoms-waist",
    label: "Trousers",
    title: "Trousers (waist size in inches)",
    headers: ["Size", "Waist (cm)", "Hip (cm)"],
    rows: [
      ["28", "71", "94"],
      ["30", "76", "99"],
      ["32", "81", "104"],
      ["34", "86", "109"],
      ["36", "91", "114"],
    ],
  },
];

export const HOW_TO_MEASURE = [
  "Chest: measure around the fullest part of your chest, keeping the tape level.",
  "Waist: measure around your natural waistline, above the belly button.",
  "Hip: measure around the fullest part of your hips.",
  "Between sizes? Size up for a relaxed fit, size down for a closer fit.",
];

const BOTTOM_TYPES = ["Trousers", "Joggers", "Shorts", "Leggings"];

// Which chart to show first for a product
export function defaultChartFor(product) {
  if (product.sizes.some((s) => /^\d+$/.test(s))) return "bottoms-waist";
  if (BOTTOM_TYPES.includes(product.type)) return "bottoms-letter";
  return "tops";
}
