"use client";

import { useEffect, useState } from "react";
import { Card, Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ArtistDashboard() {
  const [session, setSession] = useState(null);
const [isPending, setIsPending] = useState(true);
  const router = useRouter();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    if (session) fetchMyArtworks();
  }, [session]);

  const fetchMyArtworks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks/my/list`, { credentials: "include" });
      if (res.ok) setArtworks(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this artwork?")) return;
    setDeletingId(id);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks/${id}`, {
        method: "DELETE",
        credentials: "include",
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

  if (isPending || loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden animate-pulse"
            >
              <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">My Artworks</h1>
          <p className="text-zinc-500 text-sm mt-1">Welcome, {session?.user?.name}</p>
        </div>
        <Link href="/dashboard/artist/add">
          <Button color="primary" className="font-semibold rounded-xl">
            + Add New Artwork
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 text-red-700 border border-red-200 mb-5">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}
      {success && (
        <div className="p-3.5 text-xs font-medium rounded-xl bg-emerald-100/60 text-emerald-800 border border-emerald-200 mb-5">
          <span className="font-semibold">Success:</span> {success}
        </div>
      )}

      {/* Empty state */}
      {artworks.length === 0 ? (
        <Card className="p-12 text-center border border-zinc-200 dark:border-zinc-800">
          <p className="text-4xl mb-3">🎨</p>
          <p className="text-zinc-700 dark:text-zinc-300 font-medium">No artworks yet</p>
          <p className="text-zinc-400 text-sm mt-1 mb-4">Start by uploading your first artwork</p>
          <Link href="/dashboard/artist/add">
            <Button color="primary" variant="flat" className="rounded-xl">
              Upload Artwork
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {artworks.map((art) => (
            <div
              key={art._id}
              className="group rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 hover:shadow-lg transition-all"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {art.isSold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">SOLD</span>
                  </div>
                )}
                <span className="absolute top-3 right-3 text-xs font-medium bg-white/90 dark:bg-zinc-900/90 text-zinc-600 px-2 py-1 rounded-full">
                  {art.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{art.title}</h3>
                <p className="text-zinc-500 text-xs mt-0.5 line-clamp-2">{art.description}</p>
                <p className="text-violet-600 font-bold text-lg mt-2">${art.price}</p>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <Link href={`/dashboard/artist/edit/${art._id}`} className="flex-1">
                    <Button size="sm" variant="flat" color="primary" className="w-full rounded-lg text-xs font-medium">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    className="flex-1 rounded-lg text-xs font-medium"
                    onPress={() => handleDelete(art._id)}
                    isLoading={deletingId === art._id}
                  >
                    Delete
                  </Button>
                  <Link href={`/artworks/${art._id}`}>
                    <Button size="sm" variant="bordered" className="rounded-lg text-xs">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
