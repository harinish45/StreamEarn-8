import type { Metadata } from "next";
import { Inter, Playfair_Display, Courier_Prime, Orbitron } from "next/font/google";
import "./globals.css";
import "./stream-fixes.css";
import "./theme-enhancements.css";
import "./theme-runtime-fixes.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeEffects } from "@/components/theme-effects";
import { AppShell } from "@/components/app-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

const POINTER_REPAIR_SCRIPT = String.raw\`(()=>{if(window.__streamEarnPointerRepair)return;window.__streamEarnPointerRepair=1;let downX=0,downY=0,moved=false;const interactive='a,button,input,textarea,select,[role="button"],[role="menuitem"]';const disabled=(el)=>!el||el.hasAttribute('disabled')||el.getAttribute('aria-disabled')==='true'||el.getAttribute('data-disabled')==='true';const locked=(el)=>!!el?.closest?.('[aria-modal="true"],[role="dialog"][data-state="open"],[data-interaction-lock="true"]');const nearest=(list)=>{for(const el of list){if(!(el instanceof HTMLElement)||disabled(el)||locked(el))continue;const hit=el.closest(interactive);if(hit instanceof HTMLElement&&!disabled(hit)&&!locked(hit))return hit}return null};document.addEventListener('pointerdown',(e)=>{downX=e.clientX;downY=e.clientY;moved=false},{capture:true,passive:true});document.addEventListener('pointermove',(e)=>{if(Math.abs(e.clientX-downX)>8||Math.abs(e.clientY-downY)>8)moved=true},{capture:true,passive:true});document.addEventListener('pointerup',(e)=>{if(moved)return;const target=e.target instanceof Element?e.target:null;if(target?.closest(interactive))return;const hit=nearest(document.elementsFromPoint(e.clientX,e.clientY));if(!hit)return;try{if(hit instanceof HTMLInputElement||hit instanceof HTMLTextAreaElement||hit instanceof HTMLSelectElement){hit.focus({preventScroll:true});if(hit instanceof HTMLSelectElement)hit.click()}else{hit.click()}}catch{}},{capture:true,passive:true});})();\`;



export const metadata: Metadata = {
  title: "StreamEarn",
  description: "Personal AI, learning, opportunity and project command centre.",
  icons: {
    icon: [{ url: "/streamearn-mark.svg", type: "image/svg+xml" }],
    shortcut: ["/streamearn-mark.svg"],
    apple: [{ url: "/streamearn-mark.svg" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><link rel="stylesheet" href="/project-command-center.css" /><script dangerouslySetInnerHTML={{__html:POINTER_REPAIR_SCRIPT}} /></head>
      <body className={`${inter.variable} ${playfair.variable} ${courier.variable} ${orbitron.variable} font-sans antialiased`}>
        <ThemeProvider storageKey="theme" defaultTheme="Batman">
          <ThemeEffects />
          <AppShell>{children}</AppShell>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
