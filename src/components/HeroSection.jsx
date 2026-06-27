"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const HERO_ARTWORKS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&h=1080&fit=crop",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920&h=1080&fit=crop",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1920&h=1080&fit=crop",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=1920&h=1080&fit=crop",
  },
];

export default function HeroSection() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Slider - Full Width */}
      <div className="absolute inset-0 w-full h-full">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {HERO_ARTWORKS.map((art) => (
            <SwiperSlide key={art.id}>
              <div className="relative w-full h-full">
                <img
                  src={art.image}
                  alt="Artwork"
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Gradient blobs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] z-10"
        style={{ background: "radial-gradient(circle, #7c3aed, #4f46e5)" }}
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] z-10"
        style={{ background: "radial-gradient(circle, #db2777, #9333ea)" }}
      />

      {/* Content - Image er upore */}
      <div className="relative z-20 flex items-center justify-center h-full w-full">
        <div className="text-center text-white px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-white/90 text-sm font-medium">The world's finest art marketplace</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-8xl font-black leading-tight mb-6 drop-shadow-2xl"
          >
            Discover &{" "}
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Buy Original Art
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg"
          >
            Connect with talented artists worldwide. Find unique pieces that speak to your soul — from paintings to digital masterpieces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/artworks">
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-base px-10 h-14 rounded-xl shadow-2xl shadow-violet-900/40 hover:scale-105 transition-all"
              >
                Browse Artworks
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="bordered"
                className="border-2 border-white/30 backdrop-blur-md bg-white/5 text-white font-bold text-base px-10 h-14 rounded-xl hover:bg-white/10 transition-all"
              >
                Start Selling
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-12 mt-16"
          >
            {[
              { value: "10K+", label: "Artworks" },
              { value: "500+", label: "Artists" },
              { value: "5K+", label: "Collectors" },
            ].map((s) => (
              <div key={s.label} className="text-center backdrop-blur-md bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                <p className="text-4xl font-bold text-white">{s.value}</p>
                <p className="text-white/60 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pagination Style */}
      <style jsx global>{`
      .swiper-pagination {
          bottom: 40px!important;
          z-index: 30!important;
        }
      .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s;
        }
      .swiper-pagination-bullet-active {
          background: #8b5cf6;
          width: 32px;
          border-radius: 6px;
        }
      `}</style>
    </section>
  );
}
