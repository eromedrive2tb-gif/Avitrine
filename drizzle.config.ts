import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgres://vitrine:Grau1234@64.176.20.29:5432/vitrine?sslmode=disable",
  },
});
