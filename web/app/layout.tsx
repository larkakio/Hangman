import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const shareTech = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: "400",
});

const baseAppId =
  process.env.NEXT_PUBLIC_BASE_APP_ID ?? "placeholder-register-on-base-dev";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Neon Hangman",
  description:
    "Cyberpunk hangman on Base. Swipe the neon glyph field to decode signals level by level.",
  icons: {
    icon: "/app-icon.jpg",
    apple: "/app-icon.jpg",
  },
  openGraph: {
    title: "Neon Hangman",
    description: "Swipe letters in the glyph field. Survive the signal decay.",
    images: [{ url: "/app-thumbnail.jpg", width: 1200, height: 628 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${shareTech.variable} h-full`}
    >
      <head>
        <meta name="base:app_id" content={baseAppId} />
      </head>
      <body className="signal-decay-bg min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
