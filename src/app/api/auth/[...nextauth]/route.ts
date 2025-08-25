
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, SessionStrategy } from "next-auth";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) {
          return null;
        }
        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) {
          return null;
        }
        return {
          id: String(user.id),
          email: user.email,
          name: user.username,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google-client-id-placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-client-secret-placeholder",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "facebook-client-id-placeholder",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "facebook-client-secret-placeholder",
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only handle social logins
      if (!user.email) return false;
      // Check if user exists in DB
      let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
      if (!dbUser) {
        // Create user with default role 'user'
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            username: user.name ? user.name.replace(/\s+/g, '').toLowerCase() : user.email.split('@')[0],
            password: '', // No password for social login
            role: 'user',
          },
        });
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to home after login
      if (url.includes("/auth/login") || url === baseUrl + "/dashboard") {
        return baseUrl;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async jwt({ token, user }) {
      // Add role to JWT
      if (user && user.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        token.role = dbUser?.role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
