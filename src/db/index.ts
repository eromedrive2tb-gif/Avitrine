import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://vitrine:vitrine@24.199.121.28:5432/vitrine?sslmode=disable';
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
