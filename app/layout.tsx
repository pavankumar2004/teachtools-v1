import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import "./globals.css";
import { Manrope as Font } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/google-analytics"
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/craft";
import { NewsletterSignup } from "@/components/newsletter-signup";

import { directory } from "@/directory.config";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Mail } from "lucide-react";

const font = Font({
  subsets: ["latin"],
  display: "swap",
});

// This function generates metadata for the root layout
// For dynamic routes, use generateMetadata in the page file
export const metadata: Metadata = {
  title: directory.title,
  description: directory.description,
  metadataBase: new URL(directory.baseUrl),
  // Canonical URL will be set dynamically in each page
  // The root layout provides the base URL
  openGraph: {
    title: directory.title,
    description: directory.description,
    url: directory.baseUrl,
    siteName: directory.name,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: directory.title,
    description: directory.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  );
}

const Header = () => {
  return (
    <header className="py-4 border-b border-border">
      <Container className="flex items-center justify-between gap-3">
        <Link href="/" className="transition-all hover:opacity-80 flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl">TeachTools.site</span>
            <span className="text-xs text-muted-foreground">AI Tools for Educators</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <a href="/about" className="text-sm hover:text-primary transition-colors">About</a>
          <a href="/submit" className="text-sm hover:text-primary transition-colors">Submit a Tool</a>
          <a href="/newsletter" className="text-sm hover:text-primary transition-colors">Newsletter</a>
          <Subscribe />
        </div>
      </Container>
    </header>
  );
};

const Footer = () => {
  return (
    <footer>
      <Container className="flex items-center justify-between gap-3">
        <div className="grid gap-1 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {directory.name} - All rights reserved.
          </p>
          <p>
            A resource for educators by{" "}
            <a
              className="underline transition-all hover:text-foreground"
              href="#"
            >
              pavan
            </a>
          </p>
          <p className="text-xs opacity-70">
            Helping teachers leverage AI to enhance education
          </p>
        </div>
        <ThemeToggle />
      </Container>
    </footer>
  );
};

const Subscribe = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center">
          <Mail className="mr-2 h-3 w-3" /> Subscribe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe for more resources</DialogTitle>
          <DialogDescription>
            Get notified when new resources are added.
          </DialogDescription>
        </DialogHeader>
        <NewsletterSignup title="" description="" />
        <div className="h-px" />
      </DialogContent>
    </Dialog>
  );
};
