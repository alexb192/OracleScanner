'use server'
import { revalidatePath } from 'next/cache'
import { Device } from '@/prisma/generated/prisma/client'
import { createItem, deleteItem } from '@/app/lib/db'

export async function handleSubmit(formData: FormData) {
  const type = formData.get('device') as Device
  await createItem(type)
  revalidatePath('/dashboard')
}

export async function handleDelete(formData: FormData) {
  const id = parseInt(formData.get('id') as string, 10)
  id ? await deleteItem(id) : console.log('error')
  revalidatePath('/dashboard')
}
