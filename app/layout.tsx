import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://riellybooth.my.id"),
  title: "riellybooth ♡ Photobooth Online Gratis & Aesthetic Photo Strip",
  description: "Bikin photo strip aesthetic langsung dari browser gratis tanpa watermark! Tersedia 16+ frame viral Gen Z (Photomatics News, Halloween Spooky, Coquette, Y2K), filter retro, dan Live Photo boomerang MP4.",
  keywords: [
    "photobooth online gratis",
    "photo strip online",
    "photomatics online",
    "photobox online",
    "riellybooth",
    "virtual photobooth",
    "aesthetic photo strip",
    "live photo photobooth",
    "cetak photobooth 4r",
    "photobooth peace pose"
  ],
  authors: [{ name: "riellybooth" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://riellybooth.my.id",
    siteName: "riellybooth",
    title: "riellybooth ♡ Photobooth Online Gratis & Aesthetic Photo Strip",
    description: "Bikin photo strip aesthetic langsung dari browser gratis tanpa watermark! Pose peace ✌️ kamera jepret otomatis. Tersedia bingkai Photomatics News, Halloween, dan Live Photo video.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "riellybooth aesthetic photobooth online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "riellybooth ♡ Photobooth Online Gratis & Aesthetic Photo Strip",
    description: "Bikin photo strip aesthetic langsung dari browser gratis tanpa watermark! Pose peace ✌️ kamera otomatis jepret.",
    images: ["/opengraph-image"],
    creator: "@riellybooth_",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "riellybooth",
  url: "https://riellybooth.my.id",
  description:
    "Virtual Photobooth Online Gratis bergaya Korea & Y2K Aesthetic. Bikin photo strip dan live photo boomerang MP4 tanpa watermark.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All",
  browserRequirements: "Requires WebRTC and HTML5 Canvas",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IDR",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "158400",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased bg-rose-50/50 text-slate-800`}>
        {children}
      </body>
    </html>
  );
}