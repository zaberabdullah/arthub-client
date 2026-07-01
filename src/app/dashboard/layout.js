"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetch("/api/auth/get-session")
      .then(r => r.json())
      .then(data => {
        setSession(data);
        setIsPending(false);
      })
      .catch(() => setIsPending(false));
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    const role = session.user.role;
    if (pathname === "/dashboard") {
      if (role === "admin") router.push("/dashboard/admin");
      else if (role === "artist") router.push("/dashboard/artist");
      else router.push("/dashboard/user");
    }
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") router.push("/");
    if (pathname.startsWith("/dashboard/artist") && role !== "artist" && role !== "admin") router.push("/");
  }, [session, isPending, pathname]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="w-64 border-r border-rose-100 hidden md:block bg-white shadow-sm">
        <div className="p-6 text-xl font-bold text-rose-600">ArtHub</div>
        <Sidebar session={session} />
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}