"use client";

import { Card } from "@heroui/react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="text-6xl">😔</div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-zinc-500">
            Your payment was not completed. No charges were made.
          </p>
        </div>
        <Link
          href="/browse"
          className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors"
        >
          Continue Browsing
        </Link>
      </Card>
    </div>
  );
}
