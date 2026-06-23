"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Card, Button, Chip } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ArtistDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchMyArtworks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks/my/list`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setArtworks(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchMyArtworks();
  }, [session]);

  if (isPending || loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 space-y-3">
              <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Artworks</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Welcome, {session?.user?.name}
          </p>
        </div>
        <Link href="/dashboard/add">
          <Button color="primary" className="font-semibold rounded-xl">
            + Add New Artwork
          </Button>
        </Link>
      </div>

      {artworks.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-zinc-600 font-medium">No artworks yet</p>
          <p className="text-zinc-400 text-sm mt-1">Start by creating your first artwork</p>
          <Link href="/dashboard/add" className="mt-4 inline-block">
            <Button color="primary" variant="flat">Create Artwork</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art) => (
            <Card key={art._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={art.imageUrl} 
                alt={art.title} 
                className="w-full h-56 object-cover"
              />
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {art.title}
                  </h3>
                  <p className="text-zinc-500 text-sm mt-1 line-clamp-2">
                    {art.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-violet-600">${art.price}</p>
                  <Chip variant="flat" size="sm">{art.category}</Chip>
                </div>

                {art.isSold && (
                  <Chip color="danger" variant="flat" size="sm">Sold</Chip>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
