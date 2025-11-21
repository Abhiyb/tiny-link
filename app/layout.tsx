import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TinyLink",
  description: "URL shortener using Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        {children}
      </body>
    </html>
  );
}
