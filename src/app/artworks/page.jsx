"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);


  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");


  useEffect(() => {
    const fetchAllArtworks = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/artworks`);
        const result = await res.json();

        if (Array.isArray(result)) {
          setArtworks(result);
        } else if (result.success || result.data) {
          setArtworks(result.data || []);
        }
      } catch (error) {
        console.error("Error loading artworks:", error);
        toast.error("Failed to load artworks gallery!");
      } finally {
        setLoading(false);
      }
    };

    fetchAllArtworks();
  }, []);


  const filteredArtworks = artworks.filter((art) => {
    const matchesSearch =
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artistName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      art.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === "Digital Art" && art.category === "Digital");

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        {/* হেডার সেকশন */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Browse Artworks
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
            Explore world-class original paintings, digital arts, and sculptures from professional creators.
          </p>
        </div>

        {/*  */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#111827] border border-slate-800 p-4 rounded-2xl mb-8 shadow-xl">
          {/* সার্চ ইনপুট */}
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Title or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161f30] border border-slate-800 focus:border-indigo-500 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none transition-all"
            />
          </div>

         
          <div className="w-full sm:w-auto min-w-[200px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#161f30] border border-slate-800 focus:border-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none cursor-pointer transition-all"
            >
              <option value="All Categories">All Categories</option>
              <option value="Painting">Painting</option>
              <option value="Digital">Digital Art</option>
              <option value="Sculpture">Sculpture</option>
            </select>
          </div>
        </div>

      
        {loading ? (
        
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#111827] border border-slate-800/60 rounded-2xl p-4 space-y-4 animate-pulse">
                <div className="bg-slate-800/50 aspect-[4/3] w-full rounded-xl"></div>
                <div className="h-4 bg-slate-800/50 rounded w-1/3"></div>
                <div className="h-5 bg-slate-800/50 rounded w-3/4"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-slate-800/50 rounded w-1/4"></div>
                  <div className="h-8 bg-slate-800/50 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredArtworks.length === 0 ? (
       
          <div className="text-center py-24 bg-[#111827] border border-slate-800/40 rounded-2xl">
            <p className="text-slate-500 text-base font-medium tracking-wide">
              No artworks match your search or filter criteria.
            </p>
          </div>
        ) : (
       
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredArtworks.map((art) => (
              <div
                key={art._id}
                className="bg-[#111827] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-700/80 transition-all duration-300 flex flex-col group"
              >
           
                <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden border-b border-slate-800/50">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

           
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
            
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-800/80 rounded-md text-indigo-400 border border-indigo-900/30">
                      {art.category === "Digital" ? "Digital Art" : art.category}
                    </span>
            
                    <h3 className="text-base font-bold text-white mt-2 truncate group-hover:text-indigo-400 transition-colors">
                      {art.title}
                    </h3>
                  
                    <p className="text-xs text-slate-400 mt-1">
                      By <span className="text-slate-300 font-medium">{art.artistName || "Unknown"}</span>
                    </p>
                  </div>

           
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800/80">
                    <span className="text-base font-black text-indigo-400">
                      ${art.price}
                    </span>
                    <button className="bg-[#5c3ef2] hover:bg-[#4c30d3] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-purple-500/10">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}