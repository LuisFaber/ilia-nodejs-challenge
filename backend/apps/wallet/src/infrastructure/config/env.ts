function getEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value.length === 0) {
    throw new Error(`${key} must be set in environment`);
  }
  return value;
}

const port = process.env.PORT ?? "3001";
const jwtSecret = process.env.JWT_SECRET;
const databaseUrl = process.env.DATABASE_URL;

if (!jwtSecret?.length) {
  throw new Error("JWT_SECRET must be set in environment");
}

if (!databaseUrl?.length) {
  throw new Error("DATABASE_URL must be set in environment");
}

export const env = {
  port: Number.parseInt(port, 10),
  jwtSecret,
  databaseUrl,
} as const;
