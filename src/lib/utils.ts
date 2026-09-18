export function toPersianDigits(n: number | string): string {
  if (n === null || n === undefined) return "";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

export function formatPrice(price: number): string {
  if (typeof price !== "number" || isNaN(price)) return "۰ تومان";
  const formatted = price.toLocaleString("fa-IR");
  return `${formatted} تومان`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
