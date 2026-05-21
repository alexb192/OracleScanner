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

export async function fetchItems() {
    const result = await prisma.item.findMany();
    return result;
}