"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/auth/login");
      return;
    }

    const role = session.user?.role;

    // /dashboard root এ গেলে role based redirect
    if (pathname === "/dashboard") {
      if (role === "admin") router.push("/dashboard/admin");
      else if (role === "artist") router.push("/dashboard/artist");
      else router.push("/dashboard/user");
      return;
    }

    // Wrong role protection
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      router.push("/");
      return;
    }
    if (pathname.startsWith("/dashboard/artist") && role !== "artist" && role !== "admin") {
      router.push("/");
      return;
    }

  }, [session, isPending, pathname]);

  // Loading
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — useEffect এ redirect হবে, এখানে spinner দেখাও
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="w-64 border-r border-rose-100 hidden md:block bg-white shadow-sm">
        <div className="p-6 text-xl font-bold text-rose-600">ArtHub</div>
        <Sidebar />
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}