import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Let's Print - Print Management System",
  description: "Complete print management solution for clients, business owners, and production facilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
