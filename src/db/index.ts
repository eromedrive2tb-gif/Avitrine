import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://vitrine:Grau1234@64.176.20.29:5432/vitrine?sslmode=disable';
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
