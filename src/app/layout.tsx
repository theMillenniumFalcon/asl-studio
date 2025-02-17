import type { Metadata } from "next"
import { Source_Code_Pro } from "next/font/google"
import { ThemeProvider } from "@/providers/theme-provider"
import "../styles/globals.css"

const source_code_pro = Source_Code_Pro({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ASL Studio",
  description: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={source_code_pro.className}>
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
