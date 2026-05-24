'use server'
import { revalidatePath } from 'next/cache'
import { Device } from '@/prisma/generated/prisma/client'
import { createItem, deleteItem, checkOutItem } from '@/app/lib/db'

export async function handleSubmitItem(formData: FormData) {
  const type = formData.get('device') as Device
  await createItem(type)
  revalidatePath('/dashboard')
}

export async function handleSubmitCheckout(formData: FormData) {
  const itemId = parseInt(formData.get('itemId') as string, 10)
  if (itemId) {
    checkOutItem(itemId, 1) // hardcoded user id for testing
  }

  revalidatePath('/dashboard')
}

export async function handleDelete(formData: FormData) {
  const id = parseInt(formData.get('id') as string, 10)
  id ? await deleteItem(id) : console.log('error')
  revalidatePath('/dashboard')
}
