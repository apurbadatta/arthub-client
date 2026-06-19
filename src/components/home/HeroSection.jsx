"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaPalette,
  FaArrowRight,
  FaGem,
  FaAward,
  FaFire,
} from "react-icons/fa";

export default function HeroSection() {
  const bgImages = [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1600&q=80",
  ];

  const [currentBg, setCurrentBg] = useState(0);

  // 3 second slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [bgImages.length]);

  return (
    <section className="relative overflow-hidden py-16 lg:py-28 bg-[#0b121f] text-white">
      
      {/* 🎬 100% Ultra-Visible Dynamic Background Slider */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {bgImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[1000ms] ease-in-out ${
              index === currentBg
                ? "opacity-100 scale-105" // অপাসিটি ফুল ১০০% করা হয়েছে চরম ভিজিবিলিটির জন্য
                : "opacity-0 scale-100"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        {/* 🎴 প্রফেশনাল ব্ল্যাক গ্লাস ওভারলে মাস্ক (যাতে লেখা একদম ক্রিস্প ক্লিয়ার থাকে) */}
        <div className="absolute inset-0 bg-[#0b121f]/65 backdrop-blur-[2px]" />
        
        {/* লিনিয়ার গ্রেডিয়েন্ট বর্ডার ফেইড */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b121f] via-[#0b121f]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b121f]/30 to-[#0b121f]" />
      </div>

      {/* Content Layer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* 📝 Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm backdrop-blur-md">
              <FaGem className="text-purple-400 animate-pulse" />
              Next-Gen Art Marketplace
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-md">
              Discover & Buy <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
                Original Artworks
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed font-semibold drop-shadow-sm">
              Connect with global independent artists. Browse, collect, and
              sell premium custom paintings, digital masterpieces, and unique
              sculptures.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/artworks"
                className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-300 flex items-center gap-2 group text-sm cursor-pointer z-20"
              >
                Browse Artworks
                <FaArrowRight className="group-hover:translate-x-1.5 transition-transform duration-300 text-xs" />
              </Link>

              <Link
                href="/register"
                className="bg-[#111827]/80 hover:bg-slate-800 backdrop-blur-sm text-white border border-slate-700 font-bold px-8 py-4 rounded-2xl shadow-sm transition-all duration-300 text-sm cursor-pointer z-20"
              >
                Join as Artist
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700/60 max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">10K+</p>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-0.5">Artworks</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">2.5K+</p>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-0.5">Artists</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">50K+</p>
                <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-0.5">Collectors</p>
              </div>
            </div>
          </div>

          {/* 🖼️ Right Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            <div className="absolute -top-4 left-4 bg-[#1e293b]/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-600 flex items-center gap-3 animate-bounce [animation-duration:3s] z-20">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl text-sm">
                <FaAward />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Trending</p>
                <p className="text-xs font-extrabold text-white">#1 Top Rated Art</p>
              </div>
            </div>

            <div className="absolute bottom-10 -right-2 bg-[#1e293b]/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-xl border border-slate-600 flex items-center gap-2 animate-bounce [animation-duration:4s] z-20">
              <FaFire className="text-orange-400 text-xs" />
              <span className="text-[11px] font-black text-white">12 Offers Active</span>
            </div>

            <div className="relative w-full max-w-sm bg-[#111827]/90 backdrop-blur-sm p-4 rounded-[32px] shadow-2xl border border-slate-700 transform hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 group z-10">
              <div className="aspect-[4/5] rounded-[24px] overflow-hidden bg-slate-900 flex items-center justify-center relative">
                <img
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600"
                  alt="Ethereal Pathways"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-90" />
                <FaPalette className="text-5xl text-white opacity-0 group-hover:opacity-75 scale-75 group-hover:scale-100 transition-all duration-500 z-10" />
                <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[11px] font-bold border border-white/20 z-10">
                  Featured Marketplace Picks
                </span>
              </div>

              <div className="mt-4 flex justify-between items-center px-1">
                <div>
                  <h3 className="font-black text-white text-base group-hover:text-purple-400 transition-colors duration-300">Ethereal Pathways</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">by Elena Rostova</p>
                </div>
                <div className="text-right">
                  <span className="text-purple-400 font-black text-xl">$1,250</span>
                  <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Available</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}