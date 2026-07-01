"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";

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

export default function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const user = session?.user;
  const role = user?.role || "user";
  const links = dashboardLinks[role] || dashboardLinks.user;


  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer"
      >
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{role}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-violet-200 flex-shrink-0">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-14 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-[9999] py-2 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-sm text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>

          {/* Links */}
          <div className="py-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  pathname === link.href ? "text-violet-600 bg-violet-50 font-medium" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
