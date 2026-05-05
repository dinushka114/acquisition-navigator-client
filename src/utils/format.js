export function formatMoney(n) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return `Rs. ${Number(n).toLocaleString("en-LK")}`;
}

export function snippet(text, max = 120) {
  if (!text) return "";
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}
