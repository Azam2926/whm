import type { Metadata } from "next";
import "../globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";

const title = "Warehouse app Login";
const description = "Warehouse app for management";
const image_url = "https://avatars.githubusercontent.com/u/28877486?v=4";
const url = "https://whuz.vercel.app";

export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    siteName: "Warehouse app",
    url: url,
    images: [
      {
        url: image_url,
        width: 1200,
        height: 630,
        alt: "A description of the image_url"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: [image_url]
  }
};

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex justify-between items-center border-b px-4">
            <div className="flex h-16 items-center px-4"></div>
            <ModeToggle />
          </div>
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
