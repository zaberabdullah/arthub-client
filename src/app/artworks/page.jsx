// mock data - পরে আপনি ডাটাবেস থেকে fetch করবেন
const artworks = [
  { id: 1, title: "Ocean Sunset", price: 150, image: "https://via.placeholder.com/300" },
  { id: 2, title: "Abstract Mind", price: 200, image: "https://via.placeholder.com/300" },
];

export default function BrowseArtworks() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Browse Artworks</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map((art) => (
          <div key={art.id} className="border border-rose-100 rounded-2xl p-4 hover:shadow-lg transition">
            <img src={art.image} alt={art.title} className="w-full h-48 object-cover rounded-xl mb-4" />
            <h2 className="font-bold text-lg">{art.title}</h2>
            <p className="text-rose-600 font-semibold">${art.price}</p>
            <button className="w-full mt-4 py-2 border border-rose-500 text-rose-500 rounded-full hover:bg-rose-50">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}