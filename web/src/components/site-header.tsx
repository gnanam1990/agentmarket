import { Search } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { KiteLogo } from "./kite-logo";

interface Props {
  query: string;
  onQuery: (q: string) => void;
  onNavigate: (path: string) => void;
}

export function SiteHeader({ query, onQuery, onNavigate }: Props) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-kite-border bg-kite-bg/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("/");
          }}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <KiteLogo />
          <span className="hidden sm:inline-block h-4 w-px bg-kite-border" />
          <span className="hidden sm:inline-block font-sans text-xs font-bold tracking-widest text-kite-primary uppercase">
            Market
          </span>
        </a>

        <div className="flex-1 max-w-md mx-4 relative">
          <input
            type="text"
            placeholder="Search services…"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            className="w-full bg-kite-muted border border-kite-border/80 focus:border-kite-primary focus:outline-none rounded-md py-1.5 pl-9 pr-3 text-sm text-kite-fg placeholder-kite-fg/40 transition-all"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-kite-fg/30" />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <ConnectButton chainStatus="icon" showBalance={false} accountStatus={{ smallScreen: "avatar", largeScreen: "address" }} />
        </div>
      </div>
    </header>
  );
}
