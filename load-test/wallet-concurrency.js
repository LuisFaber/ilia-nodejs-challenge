/**
 * k6 concurrency test for Wallet microservice.
 * Validates transactional integrity under 300 concurrent requests.
 *
 * Prerequisites:
 *   1. Wallet app running on BASE_URL (default http://localhost:3001)
 *   2. Valid JWT with claim "sub" (userId). Set WALLET_JWT_TOKEN env var.
 *
 * Generate token (Node, same secret as app):
 *   node -e "const j=require('jsonwebtoken'); console.log(j.sign({sub:'load-test-user'}, process.env.ILIACHALLENGE||'ILIACHALLENGE', {expiresIn:'1h'}))"
 *
 * Run:
 *   k6 run load-test/wallet-concurrency.js
 *   WALLET_JWT_TOKEN=<token> k6 run load-test/wallet-concurrency.js
 */

import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3001";
const JWT_TOKEN = __ENV.WALLET_JWT_TOKEN;

if (!JWT_TOKEN) {
  throw new Error("WALLET_JWT_TOKEN environment variable is required");
}

export const options = {
  vus: 300,
  iterations: 300,
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<5000"],
  },
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${JWT_TOKEN}`,
};

export default function () {
  const type = Math.random() < 0.5 ? "credit" : "debit";
  const amount = Math.floor(Math.random() * 100) + 1;
  const payload = JSON.stringify({ amount, type });

  const res = http.post(`${BASE_URL}/wallet/transactions`, payload, { headers });

  const ok = check(res, {
    "status is 200": (r) => r.status === 200,
    "response has body": (r) => r.body && r.body.length > 0,
  });

  if (!ok) {
    console.warn(`Unexpected response: ${res.status} ${res.body}`);
  }
}

export function teardown() {
  const res = http.get(`${BASE_URL}/wallet/balance`, {
    headers: { Authorization: `Bearer ${JWT_TOKEN}` },
  });

  const ok = check(res, {
    "teardown: balance status 200": (r) => r.status === 200,
    "teardown: balance is number": (r) => {
      try {
        const body = JSON.parse(r.body);
        return typeof body.amount === "number";
      } catch {
        return false;
      }
    },
    "teardown: balance not negative": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.amount >= 0;
      } catch {
        return false;
      }
    },
  });

  if (ok) {
    const body = JSON.parse(res.body);
    console.log(`Final balance: ${body.amount}`);
  } else {
    console.warn(`Teardown validation failed: ${res.status} ${res.body}`);
  }
}
