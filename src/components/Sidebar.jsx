"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Palette, PlusCircle, BarChart3 } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const menu = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "My Artworks", href: "/dashboard/my-artworks", icon: <Palette size={20} /> },
    { label: "Add Artwork", href: "/dashboard/add", icon: <PlusCircle size={20} /> },
    { label: "Sales History", href: "/dashboard/sales", icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="h-full bg-white p-4 space-y-2">
      {menu.map((item) => (
        <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${pathname === item.href ? "bg-rose-50 text-rose-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
          {item.icon}
          {item.label}
        </Link>
      ))}
    </div>
  );
}