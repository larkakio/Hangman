# Neon Hangman

Cyberpunk mobile hangman for the [Base App](https://base.app) — swipe the neon glyph field, clear levels, and optionally run a daily on-chain check-in on Base (gas only).

## Stack

- **Web:** Next.js App Router, TypeScript, Tailwind
- **Wallet:** wagmi + viem + `@base-org/account` (standard web app, no Farcaster SDK)
- **Attribution:** ERC-8021 builder codes via `ox` (`dataSuffix` on wagmi config)
- **Contracts:** Foundry `DailyCheckIn` on Base mainnet

## Quick start

```bash
cd web && npm install && npm run dev
```

```bash
cd contracts && forge test
```

## Environment

Copy `web/.env.example` to `web/.env.local` and set:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Production URL |
| `NEXT_PUBLIC_CHAIN_ID` | `8453` (Base) |
| `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS` | Deployed check-in contract |
| `NEXT_PUBLIC_BASE_APP_ID` | From [base.dev](https://base.dev) project settings |
| `NEXT_PUBLIC_BUILDER_CODE` | `bc_…` from base.dev → Settings → Builder Code |

## Base.dev registration

1. Create a project at [base.dev](https://base.dev).
2. Set primary URL, name, tagline, screenshots, category, description.
3. Add `<meta name="base:app_id" />` (already in `web/app/layout.tsx`).
4. Copy Builder Code into `NEXT_PUBLIC_BUILDER_CODE`.

## Deploy contract

```bash
cd contracts
forge script script/DeployDailyCheckIn.s.sol:DeployDailyCheckIn \
  --rpc-url $BASE_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast
```

Deployed `DailyCheckIn` on Base mainnet: `0x6500409D41142497DF2174dbc2e897b70B8248B1` (see `contracts/deployments/base-mainnet.json`). Set the same value in Vercel (Root Directory: `web`).

## Game controls

- **Drag + release** on the glyph field to guess a letter.
- **Fling left/right** to cycle highlight.
- **Fling up/down** to filter vowels / consonants.

## Vercel

- Root Directory: `web`
- Add all `NEXT_PUBLIC_*` variables to Project Environment.

## Assets

- `web/public/app-icon.jpg` — 1:1, max 1024×1024, &lt; 1MB
- `web/public/app-thumbnail.jpg` — 1.91:1, &lt; 1MB
