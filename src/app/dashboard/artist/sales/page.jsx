"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@heroui/react";
import { authFetch } from "@/lib/api";

export default function SalesHistoryPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/auth/login");
      return;
    }
    authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/my-sales`)
      .then((r) => r.json())
      .then((d) => setSales(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, isPending]);

  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);

  if (loading)
    return (
      <div className="p-6 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-zinc-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Sales History</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {sales.length} sales · Total earned: <span className="text-violet-600 font-semibold">${totalRevenue}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-5 border border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 mb-1">Total Sales</p>
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{sales.length}</p>
        </Card>
        <Card className="p-5 border border-violet-100 bg-violet-50 dark:bg-violet-950/30 dark:border-violet-900">
          <p className="text-xs text-violet-400 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-violet-700 dark:text-violet-300">${totalRevenue}</p>
        </Card>
      </div>

      {sales.length === 0 ? (
        <Card className="p-12 text-center border border-zinc-200 dark:border-zinc-800">
          <p className="text-4xl mb-3">💰</p>
          <p className="text-zinc-600 font-medium mb-2">No sales yet</p>
          <p className="text-zinc-400 text-sm">Keep uploading great artworks!</p>
        </Card>
      ) : (
        <Card className="border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Artwork</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Buyer</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Amount</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s._id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-5 py-4 font-medium text-zinc-900 dark:text-zinc-100">{s.artworkTitle || "—"}</td>
                    <td className="px-5 py-4 text-zinc-500">{s.buyerName || "—"}</td>
                    <td className="px-5 py-4 font-semibold text-violet-600">${s.amount || 0}</td>
                    <td className="px-5 py-4 text-zinc-500">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}