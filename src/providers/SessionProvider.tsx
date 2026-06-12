"use client";

// Uncomment once NextAuth is configured:
// import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
// export function SessionProvider({ children }: { children: React.ReactNode }) {
//   return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
// }

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
