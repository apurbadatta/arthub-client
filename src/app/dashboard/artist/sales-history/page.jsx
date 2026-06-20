
"use client";
import { useState, useEffect } from "react";
import { FaCalendarAlt, FaChartLine, FaCrown, FaDollarSign, FaImage, FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SalesHistoryPage({ user }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUploaded: 0,
    totalSalesCount: 0,
    totalRevenue: 0,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    // লগইন করা আর্টিস্টের ইমেইল ট্র্যাক করা হচ্ছে
    let artistEmail = user?.email;
    if (!artistEmail) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          artistEmail = JSON.parse(storedUser)?.email;
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (!artistEmail) return;

    const fetchArtistStats = async () => {
      setLoading(true);
      try {
        // ১. আর্টিস্টের টোটাল আপলোড করা আর্টওয়ার্ক সংখ্যা জানার জন্য আপনার এক্সিস্টিং এপিআই কল
        const res = await fetch(`${baseUrl}/api/my-artworks?email=${artistEmail}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          const totalArtworks = result.data.length;

          
          setStats({
            totalUploaded: totalArtworks,
            totalSalesCount: 0,
            totalRevenue: 0.0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistStats();
  }, [user, baseUrl]);

  const handleUpgrade = () => {
    toast.info("Stripe Payment gateway redirecting... (Coming Soon)");
  };

  return (
    <div className="w-full text-slate-200 max-w-5xl space-y-6">
      <ToastContainer theme="dark" position="top-right" />

      {/* পেজ হেডার */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-black tracking-tight">Sales Analytics & History</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your artwork creation statistics, upgrade limitations, and monitor your global digital sales revenue.
        </p>
      </div>

      <div className="w-full border-t border-slate-800 my-4"></div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 text-indigo-500 space-y-3">
          <FaSpinner className="animate-spin text-3xl" />
          <p className="text-xs text-slate-500">Calculating repository data...</p>
        </div>
      ) : (
        <>
          {/* গ্রিড স্ট্যাটস কার্ডস (image_953cd0 এর মতো লেআউট) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* কার্ড ১: টোটাল হোস্টেড/আপলোডেড আর্টওয়ার্ক */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm transition-all hover:border-slate-700">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Uploaded Art</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{stats.totalUploaded}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
                <FaImage size={20} />
              </div>
            </div>

            {/* কার্ড ২: টোটাল সেলস কাউন্ট */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm transition-all hover:border-slate-700">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Artwork Sales</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{stats.totalSalesCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                <FaChartLine size={20} />
              </div>
            </div>

            {/* কার্ড ৩: অর্জিত মোট রেভিনিউ */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm transition-all hover:border-slate-700">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accumulated Revenue</p>
                <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FaDollarSign size={20} />
              </div>
            </div>

          </div>

          {/* প্রিমিয়াম ব্যানার সেকশন (Premium Card Section) */}
          <div className="w-full relative overflow-hidden bg-gradient-to-r from-[#1e1b4b]/80 via-[#111827] to-[#111827] border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-8 shadow-xl">
            {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mt-1 shrink-0 shadow-inner">
                <FaCrown size={22} className="drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Unlock Unlimited Art Creation
                </h3>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  Standard artist accounts are limited to host up to <span className="text-amber-400 font-semibold">3 custom artwork</span> pieces simultaneously. Upgrade to our Premium Package for <span className="text-white font-semibold">$49.00</span> to publish and commercialize unlimited creations.
                </p>
              </div>
            </div>

            <button 
              onClick={handleUpgrade}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer text-center shrink-0"
            >
              Upgrade to Premium
            </button>
          </div>

          {/* রিসেন্ট হিস্টোরি টেবিল বা এম্পটি স্টেট প্লেসহোল্ডার */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 mt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-slate-500" /> Recent Invoices & Statements
            </h3>
            <div className="border border-dashed border-slate-800 rounded-xl py-12 flex flex-col items-center justify-center text-center">
              <p className="text-sm text-slate-500">No recent transactions found</p>
              <p className="text-[11px] text-slate-600 mt-1">When clients buy your arts with Stripe, transaction lists appear here.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}