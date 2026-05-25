import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/prisma/client";
const connectionString = `${process.env.PRISMA_DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export { prisma };

// creates prisma client instance with postgres adapter, using connection string from environment variables. 
// This is imported and used in the database functions in app/lib/db.ts and in the auth.ts file 
// for handling user authentication.