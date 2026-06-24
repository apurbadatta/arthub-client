"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from "next/navigation";

export default function ArtworksPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const fetchAllArtworks = async () => {
      setLoading(true);
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
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

  const handleFilterChange = (updateState, value) => {
    updateState(value);
    setCurrentPage(1);
  };
  const filteredAndSortedArtworks = artworks
    .filter((art) => {
      const matchesSearch =
        art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.artistName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        art.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === "Digital Art" && art.category === "Digital");

      const price = Number(art.price) || 0;
      const matchesMinPrice = minPrice === "" || price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === "" || price <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
   
      if (sortBy === "price-low") return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortBy === "price-high") return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sortBy === "newest") {
  
        return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
      }
      return 0;
    });


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  

  const currentArtworks = filteredAndSortedArtworks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedArtworks.length / itemsPerPage);

  const handleDetailsNavigation = (e, artworkId) => {
    if (!session) {
      e.preventDefault(); 
      toast.info("Please login first to view artwork details!");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Browse Artworks
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
            Explore world-class original paintings, digital arts, and sculptures
            from professional creators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-[#111827] border border-slate-800 p-4 rounded-2xl mb-8 shadow-xl">

  
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Title or artist..."
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              className="w-full bg-[#161f30] border border-slate-800 focus:border-indigo-500 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none transition-all"
            />
          </div>

          <div className="w-full">
            <select
              value={selectedCategory}
              onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
              className="w-full bg-[#161f30] border border-slate-800 focus:border-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none cursor-pointer transition-all"
            >
              <option value="All Categories">All Categories</option>
              <option value="Painting">Painting</option>
              <option value="Digital">Digital Art</option>
              <option value="Sculpture">Sculpture</option>
            </select>
          </div>
          <div className="w-full">
            <input
              type="number"
              placeholder="Min Price ($)"
              value={minPrice}
              onChange={(e) => handleFilterChange(setMinPrice, e.target.value)}
              className="w-full bg-[#161f30] border border-slate-800 focus:border-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none transition-all"
            />
          </div>

          <div className="w-full">
            <input
              type="number"
              placeholder="Max Price ($)"
              value={maxPrice}
              onChange={(e) => handleFilterChange(setMaxPrice, e.target.value)}
              className="w-full bg-[#161f30] border border-slate-800 focus:border-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none transition-all"
            />
          </div>

          <div className="w-full">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#161f30] border border-slate-800 focus:border-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none cursor-pointer transition-all"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {loading || isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-[#111827] border border-slate-800/60 rounded-2xl p-4 space-y-4 animate-pulse"
              >
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
        ) : filteredAndSortedArtworks.length === 0 ? (
          <div className="text-center py-24 bg-[#111827] border border-slate-800/40 rounded-2xl">
            <p className="text-slate-500 text-base font-medium tracking-wide">
              No artworks match your search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentArtworks.map((art) => (
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
                        By{" "}
                        <span className="text-slate-300 font-medium">
                          {art.artistName || "Unknown"}
                        </span>
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800/80">
                      <span className="text-base font-black text-indigo-400">
                        ${art.price}
                      </span>
                      <Link
                        href={`/artworks/${art._id}`}
                        className="w-full sm:w-auto"
                        onClick={(e) => handleDetailsNavigation(e, art._id)}
                      >
                        <button className="w-full bg-[#5c3ef2] hover:bg-[#4c30d3] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-md shadow-purple-500/10">
                          Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 bg-[#111827] border border-slate-800/80 p-3 rounded-2xl max-w-max mx-auto shadow-xl">
                {/* Previous Button */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 py-2 bg-[#161f30] hover:bg-slate-800 border border-slate-800/80 disabled:opacity-40 disabled:hover:bg-[#161f30] text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-9 h-9 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                      currentPage === index + 1
                        ? "bg-[#5c3ef2] text-white border-[#5c3ef2] shadow-md shadow-purple-500/20"
                        : "bg-[#161f30] text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 py-2 bg-[#161f30] hover:bg-slate-800 border border-slate-800/80 disabled:opacity-40 disabled:hover:bg-[#161f30] text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}