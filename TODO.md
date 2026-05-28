# TODO — Code Review Findings

Findings from review of the inline table actions refactor.
Ranked most-severe first. 🔴 = bug, 🟡 = bug/regression, 🔵 = cleanup.

---

## 🔴 1. `selectedId` not cleared after a successful Delete

**File:** `app/ui/items_table.tsx`

After `handleDelete` runs and `revalidatePath` re-renders the table without the deleted
item, `selectedId` still holds the old ID. `selectedItem` becomes `undefined`, so the
`disabled` conditions on Check Out and Delete both evaluate to falsy — re-enabling them
for a ghost ID.

**Fix:** add a `useEffect` that clears `selectedId` whenever the selected item is no
longer present in the `items` prop:

```tsx
// items_table.tsx — add inside ItemsTable, after the selectedItem line
useEffect(() => {
    if (selectedId !== null && !items.some(item => item.id === selectedId)) {
        setSelectedId(null)
    }
}, [items, selectedId])
```

---

## 🔴 2. Missing safe-integer guard and no try/catch in `handleCheckOutById` / `handleCheckInById`

**File:** `app/actions/forms.ts`

The old `handleSubmitCheckout` checked `trimmed.length > 10` and `Number.isSafeInteger`.
The new inline actions only check `isNaN(id) || id <= 0`. A value like `2147483648`
(one above PostgreSQL `int4` max) passes both guards, reaches Prisma, and causes an
unhandled range exception — a 500 instead of a graceful `{ error }` return.

**Fix:** add the int4 ceiling guard and wrap the db call in try/catch in both actions:

```ts
// Replace the id parse + guard in both handleCheckOutById and handleCheckInById
const id = parseInt(formData.get('itemId') as string, 10)
if (isNaN(id) || id <= 0 || id > 2_147_483_647) {
  return { error: 'Invalid item ID.' }
}

try {
  const result = await checkOutItem(id, userId) // or checkInItem(id)
  if (result?.error) return result
} catch {
  return { error: 'An unexpected error occurred.' }
}
```

---

## 🔴 3. `handleCheckInById` discards `userId` — any authenticated user can check in anyone's item

**File:** `app/actions/forms.ts`, line 101

`sessionRequired()` is called but its return value is thrown away. `checkInItem` has no
ownership check, so any logged-in user can check in an item another user checked out.

**Fix (minimum):** capture `userId`. **Fix (full):** add `checkedOutById` to the
`where` clause in `checkInItem` so only the original borrower can return it:

```ts
// handleCheckInById — capture userId
const userId = await sessionRequired()

// checkInItem in app/lib/db.ts — add ownership filter
export async function checkInItem(id: number, userId: string): Promise<{ error: string } | null> {
    const result = await prisma.item.updateMany({
        where: { id, checkedOut: true, checkedOutById: userId },
        data: { checkedOut: false, dateCheckedOut: null, checkedOutById: null }
    })
    if (result.count === 0) {
        const item = await prisma.item.findUnique({ where: { id } })
        if (!item) return { error: 'This item does not exist.' }
        if (item.checkedOutById !== userId) return { error: 'You did not check out this item.' }
        return { error: 'This item is not currently checked out.' }
    }
    return null
}
```

---

## 🟡 4. Stale error from one action persists after the other action succeeds

**File:** `app/ui/items_table.tsx`, line 24

```ts
const error = checkOutState?.error ?? checkInState?.error ?? null
```

`useActionState` only resets a state when *its own* action is invoked again. If
`checkOutState` holds an error and then `checkInAction` succeeds (returns `null`),
`checkOutState` is untouched — the old error stays on screen after a successful
operation.

**Fix:** display each action's error independently so they show and hide on their own:

```tsx
// Replace the single `error` line and the {error && ...} block with:
{checkOutState?.error && (
    <p aria-live="polite" className="text-sm text-red-500">{checkOutState.error}</p>
)}
{checkInState?.error && (
    <p aria-live="polite" className="text-sm text-red-500">{checkInState.error}</p>
)}
{deleteState?.error && (
    <p aria-live="polite" className="text-sm text-red-500">{deleteState.error}</p>
)}
```

---

## 🟡 5. `handleDelete` not wrapped in `useActionState` — errors hit the error boundary

**File:** `app/ui/items_table.tsx` + `app/actions/forms.ts`

`handleDelete` uses `throw` for errors. Because it is bound to a plain
`<form action={handleDelete}>` rather than a `useActionState`-wrapped action, any thrown
error propagates to the Next.js error boundary instead of displaying inline, unlike Check
Out and Check In which both return `{ error }` inline.

**Fix:** convert `handleDelete` to the `useActionState` signature and wire it up:

```ts
// forms.ts
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
  if (isNaN(id) || id <= 0) return { error: 'Invalid item ID.' }
  try {
    await deleteItem(id)
  } catch {
    return { error: 'Failed to delete item.' }
  }
  revalidatePath('/dashboard')
  return null
}
```

```tsx
// items_table.tsx
const [deleteState, deleteAction, deletePending] = useActionState(handleDelete, null)

// Replace <form action={handleDelete}> with:
<form action={deleteAction}>
```

---

## 🟡 6. No deletion confirmation step — easy accidental delete after row selection

**File:** `app/ui/items_table.tsx`

The old design required ticking "Enable Deletion" before any Delete button appeared.
The new toolbar Delete button activates on a single row click with no guard. A user
reading a row's details can delete it with one accidental extra click.

**Fix:** use a two-step confirm state local to the toolbar:

```tsx
const [confirmingDelete, setConfirmingDelete] = useState(false)

// In the toolbar, replace the Delete form with:
{confirmingDelete ? (
    <>
        <form action={deleteAction}>
            <input type="hidden" name="id" value={selectedId ?? ''} />
            <button
                type="submit"
                disabled={!selectedId || deletePending}
                className="px-3 py-1 text-sm font-medium rounded-sm border border-red-400 dark:border-red-500 text-red-600 dark:text-red-400 bg-white dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer disabled:opacity-40"
            >
                Confirm Delete
            </button>
        </form>
        <button type="button" onClick={() => setConfirmingDelete(false)} className={actionBtnClass}>
            Cancel
        </button>
    </>
) : (
    <button type="button" onClick={() => setConfirmingDelete(true)} disabled={!selectedId} className={actionBtnClass}>
        Delete
    </button>
)}

// Also reset confirmingDelete on row deselect:
onClick={() => { setSelectedId(selectedId === item.id ? null : item.id); setConfirmingDelete(false) }}
```

---

## 🔵 7. `handleCheckOutById` duplicates `handleSubmitCheckout` with diverging validation

**File:** `app/actions/forms.ts`

Both functions take the same inputs and call `checkOutItem`. They differ only in
validation strictness. Future fixes applied to one will silently miss the other.

**Fix:** extract a shared `parseId` helper and use it in both (or delete
`handleSubmitCheckout` once `check_out_form.tsx` is removed — see #8/#9):

```ts
// Add above the action functions
function parseId(formData: FormData, field: string): number | { error: string } {
  const raw = formData.get(field)
  if (raw === null) return { error: 'Item ID is required.' }
  const trimmed = (raw as string).trim()
  if (!/^\d+$/.test(trimmed) || trimmed.length > 10) return { error: 'Invalid item ID.' }
  const id = parseInt(trimmed, 10)
  if (!Number.isSafeInteger(id) || id <= 0 || id > 2_147_483_647) return { error: 'Invalid item ID.' }
  return id
}

// Usage in any action:
const idResult = parseId(formData, 'itemId')
if (typeof idResult !== 'number') return idResult
```

---

## 🔵 8. `check_out_form.tsx` is dead code

**File:** `app/ui/check_out_form.tsx`

The component is no longer imported or rendered anywhere after checkout was moved inline
into the table toolbar.

**Fix:**
```bash
rm app/ui/check_out_form.tsx
```

---

## 🔵 9. `handleSubmitCheckout` is a dead exported server action

**File:** `app/actions/forms.ts`, line 28

Its only consumer was `check_out_form.tsx` (see #8). Exported Next.js server actions
remain routable by their module+export identity even when unreachable from the UI,
adding unnecessary attack surface.

**Fix:** delete the function once `check_out_form.tsx` is removed.

---

## 🔵 10. `checkInItem` (and `checkOutItem`) are not atomic — race between `updateMany` and `findUnique`

**File:** `app/lib/db.ts`

Both functions do `updateMany` then `findUnique` for error disambiguation. Between the
two queries a concurrent request can change the item's state, producing a misleading
error message. `checkOutItem` has the same pattern.

**Fix:** wrap in a Prisma interactive transaction so the read and write are atomic:

```ts
export async function checkInItem(id: number): Promise<{ error: string } | null> {
    return prisma.$transaction(async (tx) => {
        const item = await tx.item.findUnique({ where: { id } })
        if (!item) return { error: 'This item does not exist.' }
        if (!item.checkedOut) return { error: 'This item is not currently checked out.' }
        await tx.item.update({
            where: { id },
            data: { checkedOut: false, dateCheckedOut: null, checkedOutById: null }
        })
        return null
    })
}
// Apply the same pattern to checkOutItem.
```
