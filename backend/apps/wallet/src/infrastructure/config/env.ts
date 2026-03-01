const port = process.env.PORT ?? "3001";
const jwtSecret = process.env.ILIACHALLENGE ?? process.env.JWT_SECRET;
const databaseUrl = process.env.DATABASE_URL;

if (!jwtSecret?.length) {
  throw new Error("ILIACHALLENGE or JWT_SECRET must be set in environment");
}

if (!databaseUrl?.length) {
  throw new Error("DATABASE_URL must be set in environment");
}

export const env = {
  port: Number.parseInt(port, 10),
  jwtSecret,
  databaseUrl,
} as const;
