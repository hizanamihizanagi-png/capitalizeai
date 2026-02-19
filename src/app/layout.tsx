import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CapitalizeAI — L'Infrastructure Financière Intelligente de l'Afrique",
  description:
    "Moteur d'IA qui transforme les données Mobile Money en score de crédit, agrège les paiements, et redirige l'argent des paris vers l'investissement. Le Ant Financial de l'Afrique.",
  keywords: [
    "credit scoring",
    "AI",
    "fintech",
    "Africa",
    "mobile money",
    "Cameroon",
    "payment aggregation",
    "financial inclusion",
  ],
  openGraph: {
    title: "CapitalizeAI — AI-Powered Financial Infrastructure for Africa",
    description:
      "Transform Mobile Money data into credit scores, unify payments, and redirect betting money into productive capital.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
