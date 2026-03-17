import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APKgaminghub - Download Free Games & APK Mods",
  description: "Download free games, APK mods, and discover the best gaming content. Your ultimate gaming destination with tips, guides, and downloads.",
  keywords: ["APKgaminghub", "APK download", "free games", "game mods", "gaming", "Android games", "game guides"],
  authors: [{ name: "APKgaminghub Team" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "APKgaminghub - Download Free Games & APK Mods",
    description: "Download free games, APK mods, and discover the best gaming content.",
    url: "https://apkgaminghub.com",
    siteName: "APKgaminghub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "APKgaminghub - Download Free Games & APK Mods",
    description: "Download free games, APK mods, and discover the best gaming content.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
