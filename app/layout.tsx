import type { Metadata, Viewport } from "next";
import { Fredoka, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F48FB1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://riellybooth.my.id"),
  title: "RiellyBooth ♡ Little Moments, Big Memories · Online Photobooth",
  description:
    "Your own little photo studio. Capture cute moments, create aesthetic photo strips, and keep memories forever. 100% free, private in-browser, no watermark.",
  keywords: [
    "photobooth online gratis",
    "photo strip online",
    "riellybooth",
    "riellmatics online",
    "aesthetic photobooth",
    "korean photobooth online",
    "scrapbook photobooth",
    "virtual photobooth",
    "aesthetic photo strip",
    "live photo photobooth",
    "cetak photobooth 4r",
    "little moments big memories",
  ],
  authors: [{ name: "RiellyBooth" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://riellybooth.my.id",
    siteName: "RiellyBooth",
    title: "RiellyBooth ♡ Little Moments, Big Memories",
    description:
      "Your own little photo studio. Capture cute moments, create aesthetic photo strips, and keep memories forever.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "RiellyBooth - Little Moments, Big Memories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RiellyBooth ♡ Little Moments, Big Memories",
    description:
      "Your own little photo studio. Capture cute moments, create photo strips, and keep memories forever.",
    images: ["/opengraph-image"],
    creator: "@riellybooth_",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "256x256" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "RiellyBooth",
  url: "https://riellybooth.my.id",
  description:
    "Your own little photo studio. Capture cute moments, create aesthetic photo strips, and keep memories forever. 100% in-browser, private, and free.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "All",
  browserRequirements: "Requires WebRTC and HTML5 Canvas",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IDR",
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
        <link rel="apple-touch-icon" href="/icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${fredoka.variable} ${dmSans.variable} ${caveat.variable} font-sans antialiased bg-[#FFF0F4] text-[#392633] selection:bg-[#F48FB1] selection:text-[#392633]`}
      >
        {children}
      </body>
    </html>
  );
}
