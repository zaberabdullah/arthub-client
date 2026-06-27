"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import UserMenu from "@/components/UserMenu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      { label: "Dashboard", href: "/dashboard/user" },
      { label: "My Purchases", href: "/dashboard/user/purchases" },
      { label: "My Collection", href: "/dashboard/user/collection" },
      { label: "Subscription", href: "/dashboard/user/subscription" },
      { label: "Profile", href: "/dashboard/user/profile" },
    ],
    artist: [
      { label: "Dashboard", href: "/dashboard/artist" },
      { label: "Add Artwork", href: "/dashboard/artist/add" },
      { label: "Sales History", href: "/dashboard/artist/sales" },
      { label: "Profile", href: "/dashboard/artist/profile" },
    ],
    admin: [
      { label: "Users", href: "/dashboard/admin" },
      { label: "All Artworks", href: "/dashboard/admin/artworks" },
      { label: "transactions", href: "/dashboard/admin/transactions" },
      { label: "Analytics", href: "/dashboard/admin/analytics" },
    ],
  };

  const currentDashboardLinks = dashboardLinks[userRole] || dashboardLinks.user;

  return (
    <nav className="sticky top-0 z-50 border-b border-violet-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            ArtHub
          </h1>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href ? "text-violet-600" : "text-gray-600 hover:text-violet-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* DESKTOP RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="light" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <Button isIconOnly variant="light" onPress={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </Button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden p-4 bg-white border-t border-violet-100 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-3 rounded-lg font-medium ${
                pathname === link.href ? "bg-violet-50 text-violet-600" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn && (
            <>
              <div className="h-px bg-gray-200 my-2" />
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase">Dashboard</p>
              {currentDashboardLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg ${
                    pathname === link.href ? "bg-violet-50 text-violet-600" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-gray-200 my-2" />
              <Button onPress={handleLogout} color="danger" variant="flat" className="w-full">
                Logout
              </Button>
            </>
          )}

          {!isLoggedIn && (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/auth/login" className="w-full">
                <Button variant="bordered" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full">
                <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
