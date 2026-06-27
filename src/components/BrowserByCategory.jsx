"use client";

import Link from "next/link";
import { Palette, Monitor, Cuboid, Camera, PenTool, Image as ImageIcon } from "lucide-react";

const categories = [
  {
    name: "Painting",
    icon: Palette,
    href: "/artworks?category=painting",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop",
    count: "2.4k+",
  },
  {
    name: "Digital",
    icon: Monitor,
    href: "/artworks?category=digital",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop",
    count: "5.1k+",
  },
  {
    name: "Sculpture",
    icon: Cuboid,
    href: "/artworks?category=sculpture",
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&auto=format&fit=crop",
    count: "890+",
  },
  {
    name: "Photography",
    icon: Camera,
    href: "/artworks?category=photography",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    count: "3.2k+",
  },
  {
    name: "Drawing",
    icon: PenTool,
    href: "/artworks?category=drawing",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop",
    count: "1.8k+",
  },
  {
    name: "Other",
    icon: ImageIcon,
    href: "/artworks?category=other",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&auto=format&fit=crop",
    count: "650+",
  },
];

export default function BrowseByCategory() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-violet-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-violet-600 bg-violet-100 rounded-full uppercase mb-4">
            Find What You Love
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Browse by Category
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore thousands of unique artworks across different mediums and styles
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-violet-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-violet-600 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors duration-300" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg mb-1">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.count} Artworks</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/artworks">
            <button className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105">
              View All Artworks
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
