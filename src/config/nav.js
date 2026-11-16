export const NAV_LINKS = [
  {
    label: "New In",
    to: { path: "/shop", query: { collection: "new-arrivals" } },
  },
  { label: "Men", to: "/shop/men" },
  { label: "Women", to: "/shop/women" },
  { label: "Unisex", to: "/shop/unisex" },
  { label: "Streetwear", to: "/shop/streetwear" },
  { label: "Sportswear", to: "/shop/sportswear" },
  {
    label: "Sale",
    to: { path: "/shop", query: { collection: "sale" } },
    accent: true,
  },
];

export const FOOTER_LINKS = {
  help: [
    { label: "Shipping & Returns", to: "/shipping-returns" },
    { label: "Contact", to: "/contact" },
    { label: "Wishlist", to: "/wishlist" },
    { label: "Sign in", to: "/login" },
  ],
  company: [
    { label: "About T.STAR", to: "/about" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
  ],
};

// vue-router's built-in active class ignores query strings, so "New In" and "Sale"
// (both /shop) would light up together. This compares the path and collection ourselves.
export function isNavActive(route, link) {
  const to = typeof link.to === "string" ? { path: link.to } : link.to;
  if (route.path !== to.path) return false;
  return (route.query.collection || undefined) === to.query?.collection;
}
