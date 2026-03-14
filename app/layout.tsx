import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SaaS Platform - Miguel Tech Solutions",
  description:
    "Uma plataforma SaaS moderna e escalável para gerenciar seus negócios.",
  keywords: [
    "SaaS",
    "plataforma",
    "gerenciamento",
    "automação",
    "negócios",
  ],
  authors: [{ name: "Miguel Moura Santos" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://saas-platform.vercel.app",
    title: "SaaS Platform - Miguel Tech Solutions",
    description:
      "Uma plataforma SaaS moderna e escalável para gerenciar seus negócios.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1a1a1a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
