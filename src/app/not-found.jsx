"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle, FaArrowLeft, FaHome } from "react-icons/fa";

export default function NotFound() {
  const router = useRouter();

  return (
   
    <div className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center bg-[#0b111e] text-slate-300 p-4 md:p-10 z-50 animate-in fade-in duration-300">
      
    
      <div className="max-w-md w-full bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center flex flex-col items-center">
        
     
        <div className="w-16 h-16 bg-purple-950/40 rounded-2xl flex items-center justify-center text-[#6366f1] text-2xl mb-5 border border-purple-900/50">
          <FaExclamationTriangle />
        </div>

        <h1 className="text-5xl font-black text-white tracking-tight mb-1">404</h1>
        <h2 className="text-lg font-bold text-slate-100 mb-2">Dashboard Page Not Found</h2>
        
        
        <p className="text-xs font-medium text-slate-400 mb-6 leading-relaxed max-w-xs">
          The dashboard section or artwork workspace you are trying to access does not exist or has been moved.
        </p>

        <div className="w-full border-t border-slate-800 mb-6"></div>

        
        <div className="w-full flex flex-col sm:flex-row gap-2">
      
          <button
            onClick={() => router.back()}
            className="flex-1 flex items-center justify-center gap-2 text-slate-300 bg-[#1f2937] hover:bg-[#374151] border border-slate-700 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
          >
            <FaArrowLeft /> Go Back
          </button>

          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/10 transition-all cursor-pointer"
          >
            <FaHome /> Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}