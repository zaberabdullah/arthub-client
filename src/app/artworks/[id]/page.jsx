"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, Button } from "@heroui/react";
import Link from "next/link";

export default function ArtworkDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [canComment, setCanComment] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = session?.user;
  const isOwner = user?.id === artwork?.artistId;
  const isLoggedIn =!!user;
  const isSold = artwork?.isSold || artwork?.status === "sold";

  useEffect(() => {
    fetchArtwork();
    fetchComments();
  }, [id]);

  // ✅ User login korle ba artwork load hoile check koro
  useEffect(() => {
    if (session && artwork) {
      checkCanComment();
    }
  }, [session, artwork]);

  const fetchArtwork = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setArtwork(data);
    } catch {
      router.push("/artworks");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments/${id}`);
      if (res.ok) setComments(await res.json());
    } catch {}
  };

  const checkCanComment = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/check/${id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setCanComment(data.hasPurchased);
      }
    } catch (err) {
      console.error("Check comment error:", err);
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    if (isSold || isOwner) return;
    setBuying(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ artworkId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Purchase failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    } finally {
      setBuying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/dashboard/artist");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    setPostingComment(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          artworkId: id, 
          comment: comment
        }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      setSuccess("Comment posted!");
      setComment("");
      fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="w-full h-96 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 animate-pulse" />
            <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {error && (
          <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 text-red-700 border border-red-200 mb-6">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}
        {success && (
          <div className="p-3.5 text-xs font-medium rounded-xl bg-emerald-100/60 text-emerald-800 border border-emerald-200 mb-6">
            <span className="font-semibold">Success:</span> {success}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div className="relative">
            <img src={artwork.imageUrl} alt={artwork.title} className="w-full rounded-2xl shadow-xl object-cover" />
            {isSold && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow">
                SOLD
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{artwork.title}</h1>
                <span className="flex-shrink-0 text-xs font-medium bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full">
                  {artwork.category}
                </span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400">
                by <span className="font-semibold text-zinc-700 dark:text-zinc-300">{artwork.artistName}</span>
              </p>
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">{artwork.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400 mb-1">Price</p>
                <p className="text-3xl font-bold text-violet-600">${artwork.price}</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400 mb-1">Posted</p>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {new Date(artwork.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

            {isOwner? (
              <div className="flex gap-3">
                <Link href={`/dashboard/artist/edit/${id}`} className="flex-1">
                  <Button color="primary" variant="flat" className="w-full font-semibold rounded-xl" size="lg">
                    Edit Artwork
                  </Button>
                </Link>
                <Button
                  color="danger"
                  variant="flat"
                  className="flex-1 font-semibold rounded-xl"
                  size="lg"
                  onPress={handleDelete}
                  isLoading={deleting}
                >
                  Delete
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  color="primary"
                  size="lg"
                  className="w-full font-semibold rounded-xl"
                  isDisabled={isSold ||!isLoggedIn}
                  isLoading={buying}
                  onPress={handleBuyNow}
                >
                  {isSold? "Sold Out" : "Buy Now"}
                </Button>
                {!isLoggedIn && (
                  <p className="text-sm text-zinc-500 text-center">
                    <Link href="/auth/login" className="text-violet-600 hover:underline font-medium">
                      Login
                    </Link>{" "}
                    to purchase this artwork
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <Card className="p-6 border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Comments ({comments.length})</h2>

          {canComment && (
            <div className="mb-6 space-y-3">
              <textarea
                placeholder="Share your thoughts about this artwork..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm outline-none focus:border-violet-500 transition-colors resize-none"
              />
              <Button
                color="primary"
                className="rounded-xl font-semibold"
                onPress={handlePostComment}
                isLoading={postingComment}
                isDisabled={!comment.trim()}
              >
                Post Comment
              </Button>
            </div>
          )}

          {!isLoggedIn && (
            <p className="text-zinc-500 text-sm mb-6">
              <Link href="/auth/login" className="text-violet-600 hover:underline font-medium">
                Login
              </Link>{" "}
              and purchase this artwork to leave a comment
            </p>
          )}
          {isLoggedIn &&!canComment &&!isOwner && (
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl px-4 py-3 mb-6">
              <p className="text-zinc-500 text-sm">🔒 Only buyers who purchased this artwork can comment</p>
            </div>
          )}

          <div className="space-y-4">
            {comments.length === 0? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-zinc-400 text-sm">No comments yet</p>
              </div>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id}
                  className="flex gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-sm font-bold text-violet-600 flex-shrink-0">
                    {c.userName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{c.userName}</p>
                      <p className="text-xs text-zinc-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 text-sm">{c.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
