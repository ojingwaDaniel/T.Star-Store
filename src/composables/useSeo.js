import { watchEffect, unref } from "vue";
import { SITE } from "@/config/site";

// Per-page overrides, e.g. useSeo({ title: product.name, description: ..., image: ... })
export function useSeo(options) {
  watchEffect(() => {
    const o = unref(options) || {};
    if (o.title) document.title = `${o.title} | ${SITE.name}`;
    const set = (key, val, attr = "name") => {
      if (!val) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };
    set("description", o.description);
    set("og:title", o.title ? `${o.title} | ${SITE.name}` : "", "property");
    set("og:description", o.description, "property");
    set("og:image", o.image, "property");
  });
}
