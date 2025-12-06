import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cocoanut Grove Fire Evacuation Simulation",
  description: "A sophisticated Multi-Agent System simulation that recreates the tragic Cocoanut Grove nightclub fire of 1942. Explore evacuation scenarios and understand how simple interactions between individuals can lead to system-wide failures.",
  keywords: ["fire evacuation", "multi-agent system", "simulation", "crowd dynamics", "safety engineering", "complexity theory"],
  authors: [{ name: "Jean Reinhold" }],
  openGraph: {
    title: "Cocoanut Grove Fire Evacuation Simulation",
    description: "Interactive Multi-Agent System simulation exploring evacuation dynamics and crowd behavior in emergency scenarios.",
    url: "https://jean-reinhold.github.io/multi-agents-fire-scape",
    siteName: "Fire Evacuation Simulation",
    type: "website",
    images: [
      {
        url: "/icon.svg",
        width: 100,
        height: 100,
        alt: "Fire Evacuation Simulation",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Cocoanut Grove Fire Evacuation Simulation",
    description: "Interactive Multi-Agent System simulation exploring evacuation dynamics and crowd behavior.",
    images: ["/icon.svg"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
