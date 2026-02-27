const port = process.env.PORT ?? "3002";
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl?.length) {
  throw new Error("DATABASE_URL must be set in environment");
}

export const env = {
  port: Number.parseInt(port, 10),
  databaseUrl,
} as const;
