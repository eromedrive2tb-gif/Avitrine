import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgres://vitrine:vitrine@24.199.121.28:5432/vitrine?sslmode=disable",
  },
});
