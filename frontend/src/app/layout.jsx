import "./globals.css";

export const metadata = {
  title: "Let's Print - Print Management System",
  description: "Complete print management solution for clients, business owners, and production facilities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
