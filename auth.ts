import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'

// breaks down the NextAuth configuration into separate exports so that the auth handler can be used in both the 
// API route and the server actions without causing a duplicate handler error.
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user?.password) return null

        const valid = await bcrypt.compare(credentials.password as string, user.password)
        return valid ? user : null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      // user is only present on first sign-in; persist admin to the token so it survives across requests
      if (user) token.admin = user.admin
      return token
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      // Boolean() coerces unknown → boolean (JWT index signature widens token fields to unknown in v5 beta)
      session.user.admin = Boolean(token.admin)
      return session
    },
  },
})
