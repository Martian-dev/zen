import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

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
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geist.variable} ${geistMono.variable} antialiased dark text-white`}>
          <header className="fixed top-0 w-full bg-[#0d0c0c] text-white flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

