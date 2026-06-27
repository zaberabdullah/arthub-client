import { Suspense } from "react";
import BrowseArtworksContent from "./BrowseArtworksContent";
import { Card } from "@heroui/react";

export default function BrowseArtworks() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <Card key={i} className="space-y-3 p-4">
              <div className="w-full h-56 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3 animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    }>
      <BrowseArtworksContent />
    </Suspense>
  );
}