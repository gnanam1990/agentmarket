import { useEffect, useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { X, Loader2, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import type { Service } from "../lib/registry";
import { kiteMainnet, kiteTestnet, explorerTxUrl } from "../lib/kite-chain";
import { usePayment } from "../lib/payment";
import { formatPrice } from "../lib/format";
import { PreviewBadge } from "./preview-badge";

interface Props {
  service: Service;
  onClose: () => void;
}

type Stage =
  | { kind: "form" }
  | { kind: "paying" }
  | { kind: "calling"; tx_hash: `0x${string}` }
  | { kind: "result"; tx_hash: `0x${string}`; data: unknown }
  | { kind: "error"; message: string };

export function TryItModal({ service, onClose }: Props) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { pay } = usePayment();

  const [stage, setStage] = useState<Stage>({ kind: "form" });
  const [inputs, setInputs] = useState<Record<string, unknown>>(() => ({
    ...service.example_input,
  }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const targetChainId = service.network === "mainnet" ? kiteMainnet.id : kiteTestnet.id;
  const wrongNetwork = isConnected && chainId !== targetChainId;
  const price = formatPrice(service.price_raw, service.price_decimals);

  const callService = async (txHash: `0x${string}`): Promise<unknown> => {
    const init: RequestInit = {
      method: service.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${txHash}`,
      },
    };
    if (service.method === "POST") init.body = JSON.stringify(inputs);
    const res = await fetch(service.endpoint, init);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Service responded ${res.status}: ${text.slice(0, 200)}`);
    }
    return res.json();
  };

  const handle = async () => {
    if (!isConnected) return;
    setStage({ kind: "paying" });
    try {
      if (wrongNetwork) {
        await switchChainAsync({ chainId: targetChainId });
      }
      const hash = await pay(service.price_token, service.provider_address, BigInt(service.price_raw));
      setStage({ kind: "calling", tx_hash: hash });
      const data = await callService(hash);
      setStage({ kind: "result", tx_hash: hash, data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message.split("\n")[0] : "Unknown error";
      setStage({ kind: "error", message });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-kite-fg/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-full overflow-auto bg-kite-card border border-kite-border rounded-2xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-5 sm:px-6 py-4 border-b border-kite-border flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-kite-fg">
            Try {service.name}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-kite-fg/55 hover:bg-kite-muted hover:text-kite-fg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="px-5 sm:px-6 py-5 space-y-5">
          {/* Input form */}
          <section>
            <h3 className="text-xs uppercase tracking-widest font-bold text-kite-fg/55 mb-2">
              Input
            </h3>
            <InputForm
              schema={service.input_schema}
              values={inputs}
              onChange={(next) => setInputs(next)}
            />
          </section>

          {/* Cost summary */}
          <section className="bg-kite-bg border border-kite-border rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="text-xs text-kite-fg/65">
              <div>This call will cost</div>
              <div className="font-mono font-bold text-base text-kite-fg mt-0.5">
                {price} <span className="text-kite-fg/55 text-sm">{service.price_symbol}</span>
              </div>
            </div>
            <PreviewBadge
              label="x402"
              tooltip="v0.1 uses tx-hash bearer auth as a simplified payment proof. Real HTTP 402 protocol lands in v0.2."
            />
          </section>

          {/* Action */}
          {stage.kind === "form" && !isConnected && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-kite-fg/60">Connect a wallet to pay & call</p>
              <ConnectButton label="Connect wallet" />
            </div>
          )}

          {stage.kind === "form" && isConnected && (
            <button
              onClick={handle}
              className="w-full h-12 rounded-xl bg-kite-primary text-kite-bg font-semibold text-sm tracking-tight shadow-sm hover:bg-kite-primary/90 transition-all duration-150"
            >
              {wrongNetwork
                ? `Switch to Kite ${service.network}, then pay & call`
                : `Pay ${price} ${service.price_symbol} & call`}
            </button>
          )}

          {(stage.kind === "paying" || stage.kind === "calling") && (
            <div className="flex items-center gap-2 text-sm text-kite-fg/80">
              <Loader2 className="w-4 h-4 animate-spin text-kite-primary" />
              {stage.kind === "paying" ? "Sign payment in wallet…" : "Payment sent — calling service…"}
              {stage.kind === "calling" && (
                <a
                  href={explorerTxUrl(stage.tx_hash, service.network)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-kite-primary hover:text-kite-fg"
                >
                  {stage.tx_hash.slice(0, 8)}…{stage.tx_hash.slice(-6)} <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {stage.kind === "result" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-kite-accent font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                Response received
              </div>
              <a
                href={explorerTxUrl(stage.tx_hash, service.network)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-kite-primary hover:text-kite-fg"
              >
                View payment on KiteScan <ExternalLink className="w-3 h-3" />
              </a>
              <pre className="bg-kite-bg border border-kite-border rounded-lg p-3 text-xs font-mono text-kite-fg/85 overflow-x-auto max-h-[280px]">
                {JSON.stringify(stage.data, null, 2)}
              </pre>
              <button
                onClick={() => setStage({ kind: "form" })}
                className="text-xs font-semibold text-kite-primary hover:text-kite-fg"
              >
                Run again
              </button>
            </div>
          )}

          {stage.kind === "error" && (
            <div className="px-4 py-3 rounded-lg bg-kite-destructive/10 border border-kite-destructive/30 text-kite-destructive text-sm">
              <div className="flex items-center gap-2 font-semibold mb-1">
                <AlertTriangle className="w-4 h-4" />
                Couldn't complete the call
              </div>
              <p className="text-xs font-mono break-all opacity-80">{stage.message}</p>
              <button
                onClick={() => setStage({ kind: "form" })}
                className="mt-2 text-xs font-semibold text-kite-destructive/80 hover:text-kite-destructive underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InputForm({
  schema,
  values,
  onChange,
}: {
  schema: Service["input_schema"];
  values: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      {Object.entries(schema.properties).map(([name, prop]) => {
        const required = schema.required?.includes(name);
        return (
          <div key={name}>
            <label className="block text-[11px] uppercase tracking-widest text-kite-fg/55 font-semibold mb-1">
              {name}
              {required && <span className="text-kite-destructive ml-1">*</span>}
              {prop.description && (
                <span className="text-kite-fg/40 normal-case tracking-normal ml-2 font-normal">
                  {prop.description}
                </span>
              )}
            </label>
            {prop.enum ? (
              <select
                value={String(values[name] ?? prop.default ?? prop.enum[0])}
                onChange={(e) => onChange({ ...values, [name]: e.target.value })}
                className="w-full bg-kite-bg border border-kite-border focus:border-kite-primary focus:outline-none rounded-md px-3 py-2 text-sm text-kite-fg"
              >
                {prop.enum.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : prop.maxLength && prop.maxLength > 120 ? (
              <textarea
                value={String(values[name] ?? "")}
                onChange={(e) => onChange({ ...values, [name]: e.target.value })}
                rows={3}
                maxLength={prop.maxLength}
                className="w-full bg-kite-bg border border-kite-border focus:border-kite-primary focus:outline-none rounded-md px-3 py-2 text-sm text-kite-fg font-mono resize-none"
              />
            ) : (
              <input
                type="text"
                value={String(values[name] ?? "")}
                onChange={(e) => onChange({ ...values, [name]: e.target.value })}
                maxLength={prop.maxLength}
                className="w-full bg-kite-bg border border-kite-border focus:border-kite-primary focus:outline-none rounded-md px-3 py-2 text-sm text-kite-fg font-mono"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
