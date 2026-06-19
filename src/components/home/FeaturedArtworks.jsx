import Link from "next/link";
import { FaHeart, FaRegHeart, FaEye } from "react-icons/fa";

export default function FeaturedArtworks() {
  const artworks = [
    {
      id: 1,
      title: "Neon Dreams",
      artist: "Alex River",
      price: "$850",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600",
      tag: "Digital Art",
    },
    {
      id: 2,
      title: "Silent Whispers",
      artist: "Sophia Vance",
      price: "$1,400",
      image: "https://images.unsplash.com/photo-1579783928621-7a13d66a6211?q=80&w=600",
      tag: "Oil Painting",
    },
    {
      id: 3,
      title: "Abstract Nexus",
      artist: "Marcus Cole",
      price: "$2,100",
      image: "https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=600",
      tag: "Sculpture",
    },
  ];

  return (
    <section className="py-20 bg-[#0b121f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Featured Artworks
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-md">
              Handpicked premium masterpieces from top creators around the world.
            </p>
          </div>
          <Link 
            href="/artworks" 
            className="text-[#7c3aed] hover:text-purple-400 font-bold text-sm transition-colors cursor-pointer border-b border-purple-500/30 pb-1"
          >
            View All Collection →
          </Link>
        </div>

        {/* Art Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((art) => (
            <div 
              key={art.id} 
              className="bg-[#111827] rounded-[24px] border border-slate-800 overflow-hidden group hover:border-slate-700 transition-all duration-300"
            >
              {/* Image Box */}
              <div className="aspect-square w-full bg-slate-900 relative overflow-hidden">
                <img 
                  src={art.image} 
                  alt={art.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Tag */}
                <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 text-slate-200">
                  {art.tag}
                </span>

                {/* Hover Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
                  <button className="p-3 bg-white hover:bg-purple-600 text-slate-900 hover:text-white rounded-full transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300">
                    <FaEye />
                  </button>
                  <button className="p-3 bg-white hover:bg-rose-500 text-slate-900 hover:text-white rounded-full transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300">
                    <FaRegHeart />
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-white text-lg group-hover:text-purple-400 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">by {art.artist}</p>
                </div>
                <div className="text-right">
                  <span className="text-purple-400 font-black text-xl">{art.price}</span>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase mt-0.5">Ready to Ship</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}