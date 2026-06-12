"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">Pinterest Pro</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition">
              定价
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition">
              关于
            </Link>
            {token ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition">
                  仪表板
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                >
                  退出
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                  登录
                </Link>
                <Link
                  href="/auth"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition"
                >
                  开始免费
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/pricing" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              定价
            </Link>
            <Link href="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              关于
            </Link>
            {token ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                  仪表板
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                  退出
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                  登录
                </Link>
                <Link href="/auth" className="block px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
                  开始免费
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
