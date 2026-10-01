# Priority

Priority tracker built with Next.js, Prisma, and PostgreSQL.

## Prerequisites

- Node.js LTS
- Docker (with Compose)

## Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Start the PostgreSQL database:

   ```bash
   docker compose up -d db
   ```

3. Install dependencies (this also generates the Prisma client):

   ```bash
   npm install
   ```

4. Apply the database migrations:

   ```bash
   npm run db:migrate
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

## Check that it works

With the app running, request the health endpoint:

```bash
curl http://localhost:3000/api/health
```

It returns `{"status":"ok"}` while the database is reachable, and `{"status":"error"}` with HTTP 503 when it is not.

## Scripts

- `npm run dev` — start the Next.js development server
- `npm run build` — build the app for production
- `npm run start` — start the production server
- `npm run lint` — run ESLint
- `npm run typecheck` — type-check the project with TypeScript
- `npm test` — run the test suite with Vitest
- `npm run db:migrate` — create and apply Prisma migrations
