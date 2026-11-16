export const PER_PAGE = 12;

export const SORT_OPTIONS = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const COLLECTIONS = [
  { value: "new-arrivals", label: "New arrivals", blurb: "The latest drops." },
  {
    value: "best-sellers",
    label: "Best sellers",
    blurb: "Customer favourites.",
  },
  {
    value: "trending",
    label: "Trending now",
    blurb: "What everyone's wearing.",
  },
  { value: "sale", label: "Sale", blurb: "Selected pieces, reduced." },
];
export const COLLECTION_LABELS = Object.fromEntries(
  COLLECTIONS.map((c) => [c.value, c.label]),
);
export const COLLECTION_BLURBS = Object.fromEntries(
  COLLECTIONS.map((c) => [c.value, c.blurb]),
);

export const PRICE_PRESETS = [
  { min: null, max: 20000 },
  { min: 20000, max: 40000 },
  { min: 40000, max: null },
];
