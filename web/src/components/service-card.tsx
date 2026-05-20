import { Sparkles, Check, Shield } from "lucide-react";
import type { Service } from "../lib/registry";
import { formatPrice } from "../lib/format";

interface Props {
  service: Service;
  onOpen: () => void;
}

export function ServiceCard({ service, onOpen }: Props) {
  const price = formatPrice(service.price_raw, service.price_decimals);
  return (
    <button
      onClick={onOpen}
      className="text-left flex flex-col h-full bg-kite-card border border-kite-border rounded-xl p-5 shadow-xs hover:border-kite-primary/40 hover:shadow-sm transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-kite-primary/15 text-kite-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        {service.verified ? (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-kite-accent/15 text-kite-accent text-[10px] uppercase tracking-widest font-bold">
            <Check className="w-3 h-3" />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-kite-muted border border-kite-border text-kite-fg/55 text-[10px] uppercase tracking-widest font-bold">
            <Shield className="w-3 h-3" />
            Unverified
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold tracking-tight text-kite-fg mb-1.5">
        {service.name}
      </h3>
      <p className="text-sm text-kite-fg/65 leading-relaxed mb-4 line-clamp-3 flex-1">
        {service.description}
      </p>

      <div className="flex items-end justify-between pt-3 border-t border-kite-border/60">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-kite-fg/45 font-bold">
            Per call
          </div>
          <div className="font-mono text-sm font-semibold text-kite-fg tabular-nums">
            {price} <span className="text-kite-fg/45 text-xs">{service.price_symbol}</span>
          </div>
        </div>
        <div className="text-[11px] text-kite-fg/55 text-right">
          <div>by {service.provider_name}</div>
          <div className="text-kite-fg/40 mt-0.5">{service.network}</div>
        </div>
      </div>
    </button>
  );
}
