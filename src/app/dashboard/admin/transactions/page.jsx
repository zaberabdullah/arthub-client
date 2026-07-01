"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, Chip } from "@heroui/react";
import { authFetch } from "@/lib/api";

export default function AdminTransactionsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!session || session.user?.role !== "admin") { router.push("/"); return; }
    fetchTransactions();
  }, [session, isPending]);

  const fetchTransactions = async () => {
    try {
     const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/all`);
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  if (isPending || loading) {
    return <div className="p-6 space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />)}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">All Transactions</h1>
        <p className="text-zinc-500 text-sm mt-1">{transactions.length} transactions · Total revenue: <span className="text-violet-600 font-semibold">${totalRevenue.toFixed(2)}</span></p>
      </div>

      {error && <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 text-red-700 border border-red-200 mb-5">{error}</div>}

      {transactions.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">💳</p>
          <p className="text-zinc-400">No transactions yet</p>
        </div>
      ) : (
        <Card className="border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Transaction ID</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">User Email</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Artist Email</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Amount</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">{t._id.slice(-8)}</td>
                    <td className="px-5 py-4">
                      <Chip size="sm" color={t.type === "purchase" ? "primary" : "warning"} variant="flat" className="capitalize">
                        {t.type}
                      </Chip>
                    </td>
                    <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{t.buyerEmail || t.buyerId || "—"}</td>
                    <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{t.artistEmail || "—"}</td>
                    <td className="px-5 py-4 font-semibold text-violet-600">${(t.amount || 0).toFixed(2)}</td>
                    <td className="px-5 py-4 text-zinc-500">{t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}</td>
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
