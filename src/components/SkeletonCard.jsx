export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-100 overflow-hidden animate-pulse">
      <div className="h-56 bg-zinc-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-zinc-200 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 rounded w-1/2" />
        <div className="h-6 bg-zinc-200 rounded w-1/4" />
      </div>
    </div>
  );
}
