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
  title: {
    default: "RiellyBooth — Photobooth Online Gratis Tanpa Watermark | Photo Strip & Live Photo",
    template: "%s | RiellyBooth",
  },
  description:
    "Photobooth online gratis langsung dari kamera HP & laptop. Buat photo strip Korea, Live Photo video MP4/GIF, frame estetik, background IG Story, dan foto bareng LDR tanpa watermark. 100% privat di browser.",
  keywords: [
    "photobooth online",
    "photobooth online gratis",
    "photobooth online tanpa watermark",
    "photobooth online di hp",
    "photo strip online",
    "buat photo strip online",
    "photobooth korea online",
    "web photobooth estetik",
    "photobooth ldr online",
    "live photo photobooth",
    "frame photobooth estetik",
    "self photo studio online",
    "cetak photobooth 4r",
    "riellybooth",
    "riellmatics online",
  ],
  authors: [{ name: "RiellyBooth" }],
  creator: "RiellyBooth",
  publisher: "RiellyBooth",
  category: "photography",
  alternates: {
    canonical: "https://riellybooth.my.id",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://riellybooth.my.id",
    siteName: "RiellyBooth",
    title: "RiellyBooth — Photobooth Online Gratis Tanpa Watermark",
    description:
      "Buat photo strip Korea, Live Photo MP4/GIF, frame estetik, dan foto bareng LDR langsung di browser. 100% gratis, privat, tanpa watermark.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "RiellyBooth - Photobooth Online Gratis Tanpa Watermark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RiellyBooth — Photobooth Online Gratis Tanpa Watermark",
    description:
      "Buat photo strip Korea, Live Photo MP4/GIF, dan frame estetik langsung dari HP & laptop. Gratis & privat di browser.",
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
  "@graph": [
    {
      "@type": "WebApplication",
      name: "RiellyBooth",
      alternateName: "RiellyBooth Photobooth Online",
      url: "https://riellybooth.my.id",
      inLanguage: "id-ID",
      description:
        "Photobooth online gratis langsung dari kamera HP & laptop. Buat photo strip estetik, Live Photo video MP4/GIF, dan foto bareng LDR tanpa watermark. 100% privat di browser.",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "All",
      browserRequirements: "Requires WebRTC and HTML5 Canvas",
      screenshot: "https://riellybooth.my.id/opengraph-image",
      featureList: [
        "Live Camera Filter & Mirror Mode",
        "Pilihan 2, 3, 4, dan 6 Pose Photo Strip",
        "Live Photo Boomerang Export MP4 & GIF",
        "Background Estetik 4:5 Feed & 9:16 IG Story",
        "Foto Bareng Jarak Jauh (LDR) Real-Time",
        "100% Privat di Browser Tanpa Watermark",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Apakah foto saya disimpan di server RiellyBooth?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tidak sama sekali. Seluruh pemrosesan photo strip, Live Photo, filter, dan stiker berjalan 100% lokal di browser menggunakan HTML5 Canvas & WebRTC.",
          },
        },
        {
          "@type": "Question",
          name: "Apakah RiellyBooth gratis dan tanpa watermark?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ya, 100% gratis selamanya tanpa watermark untuk unduhan PNG HD, Live Video MP4, maupun GIF animasi.",
          },
        },
        {
          "@type": "Question",
          name: "Bisa dipakai di HP tanpa install aplikasi?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bisa. Cukup buka riellybooth.my.id lewat Chrome atau Safari di HP maupun laptop, izinkan kamera, lalu langsung mulai sesi foto.",
          },
        },
        {
          "@type": "Question",
          name: "Bisa pakai foto dari galeri HP atau foto bareng LDR?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bisa keduanya. Tersedia fitur Upload Galeri dan Foto Bareng LDR real-time untuk sesi photobooth jarak jauh.",
          },
        },
        {
          "@type": "Question",
          name: "Bagaimana cara simpan untuk IG Story atau cetak 4R?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Di halaman editor tersedia pilihan Background Estetik rasio 9:16 Story atau 4:5 Feed serta layout Double Strip 2x4 untuk cetak kertas foto 4R.",
          },
        },
      ],
    },
  ],
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
