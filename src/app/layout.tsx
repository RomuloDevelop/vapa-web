import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components";
import { PostHogProvider } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "VAPA - Venezuelan-American Petroleum Association",
  description: "A nonprofit professional organization uniting experts in the Hydrocarbon industry and related energies to promote technical advancement, education, and sustainable development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full font-primary antialiased">
        <a
          href="#main-content"
          className="fixed top-4 left-4 z-9999 px-4 py-2 bg-accent text-surface font-semibold rounded outline-2 outline-offset-2 outline-accent -translate-y-20 focus:translate-y-0 transition-transform"
        >
          Skip to main content
        </a>
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <ScrollToTop threshold={50} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-bg-section)",
              border: "1px solid var(--color-border-gold-light)",
              color: "white",
            },
            classNames: {
              success: "!border-green-500/40 [&>[data-icon]]:text-green-400",
            },
          }}
        />
      </body>
    </html>
  );
}
