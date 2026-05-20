import { defineChain, type Address } from "viem";

export const kiteMainnet = defineChain({
  id: 2366,
  name: "Kite Mainnet",
  nativeCurrency: { name: "Kite", symbol: "KITE", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.gokite.ai"] } },
  blockExplorers: { default: { name: "KiteScan", url: "https://kitescan.ai" } },
});

export const kiteTestnet = defineChain({
  id: 2368,
  name: "Kite Testnet",
  nativeCurrency: { name: "Kite", symbol: "KITE", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc-testnet.gokite.ai"] } },
  blockExplorers: { default: { name: "KiteScan Testnet", url: "https://testnet.kitescan.ai" } },
});

export type KiteNetwork = "mainnet" | "testnet";

export function explorerTxUrl(hash: string, network: KiteNetwork = "mainnet"): string {
  return network === "testnet"
    ? `https://testnet.kitescan.ai/tx/${hash}`
    : `https://kitescan.ai/tx/${hash}`;
}

export function isValidAddress(s: string): s is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(s);
}
