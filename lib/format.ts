export function formatINR(amount: number): string {
  if (isNaN(amount)) return "₹0.00";
  const negative = amount < 0;
  const abs = Math.abs(amount);
  const [intPart, decPart] = abs.toFixed(2).split(".");
  const lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const formattedRest = rest
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")
    : "";
  const formattedInt = formattedRest
    ? `${formattedRest},${lastThree}`
    : lastThree || "0";
  return `${negative ? "-" : ""}₹${formattedInt}.${decPart}`;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCompact(value: number): string {
  if (value >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(2)}Cr`;
  }
  if (value >= 1_00_000) {
    return `₹${(value / 1_00_000).toFixed(2)}L`;
  }
  return formatINR(value);
}
