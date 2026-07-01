"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, Button } from "@heroui/react";
import Link from "next/link";
import { authFetch } from "@/lib/api";

export default function AdminArtworksPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!session || session.user?.role !== "admin") { router.push("/"); return; }
    fetchArtworks();
  }, [session, isPending]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks?limit=100`, {
        credentials: "include",
      });
      const data = await res.json();
      setArtworks(data.artworks || []);
    } catch {
      setError("Failed to load artworks.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this artwork permanently?")) return;
    setDeletingId(id);
    setError(""); setSuccess("");
    try {
    const res = await authFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks/${id}`, {
  method: "DELETE",
});
      if (!res.ok) throw new Error("Delete failed.");
      setSuccess("Artwork deleted.");
      setArtworks((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = artworks.filter(
    (a) =>
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.artistName?.toLowerCase().includes(search.toLowerCase())
  );

  if (isPending || loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">All Artworks</h1>
        <p className="text-zinc-500 text-sm mt-1">{artworks.length} total artworks</p>
      </div>

      {error && <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 text-red-700 border border-red-200 mb-5"><span className="font-semibold">Error:</span> {error}</div>}
      {success && <div className="p-3.5 text-xs font-medium rounded-xl bg-emerald-100/60 text-emerald-800 border border-emerald-200 mb-5"><span className="font-semibold">Success:</span> {success}</div>}

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" placeholder="Search by title or artist..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm outline-none focus:border-violet-500 transition-colors" />
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Artwork</th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Artist</th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Category</th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Price</th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-zinc-500 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-zinc-400">No artworks found</td></tr>
              ) : (
                filtered.map((artwork) => (
                  <tr key={artwork._id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    {/* Image + Title */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={artwork.imageUrl} alt={artwork.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[150px]">{artwork.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-500">{artwork.artistName}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full">{artwork.category}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-violet-600">${artwork.price}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${artwork.isSold ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"}`}>
                        {artwork.isSold ? "Sold" : "Available"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/artworks/${artwork._id}`}>
                          <Button size="sm" variant="flat" className="text-xs rounded-lg">View</Button>
                        </Link>
                        <Button
                          size="sm" color="danger" variant="flat" className="text-xs rounded-lg"
                          onPress={() => handleDelete(artwork._id)}
                          isLoading={deletingId === artwork._id}
                        >
                          Delete
                        </Button>
                      </div>
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