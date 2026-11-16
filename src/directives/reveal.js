// Usage: v-reveal  or  v-reveal="{ delay: 120 }"
let io;
function getObserver() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
  }
  return io;
}

export default {
  created(el, { value }) {
    el.setAttribute("data-reveal", "");
    if (value?.delay)
      el.style.setProperty("--reveal-delay", `${value.delay}ms`);
  },
  mounted(el) {
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    getObserver().observe(el);
  },
  unmounted(el) {
    io?.unobserve(el);
  },
};
