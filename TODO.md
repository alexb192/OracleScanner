# TODO

Items surfaced from code review of commit `b4be357` (OAuth signup/login/logout).

---

## 🔴 High

### 1. `checkOutItem` allows overwriting an existing checkout
**File:** `app/lib/db.ts:28`

`prisma.item.update` runs unconditionally — any authenticated user can submit a checkout form with any `itemId` and overwrite the `checkedOutById` field of an item already checked out by someone else. The original checkout is silently lost.

**Fix:** Add a `where: { checkedOut: false }` clause (or check ownership) so the update only applies to available items. Optionally, return a user-facing error when the item is already taken.

```ts
await prisma.item.update({
  where: { id, checkedOut: false }, // guard added
  data: { checkedOut: true, dateCheckedOut: new Date(), checkedOutById: userId },
});
```

---

## 🟠 Medium

### 2. Dashboard page has no server-side redirect when unauthenticated
**File:** `app/dashboard/page.tsx:9`

`auth()` is called but there is no `redirect('/login')` fallback when `session` is null. The proxy (`proxy.ts`) is the only protection — if it is bypassed (e.g. direct server-side fetch, future refactor, framework edge-case), the full page including all item data renders for unauthenticated callers.

**Fix:** Add a defence-in-depth redirect after the session check:

```ts
const session = await auth()
if (!session) redirect('/login')
```

---

### 3. Removing `url` from the Prisma datasource breaks migrations
**File:** `prisma/schema.prisma:6`

The `url = env("PRISMA_DATABASE_URL")` line was removed from the datasource block. The runtime adapter in `app/lib/prisma.ts` supplies its own connection string, so queries work fine. However, Prisma CLI commands (`prisma migrate dev`, `prisma db push`, `prisma migrate deploy`) fall back to the `DATABASE_URL` env var when no `url` is specified in the schema. This project uses `PRISMA_DATABASE_URL`, so migrations will fail if `DATABASE_URL` is not also set in the environment.

**Fix:** Either restore the `url` field or ensure `DATABASE_URL` is aliased to `PRISMA_DATABASE_URL` in all environments where migrations run.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("PRISMA_DATABASE_URL") // restore this
}
```

---

## 🟡 Low

### 4. `handleSubmitCheckout` silently no-ops on blank/invalid item ID
**File:** `app/actions/forms.ts:32`

`parseInt('', 10)` returns `NaN`, and `if (NaN)` is falsy, so submitting the checkout form with a blank or non-numeric `itemId` skips the checkout entirely. `revalidatePath` still fires and the form resets — the user gets no feedback that nothing happened.

**Fix:** Use an explicit `isNaN` guard and return an error string:

```ts
if (isNaN(itemId)) return // or throw / return error message
```

---

### 5. `handleDelete` logs to server console on invalid ID instead of surfacing an error
**File:** `app/actions/forms.ts:44`

When the `id` field is blank or malformed, `parseInt` returns `NaN`, the ternary falls through to `console.log('error')`, and the action returns `undefined` (success) to the client. The deletion silently does nothing from the user's perspective.

**Fix:** Throw or return an error instead of logging:

```ts
if (isNaN(id)) throw new Error('Invalid item ID')
await deleteItem(id)
```
