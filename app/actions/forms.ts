'use server'
import { revalidatePath } from 'next/cache'
import { Device } from '@/prisma/generated/prisma/client'
import { createItem, deleteItem, checkOutItem } from '@/app/lib/db'
import { auth } from '@/auth'

// server actions for handling form submissions
async function sessionRequired() {
  //
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  // just returning user id for now, ts was upset about session possibly being null
  return session.user.id
}

// /dashboard Create Item form action
export async function handleSubmitItem(formData: FormData) {
  await sessionRequired()

  const type = formData.get('device') as Device
  await createItem(type)
  revalidatePath('/dashboard')
}

// /dashboard Check Out form action
export async function handleSubmitCheckout(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const userId = await sessionRequired()

  const itemId = parseInt(formData.get('itemId') as string, 10)

  if (isNaN(itemId)) {
    return { error: 'Please enter a valid item ID.' }
  }

  if (itemId) {
    const result = await checkOutItem(itemId, userId)
    if (result?.error) return result
  }

  revalidatePath('/dashboard')
  return null
}

// //dashboard Items Table delete button action
export async function handleDelete(formData: FormData) {
  // protect against post request without user session or id
  await sessionRequired()

  const id = parseInt(formData.get('id') as string, 10)
  id ? await deleteItem(id) : console.log('error')
  revalidatePath('/dashboard')
}
