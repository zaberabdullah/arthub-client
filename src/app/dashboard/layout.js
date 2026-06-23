import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="w-64 border-r border-rose-100 hidden md:block bg-white shadow-sm">
        <div className="p-6 text-xl font-bold text-rose-600">ArtHub</div>
        <Sidebar />
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}