import type { Metadata } from "next";
import { Inter, Playfair_Display, Courier_Prime, Orbitron } from "next/font/google";
import "./globals.css";
import "./stream-fixes.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "StreamEarn",
  description: "Your gateway to online earning opportunities.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><link rel="stylesheet" href="/project-command-center.css" /></head>
      <body className={`${inter.variable} ${playfair.variable} ${courier.variable} ${orbitron.variable} font-sans antialiased`}>
        <ThemeProvider storageKey="theme" defaultTheme="Batman">
          <AppShell>{children}</AppShell>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
