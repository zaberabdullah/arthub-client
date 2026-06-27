"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, Chip, Button } from "@heroui/react";

export default function AdminUsersPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!session || session.user?.role !== "admin") { 
      router.push("/"); 
      return; 
    }
    fetchUsers();
  }, [session, isPending]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    setError(""); 
    setSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      setSuccess("Role updated successfully");
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleColor = (role) => {
    if (role === "admin") return "danger";
    if (role === "artist") return "secondary";
    return "default";
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (isPending || loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Manage Users</h1>
        <p className="text-zinc-500 text-sm mt-1">{users.length} total users</p>
      </div>

      {error && <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 text-red-700 border border-red-200 mb-5">{error}</div>}
      {success && <div className="p-3.5 text-xs font-medium rounded-xl bg-emerald-100/60 text-emerald-800 border border-emerald-200 mb-5">{success}</div>}

      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35"/></svg>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm outline-none focus:border-violet-500 transition-colors" 
        />
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Current Role</th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-zinc-400">No users found</td></tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user._id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-zinc-900 dark:text-zinc-100">{user.name || "—"}</td>
                    <td className="px-5 py-4 text-zinc-500">{user.email}</td>
                    <td className="px-5 py-4">
                      <Chip size="sm" color={getRoleColor(user.role)} variant="flat" className="capitalize">
                        {user.role}
                      </Chip>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={updatingId === user._id || user._id === session?.user?.id}
                        className="w-32 px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="user">User</option>
                        <option value="artist">Artist</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
