# WalletX — ília Node.js Challenge

A full-stack FinTech wallet platform composed of two NestJS microservices and a Next.js 14 frontend.

```
┌─────────────────┐    HTTP     ┌──────────────────┐
│  Next.js 14     │ ──────────► │  Users MS :3002  │
│  Frontend :3000 │             └──────────────────┘
│  (BFF / SSR)    │    HTTP     ┌──────────────────┐
│                 │ ──────────► │  Wallet MS :3001 │
└─────────────────┘             └──────────────────┘
```

## Stack

| Layer      | Technology                                              |
|------------|---------------------------------------------------------|
| Frontend   | Next.js 14 (App Router), TypeScript, Tailwind CSS, React Query, i18next |
| Backend    | NestJS, TypeScript, Prisma ORM, MySQL                   |
| Auth       | JWT (httpOnly cookies via BFF — secret: `ILIACHALLENGE`) |
| Containers | Docker + Docker Compose                                 |

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 24
- [Node.js](https://nodejs.org/) ≥ 20 (for local development only)
- [npm](https://www.npmjs.com/) ≥ 9

---

## Quickstart — Docker Compose (recommended)

```bash
# Clone the repository
git clone <your-fork-url>
cd ilia-nodejs-challenge

# Start all services (databases + microservices + frontend)
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| Wallet   | http://localhost:3001/docs |
| Users    | http://localhost:3002/docs |

To stop and remove volumes:

```bash
docker compose down -v
```

---

## Environment Variables

### Wallet Microservice (`backend/apps/wallet`)

| Variable       | Default                                         | Description                        |
|----------------|-------------------------------------------------|------------------------------------|
| `PORT`         | `3001`                                          | HTTP port                          |
| `DATABASE_URL` | `mysql://wallet_user:wallet_pass@localhost:3306/wallet_db` | MySQL connection string |
| `JWT_SECRET`   | `ILIACHALLENGE`                                 | JWT signing secret                 |
| `ILIACHALLENGE`| `ILIACHALLENGE`                                 | Internal auth secret               |

Create `backend/apps/wallet/.env` for local runs:

```env
PORT=3001
DATABASE_URL=mysql://wallet_user:wallet_pass@localhost:3306/wallet_db
JWT_SECRET=ILIACHALLENGE
ILIACHALLENGE=ILIACHALLENGE
```

### Users Microservice (`backend/apps/users`)

| Variable       | Default                                   | Description          |
|----------------|-------------------------------------------|----------------------|
| `PORT`         | `3002`                                    | HTTP port            |
| `DATABASE_URL` | `mysql://user:password@localhost:3308/users` | MySQL connection string |
| `JWT_SECRET`   | `ILIACHALLENGE`                           | JWT signing secret   |

Create `backend/apps/users/.env` for local runs:

```env
PORT=3002
DATABASE_URL=mysql://user:password@localhost:3308/users
JWT_SECRET=ILIACHALLENGE
```

### Frontend (`frontend`)

| Variable                   | Description                            |
|----------------------------|----------------------------------------|
| `WALLET_API_URL`           | Internal URL for wallet service (SSR)  |
| `USERS_API_URL`            | Internal URL for users service (SSR)   |
| `NEXT_PUBLIC_WALLET_API_URL` | Public URL for wallet service (client) |
| `NEXT_PUBLIC_USERS_API_URL`  | Public URL for users service (client)  |

Create `frontend/.env.local` for local runs:

```env
WALLET_API_URL=http://localhost:3001
USERS_API_URL=http://localhost:3002
NEXT_PUBLIC_WALLET_API_URL=http://localhost:3001
NEXT_PUBLIC_USERS_API_URL=http://localhost:3002
```

---

## Local Development (without Docker)

### 1 — Start the databases

```bash
docker compose up db-wallet db-users
```

### 2 — Wallet Microservice

```bash
cd backend/apps/wallet
npm install
npx prisma migrate deploy   # apply migrations
npm run start:dev
```

### 3 — Users Microservice

```bash
cd backend/apps/users
npm install
npx prisma migrate deploy   # apply migrations
npm run start:dev
```

### 4 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

---

## Running Tests

### Backend (Wallet)

```bash
cd backend/apps/wallet
npm test
```

### Backend (Users)

```bash
cd backend/apps/users
npm test
```

### Frontend

```bash
cd frontend
npm test          # run all tests
npm test -- --watch   # watch mode
```

---

## Load Tests

A k6 load test suite is included in `load-test/`.

```bash
# Install k6: https://grafana.com/docs/k6/latest/set-up/install-k6/
cd load-test
k6 run script.js
```

---

## API Documentation

Both microservices expose a Swagger UI when running:

- Wallet: http://localhost:3001/docs
- Users:  http://localhost:3002/docs

The full OpenAPI specification for the Users service is available at [`ms-users.yaml`](./ms-users.yaml).

---

## Project Structure

```
ilia-nodejs-challenge/
├── backend/
│   └── apps/
│       ├── wallet/          # Wallet microservice (NestJS + Prisma)
│       └── users/           # Users microservice (NestJS + Prisma + DDD)
├── frontend/                # Next.js 14 App Router
│   └── src/
│       ├── app/             # Pages and API routes (BFF)
│       ├── components/      # Shared UI components
│       ├── features/        # Feature modules (auth, wallet, layout)
│       ├── i18n/            # Translations (en, pt-BR, es)
│       └── lib/             # Utilities (export, grouping)
├── load-test/               # k6 performance tests
├── docker-compose.yml
└── ms-users.yaml            # OpenAPI spec (Users service)
```

---

## Security Notes

- JWT tokens are stored in **httpOnly, Secure, SameSite=Strict cookies** — never exposed to JavaScript.
- The Next.js frontend acts as a **BFF (Backend For Frontend)**, proxying all authenticated requests server-side.
- Each user can only read/update/delete **their own** profile (enforced by both JWT subject check in the controller and the BFF cookie layer).
- Wallet balance is protected with **pessimistic locking** (`SELECT … FOR UPDATE`) to prevent race conditions.
