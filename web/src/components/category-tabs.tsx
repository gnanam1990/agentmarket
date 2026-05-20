import { REGISTRY } from "../lib/registry";

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryTabs({ selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      <Chip active={selectedId === null} onClick={() => onSelect(null)}>
        All
      </Chip>
      {REGISTRY.categories.map((cat) => (
        <Chip key={cat.id} active={selectedId === cat.id} onClick={() => onSelect(cat.id)}>
          {cat.name}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
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
      className={`flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
        active
          ? "bg-kite-primary/15 text-kite-primary border-kite-primary/40"
          : "bg-kite-bg text-kite-fg/70 border-kite-border hover:bg-kite-muted"
      }`}
    >
      {children}
    </button>
  );
}
