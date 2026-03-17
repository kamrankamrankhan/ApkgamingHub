import type { Metadata, Viewport } from "next";
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

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
    { media: "(prefers-color-scheme: dark)", color: "#581c87" },
  ],
};

// Comprehensive SEO Metadata
export const metadata: Metadata = {
  // Basic Meta Tags
  title: {
    default: "APKgaminghub - Download Free Games, APK Mods & Gaming Guides",
    template: "%s | APKgaminghub",
  },
  description: "Download free games, APK mods, and discover the best gaming content. Your ultimate gaming destination with game guides, tips, strategies, and free downloads for Android games.",
  keywords: [
    "APKgaminghub",
    "APK download",
    "free games download",
    "game mods",
    "Android games",
    "APK mods",
    "gaming guides",
    "game tips",
    "game strategies",
    "slots games",
    "casino games",
    "poker games",
    "skill games",
    "bingo games",
    "free Android games",
    "game walkthroughs",
    "gaming tutorials",
    "mobile games",
  ],
  authors: [{ name: "APKgaminghub Team", url: "https://apkgaminghub.com" }],
  creator: "APKgaminghub",
  publisher: "APKgaminghub",
  
  // Icons
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/logo.png", color: "#7c3aed" },
    ],
  },
  
  // Manifest
  manifest: "/manifest.json",
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Open Graph Tags
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apkgaminghub.com",
    siteName: "APKgaminghub",
    title: "APKgaminghub - Download Free Games, APK Mods & Gaming Guides",
    description: "Download free games, APK mods, and discover the best gaming content. Your ultimate gaming destination with game guides, tips, strategies, and free downloads.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "APKgaminghub - Free Game Downloads",
      },
    ],
  },
  
  // Twitter Card Tags
  twitter: {
    card: "summary_large_image",
    site: "@apkgaminghub",
    creator: "@apkgaminghub",
    title: "APKgaminghub - Download Free Games, APK Mods & Gaming Guides",
    description: "Download free games, APK mods, and discover the best gaming content. Your ultimate gaming destination.",
    images: ["/logo.png"],
  },
  
  // Alternates
  alternates: {
    canonical: "https://apkgaminghub.com",
  },
  
  // Category
  category: "Gaming",
  
  // Classification
  classification: "Gaming & Entertainment",
  
  // Other SEO relevant tags
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "APKgaminghub",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#7c3aed",
    "msapplication-tap-highlight": "no",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "APKgaminghub",
  "url": "https://apkgaminghub.com",
  "description": "Download free games, APK mods, and discover the best gaming content. Your ultimate gaming destination with game guides, tips, strategies, and free downloads.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://apkgaminghub.com/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "APKgaminghub",
    "logo": {
      "@type": "ImageObject",
      "url": "https://apkgaminghub.com/logo.png"
    }
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "APKgaminghub",
  "url": "https://apkgaminghub.com",
  "logo": "https://apkgaminghub.com/logo.png",
  "description": "Your ultimate destination for free game downloads, APK mods, gaming guides, and tips.",
  "sameAs": [
    "https://facebook.com/apkgaminghub",
    "https://twitter.com/apkgaminghub",
    "https://instagram.com/apkgaminghub",
    "https://youtube.com/apkgaminghub"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["English"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
