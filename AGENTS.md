<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Prisma database URL

`prisma.config.ts` is a Prisma adapter that supplies the database URL — it reads `PRISMA_DATABASE_URL` from the environment via `dotenv` and passes it as the datasource URL. The `schema.prisma` datasource block intentionally has no `url` field because this config file handles it.
<!-- END:nextjs-agent-rules -->
