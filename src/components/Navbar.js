"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if the user is logged in by verifying the token presence
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set true if token exists, false otherwise
  }, []);

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <span className="text-blue-400">Inspira</span>AI
        </div>
        <nav className="flex space-x-4">
          <Link href="/" className="hover:text-blue-400">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-400">
            About
          </Link>
          <Link href="/seo" className="hover:text-blue-400">
            SEO Keywords
          </Link>
          <Link href="/image-generator" className="hover:text-blue-400">
            Image Generator
          </Link>
        </nav>

        {/* Conditional Rendering: Show either Login/Register or Profile Icon */}
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <>
              {/* Profile Icon and Logout Button */}
              <Link href="/profile">
                <Image
                  src="/profile-icon.png" // Replace with a valid profile icon
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </Link>
            </>
          ) : (
            <>
              {/* Login and Register Buttons */}
              <Link href="/login" className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-800">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-800">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
