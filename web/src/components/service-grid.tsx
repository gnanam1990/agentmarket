import type { Service } from "../lib/registry";
import { ServiceCard } from "./service-card";

interface Props {
  services: Service[];
  onOpen: (id: string) => void;
}

export function ServiceGrid({ services, onOpen }: Props) {
  if (services.length === 0) {
    return (
      <div className="text-sm text-kite-fg/55 px-4 py-16 text-center bg-kite-card border border-kite-border rounded-2xl">
        No services match your search. Try a different query or category.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((s) => (
        <ServiceCard key={s.id} service={s} onOpen={() => onOpen(s.id)} />
      ))}
    </div>
  );
}
