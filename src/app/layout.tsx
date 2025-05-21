import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Menu } from "lucide-react";

import { Button } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "Zen",
  description: "Get your stuff done with no friction",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body
          className={`${geist.variable} ${geistMono.variable} dark text-white antialiased`}
        >
          <div className="flex h-screen flex-col overflow-hidden">
            <header className="bg-background sticky top-0 right-0 left-0 z-20 flex h-12 items-center p-4">
              <div className="flex w-full items-center justify-between px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Menu</span>
                </Button>

                <h1 className="text-2xl font-medium">Zen</h1>

                <SignedOut>
                  <SignInButton>
                    <Button className="hover:cursor-pointer" variant="outline">
                      Sign In
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </header>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
