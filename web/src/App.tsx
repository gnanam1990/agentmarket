import { useEffect, useMemo, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig, lightTheme } from "@rainbow-me/rainbowkit";

import { kiteMainnet, kiteTestnet } from "./lib/kite-chain";
import { REGISTRY, findService } from "./lib/registry";
import { searchServices, filterByCategory } from "./lib/search";

import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { ServiceGrid } from "./components/service-grid";
import { CategoryTabs } from "./components/category-tabs";
import { ServiceDetail } from "./components/service-detail";

const WALLETCONNECT_PROJECT_ID = "00000000000000000000000000000000";

const wagmiConfig = getDefaultConfig({
  appName: "AgentMarket",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [kiteMainnet, kiteTestnet],
  ssr: false,
});

const queryClient = new QueryClient();

const rainbowTheme = lightTheme({
  accentColor: "#9B8564",
  accentColorForeground: "#FEF8F0",
  borderRadius: "medium",
  fontStack: "system",
});

type Route =
  | { name: "home" }
  | { name: "service"; id: string }
  | { name: "not_found" };

function readRoute(): Route {
  if (typeof window === "undefined") return { name: "home" };
  const path = window.location.pathname;
  const m = path.match(/^\/s\/([a-z0-9-]+)\/?$/i);
  if (m) {
    const svc = findService(m[1]);
    return svc ? { name: "service", id: svc.id } : { name: "not_found" };
  }
  return { name: "home" };
}

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function InnerApp() {
  const [route, setRoute] = useState<Route>(() => readRoute());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    const onPop = () => setRoute(readRoute());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const filtered = useMemo(
    () => filterByCategory(searchServices(query), category),
    [query, category]
  );

  return (
    <div className="min-h-screen flex flex-col bg-kite-bg text-kite-fg">
      <SiteHeader query={query} onQuery={setQuery} onNavigate={navigate} />

      {route.name === "home" && <Home filtered={filtered} category={category} setCategory={setCategory} />}

      {route.name === "service" && (
        <ServiceDetail
          service={findService(route.id)!}
          onBack={() => navigate("/")}
        />
      )}

      {route.name === "not_found" && (
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-bold tracking-tight text-kite-fg mb-2">Service not found</h1>
            <p className="text-sm text-kite-fg/65 mb-6">
              That service isn't in the registry. It may have been removed.
            </p>
            <button
              onClick={() => navigate("/")}
              className="h-10 px-5 rounded-lg bg-kite-primary text-kite-bg font-semibold text-sm hover:bg-kite-primary/90 transition-colors"
            >
              Browse directory
            </button>
          </div>
        </main>
      )}

      <SiteFooter />
    </div>
  );
}

function Home({
  filtered,
  category,
  setCategory,
}: {
  filtered: ReturnType<typeof searchServices>;
  category: string | null;
  setCategory: (id: string | null) => void;
}) {
  return (
    <main className="flex-1">
      <section className="kite-gradient border-b border-kite-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-kite-fg mb-4">
            Paid APIs for AI agents on Kite.
          </h1>
          <p className="text-base text-kite-fg/70 max-w-2xl leading-relaxed">
            Discover services your agent can call. Pay per call in USDC.e. Listings are open and
            free — submit yours with a PR to the{" "}
            <a
              href="https://github.com/gnanam1990/agentmarket"
              target="_blank"
              rel="noreferrer"
              className="text-kite-primary hover:text-kite-fg underline underline-offset-2"
            >
              registry repo
            </a>
            .
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-5">
          <CategoryTabs selectedId={category} onSelect={setCategory} />
        </div>
        <div className="mb-3 text-xs text-kite-fg/55 font-mono">
          {filtered.length} of {REGISTRY.services.length} services
        </div>
        <ServiceGrid services={filtered} onOpen={(id) => navigate(`/s/${id}`)} />
      </section>
    </main>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme} appInfo={{ appName: "AgentMarket" }}>
          <InnerApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
