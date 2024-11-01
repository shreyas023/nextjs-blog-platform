import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import Navbar
import Footer from "@/components/Footer"; // Import Footer
import TokenExpirationHandler from "@/components/TokenExpirationHandler";

// Import local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for SEO
export const metadata = {
  title: "InspiraAI - AI-powered Blog Platform",
  description: "A platform where you can explore AI-powered content creation, SEO, and image generation.",
  keywords: ["AI blog", "SEO", "Image generation", "Next.js", "Tailwind CSS"],
  author: "InspiraAI Team",
  openGraph: {
    type: "website",
    title: "InspiraAI - AI-powered Blog Platform",
    description: "Explore AI-driven content and tools with InspiraAI.",
    url: "https://inspiraai.com",
    images: [
      {
        url: "/og-image.jpg", // replace with actual path
        width: 800,
        height: 600,
        alt: "InspiraAI",
      },
    ],
  },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Navbar /> {/* Navbar Component */}
        <main className="min-h-screen">{children}</main>
        <Footer /> {/* Footer Component */}
      </body>
    </html>
  );
}
