import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default {
  driver: "pg",
  schema: "./src/lib/db/schema.ts",
  dbCredentials: {
    connectionString: process.env.DB_URL as string,
  },
} satisfies Config;
