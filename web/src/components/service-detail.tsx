import { useState } from "react";
import { ArrowLeft, Check, Shield, Play, ExternalLink } from "lucide-react";
import type { Service } from "../lib/registry";
import { AddressDisplay } from "./address-display";
import { PreviewBadge } from "./preview-badge";
import { CodeSnippetTabs } from "./code-snippet-tabs";
import { TryItModal } from "./try-it-modal";
import { formatPrice } from "../lib/format";

interface Props {
  service: Service;
  onBack: () => void;
}

type Tab = "overview" | "integrate" | "activity";

export function ServiceDetail({ service, onBack }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [tryOpen, setTryOpen] = useState(false);
  const price = formatPrice(service.price_raw, service.price_decimals);

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-xs font-semibold text-kite-fg/60 hover:text-kite-fg mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div className="min-w-0">
          <div className="flex items-start gap-3 mb-4 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-kite-fg">
              {service.name}
            </h1>
            {service.verified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-kite-accent/15 text-kite-accent text-[10px] uppercase tracking-widest font-bold">
                <Check className="w-3 h-3" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-kite-muted border border-kite-border text-kite-fg/55 text-[10px] uppercase tracking-widest font-bold">
                <Shield className="w-3 h-3" /> Unverified
              </span>
            )}
          </div>

          <p className="text-sm text-kite-fg/70 leading-relaxed mb-6">{service.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] font-mono rounded bg-kite-muted text-kite-fg/70 border border-kite-border"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 mb-5 bg-kite-card border border-kite-border rounded-lg p-1 inline-flex">
            <TabButton active={tab === "overview"} onClick={() => setTab("overview")}>
              Overview
            </TabButton>
            <TabButton active={tab === "integrate"} onClick={() => setTab("integrate")}>
              Integrate
            </TabButton>
            <TabButton active={tab === "activity"} onClick={() => setTab("activity")}>
              Activity
            </TabButton>
          </div>

          {tab === "overview" && (
            <div className="space-y-5">
              <Block title="Endpoint">
                <div className="flex items-baseline gap-2 font-mono text-sm text-kite-fg/85 break-all">
                  <span className="text-[10px] uppercase tracking-widest text-kite-primary px-1.5 py-0.5 rounded bg-kite-primary/10 font-bold">
                    {service.method}
                  </span>
                  <span>{service.endpoint}</span>
                </div>
              </Block>
              <Block title="Input schema">
                <pre className="bg-kite-bg border border-kite-border rounded-lg p-3 text-xs font-mono text-kite-fg/85 overflow-x-auto">
                  {JSON.stringify(service.input_schema, null, 2)}
                </pre>
              </Block>
              <Block title="Output schema">
                <pre className="bg-kite-bg border border-kite-border rounded-lg p-3 text-xs font-mono text-kite-fg/85 overflow-x-auto">
                  {JSON.stringify(service.output_schema, null, 2)}
                </pre>
              </Block>
              <Block title="Example input">
                <pre className="bg-kite-bg border border-kite-border rounded-lg p-3 text-xs font-mono text-kite-fg/85 overflow-x-auto">
                  {JSON.stringify(service.example_input, null, 2)}
                </pre>
              </Block>
            </div>
          )}

          {tab === "integrate" && (
            <div>
              <p className="text-sm text-kite-fg/65 mb-4">
                Pay first with a wallet, then call the endpoint with{" "}
                <code className="font-mono text-xs px-1 py-0.5 rounded bg-kite-muted">
                  Authorization: Bearer &lt;tx_hash&gt;
                </code>
                . The service decides whether to honor the call.
              </p>
              <CodeSnippetTabs service={service} />
            </div>
          )}

          {tab === "activity" && (
            <div className="bg-kite-card border border-kite-border rounded-2xl p-6 text-sm text-kite-fg/65 space-y-2">
              <div className="flex items-center gap-2">
                <PreviewBadge label="Activity" tooltip="Call tracking lands when AgentMarket has a backend. For now, on-chain payment txs to the provider address are the only signal." />
              </div>
              <p>
                Real-time call counts, latency, and uptime arrive in v0.2 with a backend. For now,
                you can browse the provider's on-chain activity:
              </p>
              {service.provider_agentid && (
                <a
                  href={service.provider_agentid}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-kite-primary hover:text-kite-fg transition-colors"
                >
                  Provider on AgentID <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-4 self-start lg:sticky lg:top-20">
          <div className="bg-kite-card border border-kite-border rounded-2xl p-5">
            <div className="text-[10px] uppercase tracking-widest text-kite-fg/45 font-bold mb-1">
              Per call
            </div>
            <div className="font-mono font-bold text-3xl text-kite-fg tabular-nums mb-3">
              {price}
              <span className="text-kite-fg/45 text-lg ml-1.5 font-medium">
                {service.price_symbol}
              </span>
            </div>
            <button
              onClick={() => setTryOpen(true)}
              className="w-full h-11 rounded-lg bg-kite-primary text-kite-bg font-semibold text-sm hover:bg-kite-primary/90 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> Try it
            </button>
            <div className="mt-3 text-[11px] text-kite-fg/55 flex items-center justify-between">
              <span>Network</span>
              <span
                className={`uppercase tracking-widest font-bold ${
                  service.network === "mainnet" ? "text-kite-primary" : "text-kite-accent"
                }`}
              >
                {service.network}
              </span>
            </div>
          </div>

          <div className="bg-kite-card border border-kite-border rounded-2xl p-5">
            <div className="text-[10px] uppercase tracking-widest text-kite-fg/45 font-bold mb-2">
              Provider
            </div>
            <div className="text-base font-semibold text-kite-fg mb-1">{service.provider_name}</div>
            <AddressDisplay address={service.provider_address} className="text-xs" />
            {service.provider_agentid && (
              <a
                href={service.provider_agentid}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-kite-primary hover:text-kite-fg"
              >
                View AgentID <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="bg-kite-card/60 border border-kite-border rounded-2xl p-5 space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-kite-fg/45 font-bold">
              Stats
            </div>
            <Metric label="Total calls" value="—" preview />
            <Metric label="Reliability" value="—" preview />
            <Metric label="Uptime (30d)" value="—" preview />
          </div>
        </aside>
      </div>

      {tryOpen && <TryItModal service={service} onClose={() => setTryOpen(false)} />}
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[10px] uppercase tracking-widest font-bold text-kite-fg/55 mb-2">
        {title}
      </h3>
      {children}
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
        active ? "bg-kite-primary/15 text-kite-primary" : "text-kite-fg/60 hover:text-kite-fg"
      }`}
    >
      {children}
    </button>
  );
}

function Metric({
  label,
  value,
  preview,
}: {
  label: string;
  value: string;
  preview?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-kite-fg/60">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-sm text-kite-fg/80 tabular-nums">{value}</span>
        {preview && <PreviewBadge />}
      </div>
    </div>
  );
}
