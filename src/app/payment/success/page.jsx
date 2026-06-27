"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Spinner } from "@heroui/react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Invalid session");
      setLoading(false);
      return;
    }
    confirmPurchase();
  }, [sessionId]);

  const confirmPurchase = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/confirm-purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId }),
      });

      if (!res.ok) throw new Error("Failed to confirm purchase");

      const data = await res.json();
      setPurchase(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-zinc-500">Confirming your purchase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="text-6xl">❌</div>
          <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
          <p className="text-zinc-500">{error}</p>
          <Link
            href="/browse"
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors"
          >
            Browse Artworks
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="text-6xl">🎉</div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Payment Successful!
          </h1>
          <p className="text-zinc-500">
            Thank you for your purchase
          </p>
        </div>

        {purchase && (
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 space-y-2 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Artwork:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {purchase.artworkTitle}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Artist:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {purchase.artistName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Amount:</span>
              <span className="font-bold text-emerald-600">
                ${purchase.price}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href="/dashboard/user"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            My Purchases
          </Link>
          <Link
            href="/browse"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors"
          >
            Browse More
          </Link>
        </div>
      </Card>
    </div>
  );
}
