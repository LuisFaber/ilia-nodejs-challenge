# Wallet Microservice

Bootstrap: NestJS + Prisma + MySQL. Clean Architecture (domain, application, infrastructure, http).

## Pré-requisitos

- Node.js >= 20
- MySQL (ou use Docker)

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste:

- `PORT` — porta da API (default 3001)
- `JWT_SECRET` — chave para validação JWT (ex.: ILIACHALLENGE)
- `DATABASE_URL` — connection string MySQL (ex.: `mysql://user:pass@localhost:3306/wallet_db`)

## Executar localmente

```bash
npm install
npx prisma generate
npm run start:dev
```

## Executar com Docker

Na raiz do repositório:

```bash
docker-compose up --build
```

Aplicação em `http://localhost:3001`; MySQL em `localhost:3306`.
