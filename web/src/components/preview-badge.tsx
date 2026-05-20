import { Info } from "lucide-react";

interface Props {
  label?: string;
  tooltip?: string;
}

export function PreviewBadge({ label = "Preview", tooltip = "Not real-time yet — coming in v0.2." }: Props) {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded bg-kite-muted border border-kite-border text-kite-fg/70 cursor-help"
      title={tooltip}
    >
      <Info className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}
