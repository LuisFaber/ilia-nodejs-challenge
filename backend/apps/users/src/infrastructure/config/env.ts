const port = process.env.PORT ?? "3002";

export const env = {
  port: Number.parseInt(port, 10),
} as const;
