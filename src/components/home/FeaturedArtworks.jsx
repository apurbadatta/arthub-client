"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaEye, FaSpinner, FaArrowRight } from "react-icons/fa";

export default function FeaturedArtworks() {
  
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/artworks`);
        if (!res.ok) throw new Error("Failed to fetch artworks from server");
        
        const result = await res.json();
        
      
        console.log("FeaturedArtworks API Response:", result);

        let artsArray = [];
        
     
        if (Array.isArray(result)) {
          artsArray = result;
        } else if (result.data && Array.isArray(result.data)) {
          artsArray = result.data;
        } else if (result.artworks && Array.isArray(result.artworks)) {
          artsArray = result.artworks;
        } else if (result.result && Array.isArray(result.result)) {
          artsArray = result.result;
        }

        setArtworks(artsArray.slice(0, 6));
      } catch (error) {
        console.error("Error fetching featured artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [baseUrl]);

  return (
    <section className="py-20 bg-[#0b121f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
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

     
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-3">
              <FaSpinner className="animate-spin text-4xl text-purple-500" />
              <p className="text-xs text-slate-400">Loading Artworks...</p>
            </div>
          </div>
        ) : artworks.length === 0 ? (
      
          <div className="text-center text-slate-500 py-16 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-sm">No artworks found in the database.</p>
            <p className="text-xs text-slate-600 mt-1">Please make sure you have uploaded artworks using the Artist Dashboard.</p>
          </div>
        ) : (
        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((art) => {
              const artId = art._id || art.id; 

              return (
                <div 
                  key={artId} 
                  className="bg-[#111827] rounded-[24px] border border-slate-800 overflow-hidden group hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
                >
           
                  <div className="aspect-square w-full bg-slate-900 relative overflow-hidden">
                    <img 
                      src={art.image} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
             
                    <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 text-slate-200">
                      {art.category || art.tag || "Artwork"}
                    </span>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
                      <Link 
                        href={`/artworks/${artId}`}
                        className="p-3 bg-white hover:bg-purple-600 text-slate-900 hover:text-white rounded-full transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer"
                      >
                        <FaEye />
                      </Link>
                      <button className="p-3 bg-white hover:bg-rose-500 text-slate-900 hover:text-white rounded-full transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer">
                        <FaRegHeart />
                      </button>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="p-6 flex justify-between items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-white text-lg group-hover:text-purple-400 transition-colors truncate">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        by {art.artistName || art.artist || "Unknown Artist"}
                      </p>
                      <div className="mt-1.5">
                        <span className="text-purple-400 font-black text-xl">
                          ${art.price}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Link
                        href={`/artworks/${artId}`}
                        className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md shadow-purple-900/20"
                      >
                        Details <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}