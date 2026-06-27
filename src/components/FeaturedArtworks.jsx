"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import ArtworkCard from "./ArtWorkCard";
import SkeletonCard from "./SkeletonCard";


export default function FeaturedArtworks() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks?limit=6&sort=newest`);
        const artData = await artRes.json();
        setFeatured(artData.artworks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-between items-end mb-12"
      >
        <div>
          <p className="text-violet-600 font-semibold text-sm mb-2 uppercase tracking-wider">Handpicked for you</p>
          <h2 className="text-4xl font-bold text-zinc-900">Featured Artworks</h2>
        </div>
        <Link href="/artworks" className="hidden sm:flex items-center gap-1 text-violet-600 font-semibold hover:underline">
          View All →
        </Link>
      </motion.div>

      {loading? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : featured.length === 0? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎨</p>
          <p className="text-zinc-400">No artworks yet. Be the first to upload!</p>
          <Link href="/auth/register">
            <Button className="mt-4 bg-violet-600 text-white rounded-xl">Start Selling</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((art, idx) => (
            <ArtworkCard key={art._id} art={art} idx={idx} />
          ))}
        </div>
      )}
    </section>
  );
}
