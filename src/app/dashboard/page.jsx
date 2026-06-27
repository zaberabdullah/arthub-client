"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function UserDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/purchases");
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards - Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-xl border border-zinc-200">
          <p className="text-sm text-zinc-500 mb-1">Total Purchases</p>
          <p className="text-3xl font-bold">{stats?.totalPurchases || 0}</p>
        </div>

        <div className="p-6 bg-violet-50 rounded-xl border border-violet-200">
          <p className="text-sm text-violet-600 mb-1">Current Plan</p>
          <p className="text-3xl font-bold text-violet-600 capitalize">
            {stats?.currentPlan || "Free"}
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-zinc-200">
          <p className="text-sm text-zinc-500 mb-1">Purchases Left</p>
          <p className="text-3xl font-bold">{stats?.purchasesLeft || 0}</p>
        </div>
      </div>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Free", price: "$0", limit: "3 purchases" },
            { name: "Pro", price: "$9.99/mo", limit: "9 purchases" },
            { name: "Premium", price: "$19.99/mo", limit: "Unlimited" },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-xl border-2 ${
                stats?.currentPlan === plan.name.toLowerCase()
                ? "border-violet-600 bg-violet-50"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {stats?.currentPlan === plan.name.toLowerCase() && (
                  <span className="text-xs bg-violet-600 text-white px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-violet-600 mb-1">{plan.price}</p>
              <p className="text-sm text-zinc-500">{plan.limit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
