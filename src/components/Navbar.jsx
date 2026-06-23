"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const isLoggedIn = !!user;
  const userRole = user?.role || "user";

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
          router.refresh();
        },
      },
    });
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Artworks", href: "/artworks" },
  ];

  const dashboardLinks = {
    user: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Purchases", href: "/dashboard/user/purchases" },
    ],
    artist: [
      { label: "Dashboard", href: "/dashboard/artist" },
      { label: "Add Artwork", href: "/dashboard/artist/add" },
    ],
    admin: [
      { label: "Dashboard", href: "/dashboard/admin" },
      { label: "Manage Users", href: "/dashboard/admin/users" },
    ],
  };

  const currentDashboardLinks = dashboardLinks[userRole] || dashboardLinks.user;

  return (
    <nav className="sticky top-0 z-50 border-b border-rose-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">
            ArtHub
          </h1>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`text-sm font-medium transition-colors ${pathname === link.href ? "text-rose-600" : "text-gray-600 hover:text-rose-600"}`}>
              {link.label}
            </Link>
          ))}

          {isLoggedIn && (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors"
              >
                Dashboard
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-rose-100 rounded-2xl shadow-xl py-2 z-50">
                  {currentDashboardLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Button onPress={handleLogout} variant="flat" color="danger" size="sm" className="rounded-full px-6">Logout</Button>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-rose-600 rounded-full transition-colors">
                Login
              </Link>
              <Link href="/auth/register" className="bg-gradient-to-r from-rose-500 to-indigo-600 text-white px-6 py-2 text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-all">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <Button isIconOnly variant="light" onPress={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </Button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden p-4 bg-white border-t border-rose-100 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-700 font-medium" onClick={() => setIsMenuOpen(false)}>{link.label}</Link>
          ))}
          {isLoggedIn && currentDashboardLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-rose-600 font-medium" onClick={() => setIsMenuOpen(false)}>{link.label}</Link>
          ))}
          
          <div className="flex flex-col gap-2 pt-2">
            {isLoggedIn ? (
              <Button onPress={handleLogout} color="danger" variant="flat" className="w-full">Logout</Button>
            ) : (
              <>
                <Link href="/auth/login" className="w-full text-center py-3 border border-gray-200 rounded-xl font-medium">Login</Link>
                <Link href="/auth/register" className="w-full text-center py-3 bg-rose-500 text-white rounded-xl font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}