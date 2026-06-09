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

## Code Review Findings (2026-06-09)

- [x] **`app/actions/auth.ts:56` — admin privilege escalation via loose `!== null` check (security bug)**
  `formData.get('admin') !== null` is true for any value including `""` or `"false"`, so a direct POST with `admin=` or `admin=false` silently grants admin rights.
  **Fix:** Revert to `formData.get('admin') === 'on'`, which only accepts the exact value a browser checkbox submits.

- [x] **`app/actions/auth.ts:52` — blank name bypasses required-field guard (bug)**
  `name` is built as `` `${fname} ${lname}` `` before the `!name` check, so empty strings produce `" "` (a space) which is truthy, allowing a user to be created with a whitespace-only name.
  **Fix:** Validate `fname` and `lname` individually before concatenating, e.g. `if (!fname.trim() || !lname.trim() || !email || !password) return { error: 'All fields are required.' }`.

- [x] **`app/ui/users_table.tsx:54` — Unicode subscript zero breaks Tailwind dark-mode class (bug)**
  The class `dark:text-zinc-30₀` contains U+2080 (subscript zero) instead of ASCII `0`, so Tailwind never generates the rule and the "Admin" label is unstyled in dark mode.
  **Fix:** Replace `dark:text-zinc-30₀` with `dark:text-zinc-300`.

- [x] **`app/ui/users_table.tsx:59` — error/success feedback is tooltip-only, invisible on touch (UX bug)**
  Registration errors and successes are rendered as a bare `⚠` / `✓` icon with the message only in a `title` attribute, which touch devices cannot access.
  **Fix:** Render the message as visible text alongside the icon, e.g. `<span className="text-amber-500 text-xs">{registerState.error}</span>`.

- [x] **`app/actions/auth.ts:21` — underscore excluded from valid special characters (UX bug)**
  The regex `[^\w\d\s:]` uses `\w` which already includes `_`, so `Password1_` is incorrectly rejected as lacking a special character.
  **Fix:** Replace with `[^a-zA-Z0-9\s]` (or similar) so that `_`, `:`, and other punctuation are treated as special characters.

- [x] **`app/ui/users_table.tsx:58` — spacer div has no height and is invisible (bug)**
  `<div className="w-px dark:bg-zinc-700 ml-auto" />` has no `h-*` class; in a `flex items-center` container it collapses to zero height and renders nothing.
  **Fix:** Add `h-5` (or `h-full`) to give the divider a visible height, or remove the element if it serves no purpose.
