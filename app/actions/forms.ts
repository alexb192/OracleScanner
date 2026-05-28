'use server'
import { revalidatePath } from 'next/cache'
import { Device } from '@/prisma/generated/prisma/client'
import { createItem, deleteItem, checkOutItem, checkInItem } from '@/app/lib/db'
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

// --- Dashboard actions ---

// /dashboard Create Item form action
export async function handleSubmitItem(formData: FormData) {
  await sessionRequired()

  const type = formData.get('device') as Device
  await createItem(type)
  revalidatePath('/dashboard')
}

// /dashboard Items Table delete button action
export async function handleDelete(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  try {
    await sessionRequired()
  } catch {
    return { error: 'Session expired. Please sign in again.' }
  }

  const id = parseInt(formData.get('id') as string, 10)
  if (isNaN(id) || id <= 0 || id > 2_147_483_647) return { error: 'Invalid item ID.' }

  try {
    await deleteItem(id)
  } catch {
    return { error: 'Failed to delete item.' }
  }

  revalidatePath('/dashboard')
  return null
}

// --- Check-out / Check-in / Scanner dispatcher ---

// /dashboard Items Table inline check out action
export async function handleCheckOutById(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  let userId: string
  try {
    userId = await sessionRequired()
  } catch {
    return { error: 'Session expired. Please sign in again.' }
  }

  const id = parseInt(formData.get('itemId') as string, 10)
  if (isNaN(id) || id <= 0 || id > 2_147_483_647) return { error: 'Invalid item ID.' }

  try {
    const result = await checkOutItem(id, userId)
    if (result?.error) return result
  } catch {
    return { error: 'An unexpected error occurred.' }
  }

  revalidatePath('/dashboard')
  return null
}

// /dashboard Items Table inline check in action
export async function handleCheckInById(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  try {
    await sessionRequired()
  } catch {
    return { error: 'Session expired. Please sign in again.' }
  }

  const id = parseInt(formData.get('itemId') as string, 10)
  if (isNaN(id) || id <= 0 || id > 2_147_483_647) return { error: 'Invalid item ID.' }

  try {
    const result = await checkInItem(id)
    if (result?.error) return result
  } catch {
    return { error: 'An unexpected error occurred.' }
  }

  revalidatePath('/dashboard')
  return null
}

// /scanner QR scan dispatcher — routes to check-out or check-in based on mode field
export async function handleScanById(
  prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const mode = formData.get('mode')
  if (mode === 'checkOut') return handleCheckOutById(prevState, formData)
  if (mode === 'checkIn')  return handleCheckInById(prevState, formData)
  return { error: 'Invalid scan mode.' }
}
