export function isBioequivalentProduct(productName: string) {
  if (!productName) return false;
  return /\bbioequivalente\b/i.test(productName);
}
