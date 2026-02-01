import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components";
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
        {children}
        <ScrollToTop threshold={50} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-bg-section)",
              border: "1px solid var(--color-border-gold-light)",
              color: "white",
            },
          }}
        />
      </body>
    </html>
  );
}
