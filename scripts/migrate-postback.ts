import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('Iniciando migração...');
  try {
    // Tenta adicionar a coluna diretamente, ignorando se já existir
    console.log('Tentando adicionar coluna postback_url...');
    await db.execute(sql`ALTER TABLE "payment_gateways" ADD COLUMN IF NOT EXISTS "postback_url" text`);
    console.log('Migração concluída com sucesso!');
  } catch (e: any) {
    if (e.message?.includes('already exists')) {
      console.log('Coluna postback_url já existe.');
    } else {
      console.error('Erro:', e.message);
    }
  }
  process.exit(0);
}

migrate();
