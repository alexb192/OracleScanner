import { prisma } from "./prisma";
import { Device } from "@/prisma/generated/prisma/client" // prisma schema enum

export async function createItem(deviceType: Device) {
  await prisma.item.create({
    data: {
      model: deviceType
    }
  });
}

export async function deleteItem(id: number){
    await prisma.item.delete({
        where: {
            id: id
        }
    });
    console.log(`deleted ${id}`);
}

export async function checkOutItem(id: number, userId: number) {
    await prisma.item.update({
        where: {
            id: id
        },
        data: {
            checkedOut: true,
            dateCheckedOut: new Date(),
            checkedOutById: userId
        }
    });
    console.log(`Checked out item ${id} to user ${userId}`);
}

export async function fetchItems() {
    const result = await prisma.item.findMany();
    return result;
}