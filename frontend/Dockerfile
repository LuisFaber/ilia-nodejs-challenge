FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_WALLET_API_URL=http://localhost:3001
ARG NEXT_PUBLIC_USERS_API_URL=http://localhost:3002
ENV NEXT_PUBLIC_WALLET_API_URL=$NEXT_PUBLIC_WALLET_API_URL
ENV NEXT_PUBLIC_USERS_API_URL=$NEXT_PUBLIC_USERS_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
