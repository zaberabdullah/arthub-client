"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { useSession, signOut } from "@/lib/auth-client"; // ← Add kor


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession(); // ← Real session
  const user = session?.user;
  const router = useRouter();


    const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login"); // Logout er por login page e pathaw
          router.refresh(); // Page refresh kore session clear kor
        },
      },
    });
  };

  
  const isLoggedIn = !!user; // ← Eita auto hobe
  const userRole = user?.role || "collector";
  const userName = user?.name || "";

  const isActive = (href) => pathname === href;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Artworks", href: "/artworks" },
  ];

  const dashboardLinks = {
    artist: [
      { label: "My Artworks", href: "/dashboard/my-artworks" },
      { label: "Upload Art", href: "/dashboard/upload" },
      { label: "Earnings", href: "/dashboard/earnings" },
    ],
    collector: [
      { label: "My Purchases", href: "/dashboard/purchases" },
      { label: "Wishlist", href: "/dashboard/wishlist" },
    ],
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-rose-100 bg-gradient-to-r from-rose-50/80 via-white/80 to-amber-50/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 opacity-80 blur-sm" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-fuchsia-500 to-indigo-500 shadow-lg">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
              ArtHub
            </h1>
            <p className="text-xs text-gray-500">Create • Collect • Inspire</p>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* Desktop Menu */}
          <div className="hidden items-center gap-2 md:flex">
            <ul className="flex items-center gap-1 rounded-full border border-rose-100 bg-white/60 px-2 py-2 shadow-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive(link.href)
                     ? "bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white shadow-md"
                        : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              
              {isLoggedIn && (
                <li className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                      pathname.startsWith("/dashboard")
                     ? "bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white shadow-md"
                        : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                    }`}
                  >
                    Dashboard
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-rose-100 bg-white py-2 shadow-xl">
                      <div className="border-b border-rose-50 px-4 py-2">
                        <p className="text-xs font-semibold text-rose-600">
                          {userRole === "artist"? "ARTIST DASHBOARD" : "COLLECTOR DASHBOARD"}
                        </p>
                      </div>
                      {dashboardLinks[userRole].map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              )}
            </ul>

            <div className="h-8 w-px bg-gradient-to-b from-transparent via-rose-200 to-transparent" />

            <div className="flex items-center gap-3">
              {isLoggedIn? (
                <>
                  <div className="flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-500 text-sm font-bold text-white">
                      {userName[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{userName}</span>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    size="sm" 
                    variant="flat" 
                    className="bg-rose-100 text-rose-600 hover:bg-rose-200"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm font-medium text-gray-700 transition hover:text-rose-600">
                    Login
                  </Link>
                  <Button 
                    as={Link} 
                    href="/auth/register" 
                    size="sm"
                    className="bg-gradient-to-r from-rose-500 to-fuchsia-500 font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center rounded-xl p-2 text-rose-600 transition hover:bg-rose-50 md:hidden"
            aria-label="Toggle Menu"
          >
            {isMenuOpen? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="border-t border-rose-100 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="space-y-2 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-4 py-3 text-base font-medium transition ${
                  isActive(link.href)
                 ? "bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-rose-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {isLoggedIn && (
              <>
                <div className="border-t border-rose-100 pt-3" />
                <p className="px-4 py-1 text-xs font-semibold text-rose-600">DASHBOARD</p>
                {dashboardLinks[userRole].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-rose-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}

            <div className="border-t border-rose-100 pt-4">
              {isLoggedIn? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-rose-50 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-500 text-white font-bold">
                      {userName[0]}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{userName}</p>
                  </div>
                  <Button
                    onClick={() => {
                      console.log("Logout");
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-rose-100 text-rose-600 hover:bg-rose-200"
                    variant="flat"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button 
                    as={Link} 
                    href="/login" 
                    variant="flat" 
                    className="w-full bg-rose-50 text-rose-600" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Button>
                  <Button 
                    as={Link} 
                    href="/register" 
                    className="w-full bg-gradient-to-r from-rose-500 to-fuchsia-500 font-semibold text-white" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}