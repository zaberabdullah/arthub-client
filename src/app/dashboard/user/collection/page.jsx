"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { authFetch } from "@/lib/api";

export default function MyCollectionPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/my-purchases`)
      .then((r) => r.json())
      .then((d) => setPurchases(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, isPending]);

  if (loading)
    return (
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-52 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">My Collection</h1>
        <p className="text-zinc-500 text-sm mt-1">{purchases.length} artworks collected</p>
      </div>

      {purchases.length === 0 ? (
        <Card className="p-12 text-center border border-zinc-200 dark:border-zinc-800">
          <p className="text-4xl mb-3">🖼</p>
          <p className="text-zinc-600 font-medium mb-2">Your collection is empty</p>
          <Link href="/artworks" className="text-violet-600 text-sm hover:underline">
            Start collecting →
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {purchases.map((p) => (
            <Link key={p._id} href={`/artworks/${p.artworkId}`}>
              <div className="group rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-all bg-white dark:bg-zinc-900">
                <div className="relative h-48 overflow-hidden bg-zinc-100">
                  {p.artworkImage ? (
                    <Image
                      src={p.artworkImage}
                      alt={p.artworkTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm truncate">
                    {p.artworkTitle || "Artwork"}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-0.5">by {p.artistName || "—"}</p>
                  <p className="text-violet-600 font-bold text-sm mt-2">${p.price?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
