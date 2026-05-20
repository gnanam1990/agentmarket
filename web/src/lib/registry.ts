import registryJson from "../../../registry/services.json";

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ServiceInputSchema {
  type: "object";
  required?: string[];
  properties: Record<
    string,
    {
      type: string;
      description?: string;
      maxLength?: number;
      enum?: string[];
      default?: unknown;
      format?: string;
    }
  >;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  endpoint: string;
  method: "GET" | "POST";
  price_raw: string;
  price_decimals: number;
  price_token: string;
  price_symbol: string;
  network: "mainnet" | "testnet";
  provider_address: string;
  provider_name: string;
  provider_agentid?: string;
  input_schema: ServiceInputSchema;
  output_schema: Record<string, unknown>;
  example_input: Record<string, unknown>;
  tags: string[];
  submitted_at: string;
  verified: boolean;
}

export interface Registry {
  version: string;
  updated_at: string;
  categories: Category[];
  services: Service[];
}

export const REGISTRY: Registry = registryJson as unknown as Registry;

export function findService(id: string): Service | null {
  return REGISTRY.services.find((s) => s.id === id) ?? null;
}

export function findCategory(id: string): Category | null {
  return REGISTRY.categories.find((c) => c.id === id) ?? null;
}
