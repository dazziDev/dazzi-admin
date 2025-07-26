import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// 환境변수 검증 및 로그 출력
console.log("=== NextAuth Environment Variables ===");
console.log("NEXT_PUBLIC_GOOGLE_CLIENT_ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_CLIENT_SECRET length:", process.env.GOOGLE_CLIENT_SECRET?.length || 0);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
console.log("ALLOWED_EMAILS:", process.env.ALLOWED_EMAILS);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("=====================================");

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
      console.log("=== SignIn Callback ===");
      console.log("User email:", user.email);
      
      const allowedEmails = (process.env.ALLOWED_EMAILS || "")
        .split(",")
        .map((email) => email.trim());
      
      console.log("Allowed emails:", allowedEmails);
      const isAllowed = allowedEmails.includes(user.email || "");
      console.log("Is email allowed:", isAllowed);
      console.log("=======================");
      
      return isAllowed;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
});

export { handler as GET, handler as POST };
