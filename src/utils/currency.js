const fmt = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});
export const formatNaira = (n) => fmt.format(Number(n) || 0);
