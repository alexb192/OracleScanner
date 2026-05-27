# TODO

Items surfaced from code review of QR scanner (`app/ui/qr_scanner.tsx`, `app/scanner/page.tsx`).

---

## 🔴 High

### 1. `parseInt` returns `Infinity` for very long digit strings — unhandled Prisma throw
**File:** `app/actions/forms.ts:52`

`/^\d+$/` and `itemId <= 0` both pass for a 310+ digit string. `parseInt('9'.repeat(350), 10)` returns `Infinity`. `Infinity <= 0` is false, so `checkOutItem(Infinity, userId)` is called. Prisma throws a P2020 integer-overflow validation error, which propagates as an unhandled server-action exception (500) instead of returning `{ error }`.

**Fix:** Add a `Number.isSafeInteger` check after `parseInt`, or cap the raw string length before parsing:

```ts
if (raw.length > 10 || !Number.isSafeInteger(itemId)) {
  return { error: 'Please enter a valid item ID.' }
}
```

---

## 🟠 Medium

### 2. Bare `catch {}` swallows non-auth errors from `auth()` — reports them as "session expired"
**File:** `app/actions/forms.ts:35`

The `try/catch` wrapping `sessionRequired()` catches every exception, including genuine infrastructure errors (DB down, network timeout, misconfigured JWT secret). All are silently swallowed and returned as `{ error: 'Session expired. Please sign in again.' }` with no logging. A real outage becomes invisible to operators and gives the user a wrong diagnosis.

**Fix:** Either log the error before returning, or only catch the specific `Unauthorized` case:

```ts
try {
  userId = await sessionRequired()
} catch (err) {
  const isUnauthorized = err instanceof Error && err.message === 'Unauthorized'
  if (!isUnauthorized) console.error('sessionRequired failed', err)
  return { error: 'Session expired. Please sign in again.' }
}
```

---

### 3. `handleDelete` throws instead of returning `{ error }` — crashes to error boundary
**File:** `app/actions/forms.ts:71`

`handleDelete` is wired as a plain `<form action={handleDelete}>` (no `useActionState`), so any thrown error has no client-side state channel to land in. If the action throws (bad input, Prisma error, etc.), Next.js renders a generic error boundary / 500 page instead of showing an inline message. This is inconsistent with `handleSubmitCheckout`, which returns `{ error }` for every failure.

**Fix:** Since the calling form doesn't use `useActionState`, the simplest remedy is to ensure inputs are always valid (the form already sets `value={item.id}` from the DB), and/or add an error boundary around the dashboard. Alternatively, migrate the delete form to `useActionState` to give it a real error channel.

---

### 4. `id=0` passes the `isNaN` guard in `handleDelete` — causes unhandled Prisma P2025
**File:** `app/actions/forms.ts:70`

`parseInt('0', 10)` returns `0`. `isNaN(0)` is `false`, so `deleteItem(0)` is called. `prisma.item.delete({ where: { id: 0 } })` throws P2025 ("Record to delete does not exist") since auto-increment IDs start at 1. This propagates as an unhandled crash rather than a user-facing error.

**Fix:** Extend the guard to cover zero and negatives:

```ts
if (isNaN(id) || id <= 0) throw new Error('Invalid item ID')
```

---

## 🟡 Low

### 5. Camera stream not stopped when `video.play()` rejects — camera light stays on
**File:** `app/ui/qr_scanner.tsx:85`

When `video.play()` rejects (e.g. browser autoplay policy), `setCameraError` is called but the `MediaStream` tracks are never stopped. The error auto-clears after 3 s, leaving the user with a blank video box, no error message, and the camera indicator light still on. The stream is only cleaned up on component unmount.

**Fix:** Stop the tracks inside the `.catch()` handler:

```ts
video.play().catch(() => {
  stream.getTracks().forEach((t) => t.stop())
  video.srcObject = null
  setCameraError('Could not start video playback. Try reloading the page.')
})
```
