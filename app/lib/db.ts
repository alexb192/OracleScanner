import { prisma } from "./prisma";
import { Device } from "@/prisma/generated/prisma/client" // prisma schema enum

// database functions for creating, deleting, checking out items, and fetching items. 
// These are called from the server actions in app/actions/forms.ts which handle the form submissions from the frontend. 

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
export async function checkOutItem(id: number, userId: string) {
    await prisma.item.update({
        where: { id },
        data: {
            checkedOut: true,
            dateCheckedOut: new Date(),
            checkedOutById: userId
        }
    });
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