"use client";
import { Card } from "@heroui/react";
import { motion } from "framer-motion";

export default function TopArtists() {
  const artists = [
    {
      name: "Alex Chen",
      avatar: "https://i.pravatar.cc/150?img=12",
      artworksSold: 47,
      totalEarnings: 12450,
      gradient: "from-orange-500 to-pink-500",
      badge: "#1",
      emoji: "👑"
    },
    {
      name: "Sarah Mitchell",
      avatar: "https://i.pravatar.cc/150?img=5",
      artworksSold: 38,
      totalEarnings: 9820,
      gradient: "from-purple-500 to-indigo-500",
      badge: "#2",
      emoji: "🥈"
    },
    {
      name: "David Kumar",
      avatar: "https://i.pravatar.cc/150?img=33",
      artworksSold: 31,
      totalEarnings: 7650,
      gradient: "from-blue-500 to-cyan-500",
      badge: "#3",
      emoji: "🥉"
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 tracking-widest uppercase mb-3">
            Meet The Creators
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-4">
            Top Artists
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Celebrating our most successful artists who are shaping the future of digital art
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {artists.map((artist, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <Card className="relative overflow-visible border-0 bg-white dark:bg-zinc-900 hover:scale-105 transition-all duration-500 hover:shadow-2xl group">
                <div className="absolute -top-4 -right-4 z-20">
                  <div className={`bg-gradient-to-br ${artist.gradient} w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl rotate-12 group-hover:rotate-0 transition-transform duration-500`}>
                    <span className="text-3xl">{artist.emoji}</span>
                  </div>
                </div>

                <div className={`absolute inset-0 bg-gradient-to-br ${artist.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />

                <div className="relative p-8 text-center">
                  <div className="relative inline-block mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${artist.gradient} rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity`} />
                    <div className={`relative bg-gradient-to-br ${artist.gradient} p-1 rounded-full`}>
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-zinc-900"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      {artist.badge}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                    {artist.name}
                  </h3>

                  <div className="space-y-3">
                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4">
                      <p className="text-3xl font-black bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                        {artist.artworksSold}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">
                        Artworks Sold
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <span className="text-sm">Total Earned:</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${artist.totalEarnings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
