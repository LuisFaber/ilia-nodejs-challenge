# Users Microservice

Microserviço de **Users** — gerenciamento de usuários e autenticação (API HTTP). Integra com o Wallet via comunicação interna segura (JWT interno ou SSL).

## Porta

**3002** (configurável via variável de ambiente `PORT`).

## Variáveis de ambiente

| Variável               | Descrição                                                                 |
| ---------------------- | ------------------------------------------------------------------------- |
| `PORT`                 | Porta do servidor (padrão: 3002)                                          |
| `ILIACHALLENGE`        | Chave secreta para JWT das rotas HTTP (Bearer token dos clientes)        |
| `ILIACHALLENGE_INTERNAL` | Chave secreta para JWT da comunicação interna entre microserviços      |
| `DATABASE_URL`         | URL de conexão com o banco dedicado (ex.: Postgres, MySQL)                |

Copie `.env.example` para `.env` e preencha os valores.

## Portas usadas

| Serviço   | Porta (host) | Descrição              |
| --------- | ------------- | ---------------------- |
| Users API | 3002          | Aplicação NestJS       |
| MySQL     | 3308          | Banco dedicado (Users) — exposto no host para evitar conflito com o MySQL do Wallet (3306) |

O banco **db-users** escuta na porta **3306** dentro da rede Docker; no host a porta exposta é **3308**.

## Banco dedicado

- **MySQL 8** — banco exclusivo do microserviço Users (isolado do Wallet).
- **Conexão:** `DATABASE_URL=mysql://user:password@db-users:3306/users` (Docker) ou `mysql://user:password@localhost:3308/users` (local com MySQL em 3308).
- Tabela `users` criada via Prisma migrations ao subir o container.

## Como rodar localmente

1. **Pré-requisitos:** Node.js 20+, npm, MySQL (ou use apenas Docker).
2. **Instalar dependências:**
   ```bash
   npm install
   ```
3. **Configurar ambiente:** copiar `.env.example` para `.env` e preencher `DATABASE_URL` (ex.: `mysql://user:password@localhost:3308/users` se o MySQL estiver na porta 3308).
4. **Migrações:** `npx prisma migrate deploy` (ou `npm run prisma:migrate` em dev).
5. **Subir o servidor:**
   ```bash
   npm run start:dev
   ```
   O app estará em `http://localhost:3002`.

## Como rodar via Docker

Na **raiz do repositório** (onde está o `docker-compose.yml`):

```bash
docker-compose up --build
```

- **Users** sobe na porta **3002** e conecta ao MySQL **db-users** (porta 3308 no host).
- Para subir apenas Users e o banco:
  ```bash
  docker-compose up --build db-users users
  ```

**Dependências:** Docker e Docker Compose. O serviço `users` depende de `db-users` (healthcheck); as migrações rodam no startup do container.

## Configuração inicial

- Estrutura em **Clean Architecture:** `domain/`, `application/`, `infrastructure/` (com `http/`, `persistence/`, `config/`).
- Stack: **NestJS**, TypeScript.
- Contrato da API: [ms-users.yaml](../../../ms-users.yaml) na raiz do repositório.

## Estratégia de branches (Gitflow)

- **main:** branch principal; apenas código revisado e mergeado via PR.
- **feature/***: uma branch por feature (ex.: `feature/users-initial-setup`, `feature/users-auth`). Desenvolvimento e commits são feitos na feature; ao finalizar, abrir **Pull Request** para `main`.
- **Code Review:** cada merge em `main` passa por pelo menos um PR e revisão, simulando trabalho em equipe.
- **Neste repositório:** evite fazer merge direto em `main`; use sempre branch de feature e PR para integração.

## Estrutura do projeto

```
src/
├── domain/           # Entidades e regras de negócio
├── application/      # Casos de uso
├── infrastructure/
│   ├── config/       # Configuração (env)
│   ├── http/         # Controllers, DTOs, guards (HTTP)
│   └── persistence/  # Repositórios, banco
├── app.module.ts
└── main.ts
```
