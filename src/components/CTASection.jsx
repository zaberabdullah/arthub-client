"use client";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="bg-[#0a0a0f] py-24 px-4 relative overflow-hidden">
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/3 w-96 h-96 rounded-full opacity-20 blur-[80px]"
        style={{ background: "radial-gradient(circle, #7c3aed, #4f46e5)" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center text-white"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-5">
          Are you an{" "}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Artist?
          </span>
        </h2>
        <p className="text-white/60 text-lg mb-10">
          Join thousands of artists selling their work on ArtHub. Set up your shop in minutes and reach collectors worldwide.
        </p>
        <Link href="/auth/register">
          <Button
            size="lg"
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-base px-12 h-14 rounded-xl shadow-2xl shadow-violet-900/40 hover:scale-105 transition-all"
          >
            Start Selling Today
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
