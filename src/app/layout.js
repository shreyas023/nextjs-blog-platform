import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import Navbar
import Footer from "@/components/Footer"; // Import Footer
import TokenExpirationHandler from "@/components/TokenExpirationHandler";


// Metadata for SEO
export const metadata = {
  title: "InspiraAI - AI-powered Blog Platform",
  description: "A platform where you can explore AI-powered content creation, SEO, and image generation.",
  keywords: ["AI blog", "SEO", "Image generation", "Next.js", "Tailwind CSS", "AI-powered platform", "Content creation"],
  author: "InspiraAI Team",
  openGraph: {
    type: "website",
    title: "InspiraAI - AI-powered Blog Platform",
    description: "Explore AI-driven content and tools with InspiraAI.",
    url: "https://inspiraai.com",
    images: [
      {
        url: "https://inspiraai.com/og-image.jpg", // Replace with actual hosted image URL
        width: 800,
        height: 600,
        alt: "InspiraAI",
      },
    ],
    site_name: "InspiraAI",
    locale: "en_US", // or relevant locale
  },
  twitter: {
    card: "summary_large_image",
    site: "@inspiraai", // Replace with the actual Twitter handle
    title: "InspiraAI - AI-powered Blog Platform",
    description: "Explore AI-driven content and tools with InspiraAI.",
    image: "https://inspiraai.com/og-image.jpg", // Replace with actual hosted image URL
  },
  robots: "index, follow",
};


// Add viewport separately as per Next.js new API
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// Root layout with Navbar and Footer included
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body
        className={`font-sans antialiased subpixel-antialiased bg-gray-50`}
      >
        <TokenExpirationHandler />
        <Navbar /> {/* Navbar Component */}
        <main className="min-h-screen">{children}</main>
        <Footer /> {/* Footer Component */}
      </body>
    </html>
  );
}
