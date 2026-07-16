import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { SmoothScroll } from "./smooth-scroll";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TechPulse AI",
    template: "%s | TechPulse AI",
  },

  description:
    "AI-powered technology intelligence platform for software updates, security alerts and developer news.",

  applicationName: "TechPulse AI",

  keywords: [
    "AI",
    "Technology",
    "Software",
    "Cyber Security",
    "Developer News",
    "FastAPI",
    "Next.js",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <ThemeProvider>
   <SmoothScroll />
    {children}
  </ThemeProvider>
</body>
    </html>
  );
}
