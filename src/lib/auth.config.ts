import type { NextAuthConfig } from "next-auth";

// Edge-safe base config (no Prisma/bcrypt) shared between the full auth.ts
// (Node runtime: API routes, Server Components) and middleware.ts (Edge runtime).
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.role = user.role;
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) session.user.role = token.role as string;
      return session;
    },
  },
};
