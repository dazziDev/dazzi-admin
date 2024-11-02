import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Google login
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = (process.env.ALLOWED_EMAILS || "")
        .split(",")
        .map((email) => email.trim());
      return allowedEmails.includes(user.email || "");
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
});

export { handler as GET, handler as POST };
