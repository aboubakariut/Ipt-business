import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-jakarta"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter"
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>IPT Business — Le bureau numérique des entrepreneurs africains</title>
        <meta
          name="description"
          content="Gère tes clients, produits, factures, dépenses et ta boutique en ligne depuis ton téléphone."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#FF6B35" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="IPT Business" />
      </Head>
      <div className={`${jakarta.variable} ${inter.variable} font-body bg-surface text-text-primary antialiased`}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
