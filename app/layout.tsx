import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AiCenna — Clinician Portal",
  description: "AI-powered clinical dashboard for patient monitoring and digital twins",
};

export const viewport: Viewport = {
  themeColor: "#07111F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#07111F]">
      <body className="antialiased">{children}</body>
    </html>
  );
}
