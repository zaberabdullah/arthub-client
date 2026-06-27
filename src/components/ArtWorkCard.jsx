"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ArtworkCard({ art, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
    >
      <Link href={`/artworks/${art._id}`}>
        <div className={`group rounded-2xl overflow-hidden border border-zinc-100 hover:shadow-2xl transition-all duration-300 bg-white ${art.isSold? 'opacity-75' : 'hover:-translate-y-1.5'}`}>
          <div className="relative h-56 overflow-hidden">
            <img
              src={art.imageUrl}
              alt={art.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${!art.isSold && 'group-hover:scale-110'}`}
            />
            
            {art.isSold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-red-500 text-white font-bold px-4 py-1.5 rounded-full text-sm shadow-lg">
                  SOLD OUT
                </span>
              </div>
            )}
            
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-zinc-700">
              {art.category}
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="font-bold text-lg text-zinc-900 line-clamp-1 mb-1">{art.title}</h3>
            <p className="text-sm text-zinc-400 mb-3">by {art.artistName}</p>
            <div className="flex items-center justify-between">
              <p className={`text-2xl font-bold ${art.isSold? 'text-zinc-400 line-through' : 'text-violet-600'}`}>
                ${art.price}
              </p>
              <span className={`text-xs px-2 py-1 rounded-lg ${art.isSold? 'text-red-500 bg-red-50' : 'text-zinc-400 bg-zinc-50'}`}>
                {art.isSold? 'Sold Out' : 'View →'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
