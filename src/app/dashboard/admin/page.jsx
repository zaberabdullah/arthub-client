"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import Link from "next/link";
import { authFetch } from "@/lib/api";

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ totalUsers: 0, totalArtists: 0, totalArtworks: 0, totalRevenue: 0 });

  useEffect(() => {
    if (isPending) return;
    if (!session || session.user?.role !== "admin") { 
      router.push("/"); 
      return; 
    }
    fetchQuickStats();
  }, [session, isPending]);

  const fetchQuickStats = async () => {
    try {
    const [usersRes, artworksRes, txRes] = await Promise.all([
  authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`),
  fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks?limit=1`),
  authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/all`),
]);
      
      const users = usersRes.ok ? await usersRes.json() : [];
      const artworksData = artworksRes.ok ? await artworksRes.json() : { total: 0 };
      const transactions = txRes.ok ? await txRes.json() : [];

      setStats({
        totalUsers: users.filter(u => u.role === "user").length,
        totalArtists: users.filter(u => u.role === "artist").length,
        totalArtworks: artworksData.total || 0,
        totalRevenue: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const quickLinks = [
    { href: "/dashboard/admin/users", icon: "👥", label: "Manage Users", desc: `${stats.totalUsers + stats.totalArtists} total`, color: "bg-blue-50 dark:bg-blue-950/30 border-blue-100" },
    { href: "/dashboard/admin/artworks", icon: "🖼", label: "Manage Artworks", desc: `${stats.totalArtworks} artworks`, color: "bg-amber-50 dark:bg-amber-950/30 border-amber-100" },
    { href: "/dashboard/admin/transactions", icon: "💳", label: "Transactions", desc: `$${stats.totalRevenue.toFixed(0)} revenue`, color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100" },
    { href: "/dashboard/admin/analytics", icon: "📊", label: "Analytics", desc: "Charts & insights", color: "bg-violet-50 dark:bg-violet-950/30 border-violet-100" },
  ];

  if (isPending) return <div className="p-6"><div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" /></div>;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Admin Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Welcome back, {session?.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className={`p-6 border ${link.color} hover:scale-105 transition-transform cursor-pointer`}>
              <p className="text-3xl mb-3">{link.icon}</p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{link.label}</p>
              <p className="text-xs text-zinc-500">{link.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
