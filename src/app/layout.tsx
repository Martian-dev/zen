import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import {
  ClerkProvider,
} from '@clerk/nextjs'
import { dark } from "@clerk/themes";

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
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={`${geist.variable} ${geistMono.variable} antialiased dark text-white`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

