export function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value) && value > 0;
}
