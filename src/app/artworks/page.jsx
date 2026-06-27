"use client";

import { useEffect, useState, Suspense } from "react";
import { Card, Button, Chip, Pagination } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// useSearchParams যেখানে use হচ্ছে, সেটাকে আলাদা component এ নিলাম
function BrowseArtworksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const categories = ["Painting", "Digital", "Sculpture", "Photography", "Drawing", "Mixed Media"];

  useEffect(() => {
    fetchArtworks();
  }, [page, sort, category]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sort,
      });
      
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks?${params}`);
      const data = await res.json();
      
      setArtworks(data.artworks || data || []);
      setTotalPages(data.totalPages || 1);
      router.push(`/artworks?${params}`, { scroll: false });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchArtworks();
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Browse Artworks</h1>
        <p className="text-zinc-500">Discover unique artworks from talented artists worldwide</p>
      </div>

      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <div className="flex gap-2 mt-4">
          <Button color="primary" onPress={handleSearch}>Apply Filters</Button>
          <Button variant="flat" onPress={handleReset}>Reset</Button>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="space-y-3 p-4">
              <div className="w-full h-56 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3 animate-pulse" />
            </Card>
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-zinc-600 font-medium">No artworks found</p>
          <p className="text-zinc-400 text-sm mt-1">Try adjusting your filters</p>
          <Button variant="flat" onPress={handleReset} className="mt-4">Clear Filters</Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {artworks.map((art) => (
              <Link key={art._id} href={`/artworks/${art._id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative group">
                    <img 
                      src={art.imageUrl} 
                      alt={art.title} 
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {art.isSold && (
                      <div className="absolute top-3 right-3">
                        <Chip color="danger" variant="flat" size="sm">Sold</Chip>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{art.title}</h3>
                    <p className="text-sm text-zinc-500">by {art.artistName}</p>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-2xl font-bold text-violet-600">${art.price}</p>
                      <Chip variant="flat" size="sm">{art.category}</Chip>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination total={totalPages} page={page} onChange={setPage} color="primary" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Main export - Suspense দিয়ে wrap করলাম
export default function BrowseArtworks() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="space-y-3 p-4">
              <div className="w-full h-56 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    }>
      <BrowseArtworksContent />
    </Suspense>
  )
}
