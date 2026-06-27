"use client";

import HeroSection from "@/components/HeroSection";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import TopArtists from "@/components/TopArtists";
import BrowserByCategory from "@/components/BrowserByCategory";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <HeroSection />
      <FeaturedArtworks />
      <TopArtists />
      <BrowserByCategory />
      <CTASection />
    </div>
  );
}
