
export function equalsIgnoreCase(
  a: string | undefined,
  b: string | undefined
): boolean {
  if (!a || !b) return false;
  return a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0;
}
