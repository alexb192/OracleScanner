# TODO

## Code Review Findings (2026-06-04)

- [x] **`app/actions/auth.ts:59` — revalidatePath wrong route (bug)**
  `revalidatePath('/dashboard')` does not invalidate `/accounts`, so the users table never refreshes after a successful user creation.
  **Fix:** Change to `revalidatePath('/accounts')`.

- [x] **`app/ui/users_table.tsx` — form not reset after success (UX bug)**
  After a successful create, name/email/password inputs retain their values. A second click on `+ Create` submits the same email and looks like the first submit failed.
  **Fix:** Add a success-counter key to the form (`<form key={successCount} ...>`) and increment it when `registerState` has a `success` field, or call `form.reset()` in a `useEffect` watching `registerState`.

- [x] **`app/ui/users_table.tsx:9` — `email` typed as non-nullable but Prisma schema is `String?`**
  The `User` type declares `email: string` but `prisma.user.email` is nullable, so a user created via OAuth with no email violates the contract silently.
  **Fix:** Change the `User` type to `email: string | null`.

- [x] **`app/ui/users_table.tsx` — inline register form duplicates `RegisterForm` component**
  Two separate code paths for user creation will silently diverge when one is updated without the other.
  **Fix:** Reuse `RegisterForm` inside `UsersTable` (or the wrapper), or extract the shared form fields into a single component.

- [x] **`app/accounts/page.tsx:3` — dead import of `RegisterForm`**
  `RegisterForm` is imported but never rendered on this page.
  **Fix:** Remove the import line.

- [x] **`app/ui/users_table_wrapper.tsx:6` — unnecessary 1:1 serialization map**
  The `users.map(...)` copies every field identically with no transformation, and silently drops any future fields added to `fetchUsers`.
  **Fix:** Remove the map and pass `users` directly: `return <UsersTable users={users} />`.

- [x] **`app/actions/auth.ts:8` — `revalidatePath` imported from internal Next.js path**
  `next/dist/server/web/spec-extension/revalidate` is an internal module; the rest of the codebase uses the public `next/cache` API.
  **Fix:** Change to `import { revalidatePath } from 'next/cache'`.
