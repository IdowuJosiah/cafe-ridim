import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import "./page.scss"
import "./Hero.css"

// Self-hosted by Next.js, so it no longer blocks rendering on a Google Fonts request
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Cafe Ridim Website",
    description: "Official Cafe Ridim Website",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
            {/* Both are only discovered after the CSS loads, so start fetching them straight away */}
            <link rel="preload" as="image" href="/bg2.webp" type="image/webp" fetchPriority="high" />
            <link rel="preload" as="font" href="/font/atpfont.woff2" type="font/woff2" crossOrigin="anonymous" />
        </head>
      <body
        className={`${lexend.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
