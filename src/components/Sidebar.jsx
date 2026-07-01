"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard, Palette, PlusCircle, BarChart3,
  ShoppingBag, Image, CreditCard, Users, Settings, Layers, Receipt,
} from "lucide-react";

const menuByRole = {
  user: [
    { label: "Dashboard", href: "/dashboard/user", icon: <LayoutDashboard size={18} /> },
    { label: "My Purchases", href: "/dashboard/user/purchases", icon: <ShoppingBag size={18} /> },
    { label: "My Collection", href: "/dashboard/user/collection", icon: <Image size={18} /> },
    { label: "Subscription", href: "/dashboard/user/subscription", icon: <CreditCard size={18} /> },
    { label: "Profile", href: "/dashboard/user/profile", icon: <Settings size={18} /> },
  ],
  artist: [
    { label: "Dashboard", href: "/dashboard/artist", icon: <LayoutDashboard size={18} /> },
    { label: "Add Artwork", href: "/dashboard/artist/add", icon: <PlusCircle size={18} /> },
    { label: "Sales History", href: "/dashboard/artist/sales", icon: <BarChart3 size={18} /> },
    { label: "Profile", href: "/dashboard/artist/profile", icon: <Settings size={18} /> },
  ],
  admin: [
    { label: "Users", href: "/dashboard/admin", icon: <Users size={18} /> },
    { label: "All Artworks", href: "/dashboard/admin/artworks", icon: <Layers size={18} /> },
    { label: "transactions", href: "/dashboard/admin/transactions", icon: <Receipt size={18} /> },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: <BarChart3 size={18} /> },
  ],
};

export default function Sidebar({ session }) {
  const pathname = usePathname();
  const role = session?.user?.role || "user";
  const menu = menuByRole[role] || menuByRole.user;

  return (
    <div className="h-full bg-white p-4 space-y-1">
      {/* Role badge */}
      <div className="px-4 py-2 mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
          role === "admin" ? "bg-red-100 text-red-600" :
          role === "artist" ? "bg-violet-100 text-violet-600" :
          "bg-zinc-100 text-zinc-600"
        }`}>
          {role}
        </span>
      </div>

      {menu.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
              isActive
                ? "bg-rose-50 text-rose-600 font-bold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className={isActive ? "text-rose-500" : "text-gray-400"}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}