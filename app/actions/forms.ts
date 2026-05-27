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
  let userId: string
  try {
    userId = await sessionRequired()
  } catch {
    return { error: 'Session expired. Please sign in again.' }
  }

  const raw = formData.get('itemId');

  // null guard with provided error
  if (raw === null) {
    return { error: 'Please enter an item ID.' }
  }

  // string type assertion.
  const trimmed = (raw as string).trim()

  // positive integer 'string' only
  if (!/^\d+$/.test(trimmed)) {
    return { error: 'Please enter a valid item ID.' }
  }

  // cast it to integer
  const itemId = parseInt(trimmed, 10)

  // check for safe integer
  if (trimmed.length > 10 || !Number.isSafeInteger(itemId)) {
    return { error: 'Please enter a valid item ID.' }
  }

  if (itemId <= 0) {
    return { error: 'Please enter a valid item ID.' }
  }

  const result = await checkOutItem(itemId, userId)
  if (result?.error) return result

  revalidatePath('/dashboard')
  return null
}

// //dashboard Items Table delete button action
export async function handleDelete(formData: FormData) {
  // protect against post request without user session or id
  await sessionRequired()

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id) || id <= 0) throw new Error('Invalid item ID')
  await deleteItem(id)
  revalidatePath('/dashboard')
}
