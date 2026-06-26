import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-violet-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Page Not Found</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          ← Go Home
        </Link>
      </div>
    </div>
  );
}