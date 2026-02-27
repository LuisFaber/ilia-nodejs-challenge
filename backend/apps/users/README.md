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

## Como rodar localmente

1. **Pré-requisitos:** Node.js 20+, npm.
2. **Instalar dependências:**
   ```bash
   npm install
   ```
3. **Configurar ambiente:** copiar `.env.example` para `.env` e ajustar (para apenas subir o app, `PORT=3002` é suficiente).
4. **Subir o servidor:**
   ```bash
   npm run start:dev
   ```
   O app estará em `http://localhost:3002`.

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
