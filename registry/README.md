# AgentMarket Registry

This directory is the source of truth for what's listed on [AgentMarket](https://github.com/gnanam1990/agentmarket). `services.json` is loaded by the frontend at build time and via fetch on the client.

## How to add your service

1. Fork the repo.
2. Edit `services.json` — add a new object to the `services` array following the schema below.
3. Open a Pull Request using the template at `SUBMISSION_TEMPLATE.md`.

A maintainer reviews + merges weekly. Once merged, your service appears on AgentMarket the next time the site rebuilds (usually within an hour).

## Service object schema

```jsonc
{
  "id": "kebab-case-unique-id",
  "name": "Human-Readable Name",
  "description": "One or two sentences. ~140 chars feels right.",
  "category": "text | image | data | search | translation | ocr | other",
  "endpoint": "https://api.example.com/v1/your-endpoint",
  "method": "GET | POST",
  "price_raw": "raw-amount-in-token-base-units",
  "price_decimals": 6,
  "price_token": "0x...token-contract-address",
  "price_symbol": "USDC.e",
  "network": "mainnet | testnet",
  "provider_address": "0xYourMerchantWallet",
  "provider_name": "Your team name",
  "provider_agentid": "https://agentid-seven.vercel.app/0xYourMerchantWallet",
  "input_schema": { /* JSON Schema */ },
  "output_schema": { /* JSON Schema */ },
  "example_input": { /* example payload */ },
  "tags": ["keywords", "for", "search"],
  "submitted_at": "YYYY-MM-DD",
  "verified": false
}
```

## Verification

`verified: true` is set by maintainers only, after:

1. Confirming the endpoint is live and responds to the example input.
2. Verifying the provider has on-chain history at `provider_address`.
3. Confirming no reports of malicious behaviour.

Submit with `verified: false` — it'll be flipped after review.

## Tx-hash bearer auth (v0.1)

AgentMarket's "Try it" flow currently expects services to accept this header on each call:

```
Authorization: Bearer <tx_hash>
```

Where `tx_hash` is the on-chain payment transaction proving the caller paid `price_raw` to `provider_address`. The service should verify the tx itself (Kite RPC at `https://rpc.gokite.ai`).

Real x402 protocol integration is on the v0.2 roadmap.
