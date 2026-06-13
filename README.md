# AgentMarket

> A discovery directory of paid, pay-per-call services for AI agents on the Kite blockchain.

## Overview

AgentMarket is a static web directory of paid API services that settle payment on-chain on the [Kite](https://gokite.ai) network. Each listing carries a price, an endpoint, an input schema, and a "Try it" flow: connect a wallet, sign an on-chain payment to the provider, then call the service with the transaction hash as a bearer token. There is no backend — the catalog is a single JSON file (`registry/services.json`) that the frontend bundles at build time, and new services are added by pull request.

It is a sister project to AgentID, KiteLeaderboard, KitePay, KiteIndex Lite, and KiteSubs.

## Features

- **Browse and search listings** — fuzzy full-text search (Fuse.js) and category filtering across the service registry.
- **Service detail pages** — per-service routes (`/s/<id>`) showing price, endpoint, input/output schemas, and integration snippets (cURL, JavaScript, Python).
- **"Try it" payment flow** — wallet connection via RainbowKit/wagmi, an ERC-20 (or native) transfer to the provider, then a live call to the endpoint with `Authorization: Bearer <tx_hash>`.
- **Multi-network support** — Kite Mainnet and Kite Testnet chain definitions, with automatic network-switch prompting.
- **PR-based registry** — anyone can list a service by editing `registry/services.json` and opening a pull request.

Items marked **Preview** in the UI (real-time metrics, x402 protocol support) are not yet implemented — see [Status](#status).

## Tech stack

- **Build / framework**: Vite, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Web3**: wagmi, viem, RainbowKit
- **Data / search**: TanStack Query, Fuse.js
- **Icons**: lucide-react

## Architecture

This is a two-part repository: a static frontend and a JSON registry that the frontend consumes at build time.

- `web/` — the Vite + React single-page app (UI, routing, wallet, and payment logic).
- `registry/` — `services.json` (the catalog and source of truth), plus contributor docs and a submission template.
- `vercel.json` — root build configuration so the deploy bundles both `web/` and `registry/services.json`.

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- A package manager — pnpm is used in development (a `pnpm-lock.yaml` is checked in)

### Installation

```bash
cd web
pnpm install
```

### Configuration

The app reads the following environment variables. Provide values via a `.env` file in `web/` or your deploy environment. No secret values are stored in the repository.

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_WALLETCONNECT_PROJECT_ID` | `web/` app (build/runtime) | WalletConnect project ID used by RainbowKit; falls back to a placeholder if unset. |
| `DISABLE_HMR` | dev server | Set to `true` to disable Vite hot-module reload / file watching. |

### Running

```bash
cd web
pnpm dev        # dev server at http://localhost:3050
pnpm build      # production build to web/dist
pnpm preview    # preview the production build
```

## Usage

### Adding a service to the registry

1. Fork the repository.
2. Add a service object to the `services` array in `registry/services.json` (schema documented in `registry/README.md`).
3. Open a pull request using `registry/SUBMISSION_TEMPLATE.md`.

A maintainer reviews and merges submissions; the `verified` flag is set by maintainers only, after confirming the endpoint is live and the provider address has on-chain history.

### Payment / call convention (v0.1)

Listed services are expected to accept the on-chain payment proof on each call:

```
Authorization: Bearer <tx_hash>
```

where `tx_hash` is the transaction that paid `price_raw` to the listing's `provider_address`. The service is responsible for verifying that transaction against the Kite RPC (`https://rpc.gokite.ai`).

## Testing

There is no automated test suite. Type checking is available via:

```bash
cd web
pnpm lint       # tsc --noEmit
```

## Project structure

```
agentmarket/
├── registry/
│   ├── services.json          # catalog — source of truth
│   ├── README.md              # service object schema + contribution guide
│   └── SUBMISSION_TEMPLATE.md # PR template for new listings
├── web/
│   ├── src/
│   │   ├── App.tsx            # app shell, routing, wagmi/RainbowKit config
│   │   ├── components/        # UI: service cards, detail, try-it modal, snippets
│   │   └── lib/               # registry loader, payment, search, Kite chain config
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── vercel.json                # root deploy/build config
```

## Status

**v0.1 — MVP, no backend.** Honest scope:

- **No backend.** Listings live entirely in `registry/services.json`; updates happen by PR and take effect on the next site rebuild.
- **Tx-hash bearer auth is the real v0.1 mechanism.** The "Try it" flow signs a transfer to the provider and calls the endpoint with `Authorization: Bearer <tx_hash>`; the service decides whether to honor it.
- **x402 protocol support is Preview (v0.2)** — not yet implemented.
- **Metrics (call counts, uptime, reliability) are Preview** — there is no backend to track them, and the project does not fabricate numbers.

Deliberately out of scope for v0.1: a backend for tracking calls/uptime/latency, reviews and ratings, a recommendation widget, paid premium placements, and a session-based agent payment flow.

The frontend is configured for static deployment from the repository root (see `vercel.json`), bundling both `web/` and `registry/services.json`.

## License

No license specified.
