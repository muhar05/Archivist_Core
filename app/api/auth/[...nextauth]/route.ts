import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "admin@prms.local" && credentials?.password === "admin123") {
          return {
            id: "00000000-0000-0000-0000-000000000001",
            name: "Admin Archivist",
            email: "admin@prms.local",
            role: "admin"
          };
        }
        if (credentials?.email === "staff@prms.local" && credentials?.password === "staff123") {
          return {
            id: "00000000-0000-0000-0000-000000000002",
            name: "Staff Operator",
            email: "staff@prms.local",
            role: "staff"
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id: string; role: string };
        token.id = u.id;
        token.role = u.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
