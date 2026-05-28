// Extends NextAuth's built-in types to include custom fields.
// Without this, TypeScript won't recognise session.user.admin or token.admin.

import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  // Adds admin to the User object returned by authorize(), making it available in the jwt() callback
  interface User {
    admin: boolean
  }

  interface Session {
    user: {
      admin: boolean
    } & DefaultSession['user'] // preserves built-in fields: id, name, email, image
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    admin?: boolean // optional: old tokens won't have this field until they are refreshed
  }
}
