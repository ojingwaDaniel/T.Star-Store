import { SITE } from "@/config/site";
import { ZONES, findState } from "@/config/locations";

// Client-side estimate for the cart. Checkout asks the server for the authoritative quote.
export function estimateDelivery(subtotal, stateName) {
  const state = findState(stateName);
  const zone = state?.zone || "A";
  const free = subtotal >= SITE.freeDeliveryThreshold && subtotal > 0;
  return {
    fee: subtotal <= 0 || free ? 0 : ZONES[zone].fee,
    zone,
    exact: !!state, // false = no state chosen yet, so this is the lowest rate
    freeDeliveryApplied: free,
    estimatedDays: ZONES[zone].days,
  };
}
