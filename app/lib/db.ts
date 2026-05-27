import { prisma } from "./prisma";
import { Device } from "@/prisma/generated/prisma/client" // prisma schema enum

// database functions for creating, deleting, checking out items, and fetching items.
// These are called from the server actions in app/actions/forms.ts which handle the form submissions from the frontend.

// ── auth ──────────────────────────────────────────────────────────────────────

// actions/auth.ts -> registerAction -> findUserByEmail
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

// actions/auth.ts -> registerAction -> createUser
export async function createUser(name: string, email: string, hashedPassword: string) {
  return prisma.user.create({ data: { name, email, password: hashedPassword } });
}

// actions/forms.ts -> handleSubmitItem -> createItem
export async function createItem(deviceType: Device) {
  await prisma.item.create({
    data: {
      model: deviceType
    }
  });
}

// actions/forms.ts -> handleDelete -> deleteItem
export async function deleteItem(id: number){
    await prisma.item.delete({
        where: {
            id: id
        }
    });
    console.log(`deleted ${id}`);
}

// actions/forms.ts -> handleSubmitCheckout -> checkOutItem
export async function checkOutItem(id: number, userId: string): Promise<{ error: string } | null> {
    const result = await prisma.item.updateMany({
        where: { id, checkedOut: false },
        data: {
            checkedOut: true,
            dateCheckedOut: new Date(),
            checkedOutById: userId
        }
    });

    if (result.count === 0) {
        // Could not update — distinguish between missing vs already checked out
        const item = await prisma.item.findUnique({ where: { id } });
        if (!item) return { error: 'This item does not exist.' };
        return { error: 'This item is already checked out.' };
    }

    return null;
}

// dashboard/page.tsx -> ItemsTableWrapper -> fetchItems
export async function fetchItems() {
    return prisma.item.findMany({
        include: {
            checkedOutBy: {
                select: { name: true, email: true }
            }
        }
    });
}