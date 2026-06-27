"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, Button } from "@heroui/react";
import Link from "next/link";

const TIERS = [
  { name: "Free", price: "$0", limit: "3 purchases", tier: "free", color: "bg-zinc-100 text-zinc-600 border-zinc-200" },
  {
    name: "Pro",
    price: "$9.99/mo",
    limit: "9 purchases",
    tier: "pro",
    color: "bg-violet-100 text-violet-700 border-violet-200",
  },
  {
    name: "Premium",
    price: "$19.99/mo",
    limit: "Unlimited",
    tier: "premium",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
];

export default function UserDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/auth/login");
      return;
    }
    fetchPurchases();
  }, [session, isPending]);

  const fetchPurchases = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/my-purchases`, {
        credentials: "include",
      });
      if (res.ok) setPurchases(await res.json());
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const user = session?.user;
  const tier = user?.subscriptionTier || "free";
  const purchaseCount = user?.purchaseCount || purchases.length;
  const limits = { free: 3, pro: 9, premium: "∞" };
  const currentLimit = limits[tier];

  if (isPending || loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-zinc-500 text-sm mt-1">{user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-5 border border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 mb-1">Total Purchases</p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{purchases.length}</p>
        </Card>
        <Card className="p-5 border border-violet-100 dark:border-violet-900 bg-violet-50 dark:bg-violet-950/30">
          <p className="text-xs text-violet-400 mb-1">Current Plan</p>
          <p className="text-2xl font-bold text-violet-700 dark:text-violet-300 capitalize">{tier}</p>
        </Card>
        <Card className="p-5 border border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 mb-1">Purchases Left</p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {tier === "premium"
              ? "∞"
              : Math.max(0, (typeof currentLimit === "number" ? currentLimit : 0) - purchaseCount)}
          </p>
        </Card>
      </div>

      {/* Subscription tiers */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((t) => (
            <Card
              key={t.tier}
              className={`p-5 border-2 ${tier === t.tier ? "border-violet-500" : "border-zinc-100 dark:border-zinc-800"} relative`}
            >
              {tier === t.tier && (
                <span className="absolute top-3 right-3 text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">{t.name}</h3>
              <p className="text-2xl font-bold text-violet-600 mt-1">{t.price}</p>
              <p className="text-zinc-500 text-sm mt-1">{t.limit}</p>
              {tier !== t.tier && t.tier !== "free" && (
                <Button
                  color="primary"
                  size="sm"
                  className="w-full mt-4 rounded-xl font-semibold"
                  onPress={() => alert("Subscription coming soon!")}
                >
                  Upgrade
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Recent purchases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Recent Purchases</h2>
          <Link href="/dashboard/user/purchases" className="text-sm text-violet-600 hover:underline">
            View all →
          </Link>
        </div>

        {purchases.length === 0 ? (
          <Card className="p-10 text-center border border-zinc-200 dark:border-zinc-800">
            <p className="text-3xl mb-2">🛍</p>
            <p className="text-zinc-500 text-sm">No purchases yet</p>
            <Link href="/artworks">
              <Button color="primary" size="sm" className="mt-4 rounded-xl">
                Browse Artworks
              </Button>
            </Link>
          </Card>
        ) : (
          <Card className="border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                    <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Artwork</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Artist</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Amount</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.slice(0, 5).map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    >
                      <td className="px-5 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                        {p.artworkTitle || "—"}
                      </td>
                      <td className="px-5 py-4 text-zinc-500">{p.artistName || "—"}</td>
                      <td className="px-5 py-4 font-semibold text-violet-600">${p.price?.toFixed(2) || '0.00'}</td>
                      <td className="px-5 py-4 text-zinc-500">
                        {p.purchaseDate
                          ? new Date(p.purchaseDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
