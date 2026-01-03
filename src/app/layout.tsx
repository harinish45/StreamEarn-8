import type { Metadata } from "next";
import { Inter, Playfair_Display, Courier_Prime, Orbitron } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseProvider } from "@/firebase/provider";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "StreamEarn",
  description: "Your gateway to online earning opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${courier.variable} ${orbitron.variable} font-sans antialiased`}
      >
        <FirebaseProvider>
          <ThemeProvider
            storageKey="theme"
            defaultTheme="Batman"
          >
            {children}
            <Toaster />
            <FirebaseErrorListener />
          </ThemeProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
