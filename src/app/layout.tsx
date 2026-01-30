import type { Metadata } from "next";
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
      </body>
    </html>
  );
}
