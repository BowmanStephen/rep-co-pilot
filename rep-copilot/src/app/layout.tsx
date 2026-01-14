import type { Metadata } from "next";
import "./globals.css";
import { ContextProvider } from "@/services/contextDetection";

export const metadata: Metadata = {
  title: "Rep Co-Pilot | AstraZeneca",
  description: "AI-powered assistant for AstraZeneca Field Representatives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ContextProvider>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
