import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
          © 2024 InspiraAI. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <Link href="#" className="hover:text-blue-400">Privacy Policy
          </Link>
          <Link href="#" className="hover:text-blue-400">Terms of Service
          </Link>
          <Link href="mailto:support@inspiraai.com" className="hover:text-blue-400">support@inspiraai.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
