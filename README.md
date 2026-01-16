# CreatorFlix

Plataforma de streaming de conteúdo premium (Clone Netflix/OnlyFans) desenvolvida com Atomic Design.

## Stack

- **Runtime:** Bun
- **Framework:** Hono
- **Database:** PostgreSQL + Drizzle ORM
- **Styling:** Tailwind CSS v4
- **Storage:** Digital Ocean Spaces (S3)

## Setup

1. **Instalar Dependências:**
   ```bash
   bun install
   ```

2. **Configurar Banco de Dados:**
   - Crie um banco PostgreSQL.
   - Configure a variável `DATABASE_URL` no `.env` (ou edite `src/db/index.ts` para dev).
   - Gere as migrações (Opcional por agora, schema definido em código):
     ```bash
     bunx drizzle-kit generate
     bunx drizzle-kit migrate
     ```

3. **Gerar CSS:**
   ```bash
   bun run css:build
   ```

4. **Rodar o Projeto:**
   ```bash
   bun run dev
   ```

5. **Acessar:**
   - Home: http://localhost:3000
   - Admin: http://localhost:3000/admin

## Estrutura Atomic Design

- `src/components/atoms`: Componentes indivisíveis (Buttons, Inputs).
- `src/components/molecules`: Agrupamentos simples (ModelCard).
- `src/components/organisms`: Seções complexas (Navbar).
- `src/components/templates`: Layouts de página.
- `src/pages`: Montagem final das rotas.