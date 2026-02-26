# Wallet Concurrency Load Test (k6)

Validates transactional integrity under 300 concurrent requests.

## Prerequisites

- [k6](https://k6.io/docs/getting-started/installation/) installed
- Wallet app running (default: `http://localhost:3001`)

## Generate JWT token

Use the same secret as the app (`ILIACHALLENGE` or `JWT_SECRET`). Example with Node (requires `jsonwebtoken`):

```bash
node -e "const j=require('jsonwebtoken'); console.log(j.sign({sub:'load-test-user'}, process.env.ILIACHALLENGE||'ILIACHALLENGE', {expiresIn:'1h'}))"
```

Or from the wallet app directory (uses same env):

```bash
cd backend/apps/wallet && node -e "require('dotenv').config(); const j=require('jsonwebtoken'); console.log(j.sign({sub:'load-test-user'}, process.env.ILIACHALLENGE||process.env.JWT_SECRET, {expiresIn:'1h'}))"
```

## Run

```bash
export WALLET_JWT_TOKEN=<token-from-above>
k6 run load-test/wallet-concurrency.js
```

Optional: `BASE_URL=http://localhost:3001` (default).

## What is validated

- **During test:** Each request expects HTTP 200.
- **Thresholds:** Less than 1% failed requests; p95 latency under 5s.
- **Teardown:** GET `/wallet/balance` returns 200, `amount` is a number and ≥ 0.
