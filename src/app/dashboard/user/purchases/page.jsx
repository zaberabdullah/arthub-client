"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@heroui/react";
import Link from "next/link";

export default function PurchaseHistoryPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session) { router.push("/auth/login"); return; }
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/my-purchases`, { credentials: "include" })
      .then(r => r.json()).then(d => setPurchases(Array.isArray(d) ? d : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, [session, isPending]);

  if (loading) return <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-zinc-100 rounded-xl animate-pulse" />)}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Purchase History</h1>
        <p className="text-zinc-500 text-sm mt-1">{purchases.length} total purchases</p>
      </div>

      {purchases.length === 0 ? (
        <Card className="p-12 text-center border border-zinc-200 dark:border-zinc-800">
          <p className="text-4xl mb-3">🛍️</p>
          <p className="text-zinc-600 font-medium mb-2">No purchases yet</p>
          <Link href="/artworks" className="text-violet-600 text-sm hover:underline">Browse Artworks →</Link>
        </Card>
      ) : (
        <Card className="border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Artwork</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Artist</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Price</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p._id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-5 py-4">
                      <Link href={`/artworks/${p.artworkId}`} className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-violet-600">
                        {p.artworkTitle || "—"}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-zinc-500">{p.artistName || "—"}</td>
                    <td className="px-5 py-4 font-semibold text-violet-600">${p.amount || 0}</td>
                    <td className="px-5 py-4 text-zinc-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}</td>
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