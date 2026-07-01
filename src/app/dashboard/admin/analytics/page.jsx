"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@heroui/react";
import { authFetch } from "@/lib/api";


import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const PIE_COLORS = ["#7c3aed", "#db2777", "#f97316", "#06b6d4", "#10b981", "#6b7280"];

export default function AdminAnalyticsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState({ totalUsers: 0, totalArtists: 0, totalArtworks: 0, totalSold: 0, totalRevenue: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session || session.user?.role !== "admin") { router.push("/"); return; }
    fetchStats();
  }, [session, isPending]);

  const fetchStats = async () => {
    try {
    const [usersRes, artworksRes, txRes] = await Promise.all([
  authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`),
  fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks?limit=1000`),
  authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/all`),
]);

      const users = usersRes.ok ? await usersRes.json() : [];
      const artworksData = artworksRes.ok ? await artworksRes.json() : { artworks: [] };
      const transactions = txRes.ok ? await txRes.json() : [];

      const allUsers = Array.isArray(users) ? users : [];
      const allArtworks = artworksData.artworks || [];
      const allTx = Array.isArray(transactions) ? transactions : [];

      // Stats
      setStats({
        totalUsers: allUsers.filter(u => u.role === "user").length,
        totalArtists: allUsers.filter(u => u.role === "artist").length,
        totalArtworks: allArtworks.length,
        totalSold: allArtworks.filter(a => a.isSold).length,
        totalRevenue: allTx.filter(t => t.type === "purchase").reduce((sum, t) => sum + (t.amount || 0), 0),
      });

      // Category pie chart data
      const catCount = {};
      allArtworks.forEach(a => {
        catCount[a.category] = (catCount[a.category] || 0) + 1;
      });
      setCategoryData(Object.entries(catCount).map(([name, value]) => ({ name, value })));

      // Sales bar chart — group by month
      const monthCount = {};
      allTx.filter(t => t.type === "purchase").forEach(t => {
        const month = new Date(t.createdAt).toLocaleString("en-US", { month: "short", year: "2-digit" });
        monthCount[month] = (monthCount[month] || 0) + (t.amount || 0);
      });
      setSalesData(Object.entries(monthCount).map(([month, revenue]) => ({ month, revenue })));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Buyers", value: stats.totalUsers, icon: "👤", color: "border-blue-100 bg-blue-50 dark:bg-blue-950/30" },
    { label: "Total Artists", value: stats.totalArtists, icon: "🎨", color: "border-violet-100 bg-violet-50 dark:bg-violet-950/30" },
    { label: "Total Artworks", value: stats.totalArtworks, icon: "🖼️", color: "border-amber-100 bg-amber-50 dark:bg-amber-950/30" },
    { label: "Artworks Sold", value: stats.totalSold, icon: "✅", color: "border-emerald-100 bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Total Revenue", value: `$${stats.totalRevenue}`, icon: "💰", color: "border-rose-100 bg-rose-50 dark:bg-rose-950/30" },
  ];

  if (isPending || loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-72 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="h-72 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Analytics Overview</h1>
        <p className="text-zinc-500 text-sm mt-1">Platform statistics at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className={`p-5 border ${s.color}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{s.value}</p>
              </div>
              <span className="text-2xl">{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Sales Bar Chart */}
        <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Revenue by Month</h2>
          {salesData.length === 0 ? (
            <div className="h-56 flex items-center justify-center">
              <p className="text-zinc-400 text-sm">No sales data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salesData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "13px" }}
                  formatter={(v) => [`$${v}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Category Pie Chart */}
        <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Artworks by Category</h2>
          {categoryData.length === 0 ? (
            <div className="h-56 flex items-center justify-center">
              <p className="text-zinc-400 text-sm">No artworks yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "13px" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: "12px", color: "#64748b" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Quick Summary */}
      <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Quick Summary</h2>
        <div className="space-y-3">
          {[
            { label: "Conversion Rate", value: stats.totalArtworks > 0 ? `${Math.round((stats.totalSold / stats.totalArtworks) * 100)}%` : "0%" },
            { label: "Avg. Revenue per Sale", value: stats.totalSold > 0 ? `$${Math.round(stats.totalRevenue / stats.totalSold)}` : "$0" },
            { label: "Artist to Buyer Ratio", value: stats.totalArtists > 0 ? `1:${Math.round(stats.totalUsers / stats.totalArtists)}` : "—" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.label}</span>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}