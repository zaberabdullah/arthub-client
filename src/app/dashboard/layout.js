"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/auth/login");
      return;
    }
    // Role based redirect
    const role = session.user?.role;
    const path = window.location.pathname;

    if (path === "/dashboard") {
      if (role === "admin") router.push("/dashboard/admin");
      else if (role === "artist") router.push("/dashboard/artist");
      else router.push("/dashboard/user");
    }
  }, [session, isPending]);

  if (isPending) {
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