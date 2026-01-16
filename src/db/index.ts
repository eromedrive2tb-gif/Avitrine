import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// In a real app, use process.env.DATABASE_URL
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/creatorflix';
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
