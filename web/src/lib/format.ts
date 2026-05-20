import { formatUnits } from "viem";

export function formatPrice(raw: string, decimals: number): string {
  try {
    return parseFloat(formatUnits(BigInt(raw), decimals)).toLocaleString("en-US", {
      maximumFractionDigits: 6,
    });
  } catch {
    return "—";
  }
}

export function shortAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
