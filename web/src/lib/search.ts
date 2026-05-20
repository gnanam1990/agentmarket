import Fuse from "fuse.js";
import { REGISTRY, type Service } from "./registry";

const fuse = new Fuse<Service>(REGISTRY.services, {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "description", weight: 0.3 },
    { name: "tags", weight: 0.15 },
    { name: "category", weight: 0.05 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
});

export function searchServices(query: string): Service[] {
  const q = query.trim();
  if (!q) return REGISTRY.services;
  return fuse.search(q).map((r) => r.item);
}

export function filterByCategory(services: Service[], categoryId: string | null): Service[] {
  if (!categoryId) return services;
  return services.filter((s) => s.category === categoryId);
}
