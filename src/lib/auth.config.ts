import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60, // 1 year
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = auth?.user?.role
      const pathname = nextUrl.pathname

      const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password") || pathname.startsWith("/verify")
      const isApiAuth = pathname.startsWith("/api/auth")

      if (isAuthPage || isApiAuth) return true

      if (!isLoggedIn) return false

      if (pathname.startsWith("/admin") && role !== "ADMIN") return false
      if (pathname.startsWith("/teacher") && role !== "TEACHER" && role !== "ADMIN") return false
      if (pathname.startsWith("/student") && !["STUDENT", "TEACHER", "ADMIN"].includes(role || "")) return false

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  providers: [],
}
