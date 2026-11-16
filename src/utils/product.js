export const LOW_STOCK = 5;

export const lineKey = (id, size, color) => `${id}|${size}|${color}`;
export const currentPrice = (p) =>
  p.salePrice != null && p.salePrice < p.price ? p.salePrice : p.price;
export const isOnSale = (p) => currentPrice(p) < p.price;
export const discountPercent = (p) =>
  isOnSale(p) ? Math.round((1 - currentPrice(p) / p.price) * 100) : 0;

export const findVariant = (p, size, color) =>
  p.variants.find((v) => v.size === size && v.color === color) || null;
export const variantStock = (p, size, color) =>
  findVariant(p, size, color)?.stock ?? 0;
export const totalStock = (p) => p.variants.reduce((n, v) => n + v.stock, 0);
export const isInStock = (p) => totalStock(p) > 0;

// Sizes with stock in at least one colour (or in the given colour)
export const availableSizes = (p, color = null) => [
  ...new Set(
    p.variants
      .filter((v) => v.stock > 0 && (!color || v.color === color))
      .map((v) => v.size),
  ),
];

export function stockLabel(stock) {
  if (stock <= 0) return "Out of stock";
  if (stock <= LOW_STOCK) return `Only ${stock} left`;
  return "In stock";
}

// Badge keys for <Badge variant="...">, most important first
export function badgesFor(p) {
  if (!isInStock(p)) return ["out"];
  const b = [];
  if (isOnSale(p)) b.push("sale");
  if (p.isNew) b.push("new");
  if (p.isBestSeller) b.push("best");
  return b;
}

// One validation used by Add to Cart AND Buy Now. Returns '' when valid.
export function selectionError(p, size, color, qty = 1) {
  if (!size && !color) return "Please select a size and a colour.";
  if (!size) return "Please select a size.";
  if (!color) return "Please select a colour.";
  const v = findVariant(p, size, color);
  if (!v) return "That size and colour combination is not available.";
  if (v.stock < 1) return "This size and colour is out of stock.";
  if (!Number.isInteger(qty) || qty < 1) return "Quantity must be at least 1.";
  if (qty > v.stock) return `Only ${v.stock} left in this size and colour.`;
  return "";
}

// Snapshot of a product + variant, used by cart lines and the Buy Now item
export function makeLine(p, size, color, quantity) {
  const v = findVariant(p, size, color);
  const swatch = p.colors.find((c) => c.name === color);
  return {
    key: lineKey(p.id, size, color),
    productId: p.id,
    slug: p.slug,
    name: p.name,
    image: p.images?.[0]?.url || "",
    sku: v?.sku || "",
    size,
    color,
    colorHex: swatch?.hex || "#0A0A0A",
    unitPrice: currentPrice(p),
    originalPrice: p.price,
    quantity,
    maxStock: v?.stock ?? 0,
  };
}
export const BADGE_LABELS = {
  new: "New",
  best: "Best Seller",
  sale: "Sale",
  out: "Sold out",
};