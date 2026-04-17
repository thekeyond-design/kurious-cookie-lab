import type { Metadata } from "next";
import { Story_Script, Oswald, Arimo, Nunito, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const adws = localFont({
  src: "../public/fonts/ADayWithoutSun.ttf",
  variable: "--font-adws",
  display: "swap",
});

const storyScript = Story_Script({
  variable: "--story-script",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const arimo = Arimo({
  variable: "--arimo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kurious Cookie Lab",
  description: "Science baked into every bite. Artisan cookies built like chemistry — pick your elements, build your formula.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${adws.variable} ${storyScript.variable} ${oswald.variable} ${arimo.variable} ${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF6F0] text-black">
        {children}
      </body>
    </html>
  );
}
