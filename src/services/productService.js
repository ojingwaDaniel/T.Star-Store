import { USE_MOCKS, ENDPOINTS } from "@/config/api";
import { http } from "./http";
import { mockBackend } from "./mock";

/**
 * params: { category, collection ('new-arrivals'|'best-sellers'|'sale'|'trending'),
 *   search, ids[], exclude, minPrice, maxPrice, sizes[], colors[],
 *   sort ('popular'|'newest'|'price-asc'|'price-desc'), page, perPage }
 * Returns { data: Product[], meta: { total, page, perPage, lastPage, facets } }
 */
export async function getProducts(params = {}) {
  if (USE_MOCKS) return (await mockBackend()).queryProducts(params);
  return http.get(ENDPOINTS.products, { params });
}

export async function getProduct(slug) {
  if (USE_MOCKS) return (await mockBackend()).findProduct(slug);
  return (await http.get(ENDPOINTS.product(slug))).data;
}

export async function getRelatedProducts(slug, limit = 4) {
  if (USE_MOCKS) return (await mockBackend()).relatedProducts(slug, limit);
  return (await http.get(ENDPOINTS.related(slug), { params: { limit } })).data;
}

export async function getReviews(slug) {
  if (USE_MOCKS) return (await mockBackend()).reviewsFor(slug);
  return (await http.get(ENDPOINTS.reviews(slug))).data;
}
