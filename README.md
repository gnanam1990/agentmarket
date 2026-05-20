# AgentMarket

Discovery directory of paid AI services on the [Kite](https://gokite.ai) blockchain. Sister project to [AgentID](https://agentid-seven.vercel.app), [KiteLeaderboard](https://kiteleaderboard.vercel.app), [KitePay](https://github.com/gnanam1990/kitepay), [KiteIndex Lite](https://github.com/gnanam1990/kiteindex-lite), and [KiteSubs](https://github.com/gnanam1990/kitesubs).

Each listing has a price, an endpoint, an input schema, and a "Try it" button. Click → connect wallet → sign payment → service is called with `Authorization: Bearer <tx_hash>`. Stateless directory; the registry is just a JSON file in `registry/services.json`.

## Live deployment

- Web app: <https://agentmarket-self.vercel.app>
- Host: Vercel (`agentmarket`)
- Build: `cd web && npm run build`
- Output: `web/dist`

The Vercel project deploys from the repository root so the build can include both `web/` and `registry/services.json`. The root `vercel.json` captures that setup.

## How it works

- `registry/services.json` is the source of truth.
- The Vite app at `web/` fetches it on load.
- Anyone can add a listing by opening a PR (see `registry/README.md` + `SUBMISSION_TEMPLATE.md`).

## v0.1 honest scope

- **No backend.** Listings live in the registry JSON. Add via PR.
- **Tx-hash bearer auth.** AgentMarket's "Try it" flow signs an ERC-20 transfer to the provider and calls the endpoint with `Authorization: Bearer <tx_hash>`. The service decides whether to honor it. Real **x402** protocol support is **PREVIEW** (v0.2).
- **No metrics.** Call counts, uptime, reliability all marked **PREVIEW** — no backend to track them. We refuse to fake numbers.

## Develop

```bash
cd web
pnpm install
pnpm dev    # http://localhost:3050
```

## Submit a listing

Read `registry/README.md`. TL;DR — fork → edit `services.json` → PR → review → merge.

## Things deliberately NOT in v0.1

- Backend for tracking calls / uptime / latency
- Reviews + ratings (too easy to brigade at this scale)
- LLM "recommend a service for X" widget
- Paid premium placements
- kpass agent flow (agent calls a service via session, no manual wallet sign)
- Real x402 protocol (HTTP 402 with payment requirements)
