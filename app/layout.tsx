import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Suspense } from "react";

import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-full flex-1 flex-col items-center">
              <nav className="border-b-foreground/10 flex h-16 w-full justify-center border-b">
                <div className="flex w-full max-w-5xl items-center justify-between p-3 px-5 text-sm">
                  <div className="flex items-center gap-5 font-semibold">
                    <Link href={"/"}>숙제 캘린더</Link>
                  </div>
                  {!hasEnvVars ? (
                    <EnvVarWarning />
                  ) : (
                    <Suspense>
                      <AuthButton />
                    </Suspense>
                  )}
                </div>
              </nav>

              <div className="flex max-w-5xl flex-1 flex-col gap-20 p-5">
                {children}
              </div>

              <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs">
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
