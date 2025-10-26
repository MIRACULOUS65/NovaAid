import type { Metadata } from "next"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "NGO Portal - NovaAid",
  description: "Manage and provide aid services for NGOs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/ngo-portal"
      signUpFallbackRedirectUrl="/ngo-portal"
    >
      <html lang="en" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <body className="antialiased" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
