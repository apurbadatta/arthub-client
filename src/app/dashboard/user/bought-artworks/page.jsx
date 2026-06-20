"use client";
import { useState } from "react";
import { FaEye, FaImage, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

export default function BoughtArtworksPage() {
  // আপনার টেস্টিং এর সুবিধার জন্য ডামি ডাটা সেট করা হলো
  const [boughtItems] = useState([
    {
      _id: "art_001",
      title: "Shattered Grace",
      artistName: "Michael Angelo",
      price: 600,
      category: "Sculpture",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop",
    },
    {
      _id: "art_002",
      title: "Classic Artwork",
      artistName: "Apurba",
      price: 45,
      category: "Painting",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop",
    },
  ]);

  return (
    <div className="w-full text-slate-200 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black tracking-tight">Bought Artworks Gallery</h1>
        <p className="text-xs text-slate-400 mt-1">Your premium personal vault containing all acquired aesthetic arts and licenses.</p>
      </div>

      <div className="w-full border-t border-slate-800 my-4"></div>

      {boughtItems.length === 0 ? (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl py-20 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-3">
            <FaImage size={20} />
          </div>
          <p className="text-sm text-slate-400">No artworks acquired yet</p>
          <p className="text-[11px] text-slate-600 mt-1">Browse the marketplace global collections to start buying masterpieces.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boughtItems.map((item) => (
            <div key={item._id} className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all shadow-sm">
              
              {/* ইমেজ কন্টেইনার এবং ওভারলে ইফেক্ট */}
              <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                  <Link 
                    href={`/artworks/${item._id}`}
                    className="p-3 bg-[#5c3ef2] rounded-full text-white transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-[#4c30d3]"
                  >
                    <FaEye size={16} />
                  </Link>
                </div>
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-[10px] text-indigo-400 border border-slate-800 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              {/* টেক্সট কন্টেন্ট */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400">By <span className="text-slate-300 font-medium">{item.artistName}</span></p>
                </div>

                <div className="border-t border-slate-800/80 pt-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Price Settled</p>
                    <p className="text-base font-extrabold text-emerald-400">${item.price}</p>
                  </div>

                  <Link 
                    href={`/artworks/${item._id}`}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider transition-all"
                  >
                    View Details <FaExternalLinkAlt size={10} />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}