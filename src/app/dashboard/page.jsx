export default function DashboardPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to your Dashboard</h1>
      <p className="mt-4 text-gray-600">
        Ekhane tumi tumar shob activities dekhte parbe.
      </p>
      
      {/* Ekhane tumi dashboard er cards ba stats add korbe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 bg-white rounded-2xl border border-rose-100 shadow-sm">
          <h3 className="font-semibold text-gray-700">Total Artworks</h3>
          <p className="text-2xl font-bold text-rose-600">12</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-rose-100 shadow-sm">
          <h3 className="font-semibold text-gray-700">Total Sales</h3>
          <p className="text-2xl font-bold text-rose-600">$450</p>
        </div>
      </div>
    </div>
  );
}