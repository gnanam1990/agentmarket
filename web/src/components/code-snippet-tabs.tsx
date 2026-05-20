import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Service } from "../lib/registry";

interface Props {
  service: Service;
}

type Lang = "curl" | "ts" | "python";

const LANGS: { id: Lang; label: string }[] = [
  { id: "curl", label: "curl" },
  { id: "ts", label: "TypeScript" },
  { id: "python", label: "Python" },
];

export function CodeSnippetTabs({ service }: Props) {
  const [lang, setLang] = useState<Lang>("curl");
  const [copied, setCopied] = useState(false);

  const snippet = useMemo(() => buildSnippet(lang, service), [lang, service]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-kite-card border border-kite-border rounded-xl overflow-hidden">
      <header className="px-4 py-2 border-b border-kite-border bg-kite-muted/40 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-kite-bg border border-kite-border rounded-md p-0.5">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors ${
                lang === l.id ? "bg-kite-primary text-kite-bg" : "text-kite-fg/60 hover:text-kite-fg"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded text-kite-fg/70 hover:text-kite-fg hover:bg-kite-muted transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-kite-accent" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </header>
      <pre className="px-4 py-3 text-xs font-mono text-kite-fg/85 leading-relaxed overflow-x-auto max-h-[360px]">
        {snippet}
      </pre>
    </div>
  );
}

function buildSnippet(lang: Lang, s: Service): string {
  const body = JSON.stringify(s.example_input, null, 2);
  const isPost = s.method === "POST";
  if (lang === "curl") {
    const escaped = body.replace(/'/g, `'\\''`);
    if (isPost) {
      return `curl -X POST '${s.endpoint}' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer <YOUR_KITE_TX_HASH>' \\
  -d '${escaped}'`;
    }
    return `curl '${s.endpoint}' \\
  -H 'Authorization: Bearer <YOUR_KITE_TX_HASH>'`;
  }
  if (lang === "ts") {
    return `// Pay first via KitePay or wagmi, then call:
const res = await fetch('${s.endpoint}', {
  method: '${s.method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${KITE_TX_HASH}\`,
  },${isPost ? `\n  body: ${formatJsBody(body)},` : ""}
});
const data = await res.json();`;
  }
  // python
  if (isPost) {
    return `import requests

resp = requests.post(
    "${s.endpoint}",
    headers={
        "Authorization": f"Bearer {kite_tx_hash}",
        "Content-Type": "application/json",
    },
    json=${formatPythonBody(body)},
)
data = resp.json()`;
  }
  return `import requests

resp = requests.get(
    "${s.endpoint}",
    headers={"Authorization": f"Bearer {kite_tx_hash}"},
)
data = resp.json()`;
}

function formatJsBody(body: string): string {
  return body.split("\n").map((line, i) => (i === 0 ? line : "    " + line)).join("\n");
}

function formatPythonBody(body: string): string {
  return body
    .replace(/"([^"\\]+)":/g, '"$1":')
    .split("\n")
    .map((line, i) => (i === 0 ? line : "    " + line))
    .join("\n");
}
