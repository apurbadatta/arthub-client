"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaCalendarAlt, FaCheckCircle, FaShoppingCart, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";

export default function ArtworkDetailsPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const [buying, setBuying] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    if (session?.user?.email && id) {
      const checkOwnership = async () => {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          const res = await fetch(`${baseUrl}/api/purchases?email=${session.user.email}`);
          const data = await res.json();
          if (data.success && data.data) {
            const owned = data.data.some(p => p.artworkId === id);
            setIsPurchased(owned);
          }
        } catch (error) {
          console.error("Error checking ownership:", error);
        }
      };
      checkOwnership();
    }
  }, [session, id]);

  useEffect(() => {
   const fetchArtworkDetails = async () => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const { data: tokenData } = await authClient.token();

    const res = await fetch(`${baseUrl}/api/artworks/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${tokenData?.token}`,
      },
    });

    const result = await res.json();

    if (result.success || result._id || result.data) {
      setArtwork(result.data || result);
    } else {
      toast.error("Artwork not found!");
    }
  } catch (error) {
    
    toast.error("Failed to load details!");
  } finally {
    setLoading(false);
  }
};

    if (id) fetchArtworkDetails();
  }, [id]);

  const handlePurchase = async () => {
    if (!session?.user) {
      toast.error("Please login first to purchase this artwork!");
      router.push("/login");
      return;
    }

    setBuying(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          artworkId: id
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Artwork purchased successfully! 🎉");
        setIsPurchased(true);
        setTimeout(() => {
          router.push("/dashboard/user/bought-artworks");
        }, 1500);
      } else {
        const errorMsg = data.error || data.message || "Purchase failed!";
        toast.error(errorMsg);
        if (errorMsg.includes("Limit Reached")) {
          setTimeout(() => {
            router.push("/dashboard/user/subscription");
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("An error occurred during purchase.");
    } finally {
      setBuying(false);
    }
  };

  // লোডিং কন্ডিশন
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex justify-center items-center text-indigo-500">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  // ডেটা না পাওয়া গেলে
  if (!artwork) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center items-center text-slate-400 gap-4">
        <p>Artwork details could not be found.</p>
        <button onClick={() => router.back()} className="text-sm font-semibold text-indigo-400 hover:underline flex items-center gap-2">
          <FaArrowLeft size={12} /> Go Back
        </button>
      </div>
    );
  }

  // ডেটা ফর্ম্যাটিং (তারিখ তৈরি)
  const formattedDate = artwork.createdAt 
    ? new Date(artwork.createdAt).toLocaleDateString() 
    : "Recent";

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />

      <div className="max-w-6xl w-full mx-auto space-y-6">
        {/* ব্যাক বাটন */}
        <button 
          onClick={() => router.back()} 
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer mb-4"
        >
          <FaArrowLeft size={10} /> Back to Gallery
        </button>

        {/* প্রধান কন্টেন্ট গ্রিড - image_e946d0.png লেআউট অনুযায়ী */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d1424] border border-slate-900 rounded-3xl p-6 lg:p-8 shadow-2xl">
          
          {/* বাম কলাম: বড় ইমেজ */}
          <div className="lg:col-span-6 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 shadow-md">
            <img 
              src={artwork.image} 
              alt={artwork.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* ডান কলাম: বিস্তারিত তথ্য এবং বাই বাটন কার্ড */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* মেটা ট্যাগ এবং ডেট */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold px-3 py-1 bg-indigo-950/60 border border-indigo-900/50 rounded-md text-indigo-400 tracking-wider">
                {artwork.category === "Digital" ? "Digital Art" : artwork.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <FaCalendarAlt size={12} /> {formattedDate}
              </span>
            </div>

            {/* টাইটেল ও বর্ণনা */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {artwork.title}
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                {artwork.description || "No description provided for this premium masterpiece."}
              </p>
            </div>

            {/* আর্টিস্ট প্রোফাইল বক্স */}
            <div className="bg-[#11192a] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between max-w-lg">
              <div className="flex items-center gap-3">
                {/* আর্টিস্ট অ্যাভাটার (ডিফল্ট বা ডাইনামিক) */}
                <div className="w-11 h-11 rounded-full bg-indigo-900/30 border border-indigo-500/20 flex items-center justify-center text-white font-bold overflow-hidden">
                  {artwork.artistName ? artwork.artistName.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Artist</span>
                  <span className="text-white font-bold text-sm sm:text-base">{artwork.artistName || "Unknown Artist"}</span>
                </div>
              </div>
              
              {/* ভেরিফাইড ব্যাজ */}
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-full">
                <FaCheckCircle size={10} /> Verified
              </span>
            </div>

            {/* প্রাইস এবং অ্যাভেইলেবিলিটি স্ট্যাটাস */}
            <div className="flex items-center justify-between pt-2 max-w-lg">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Purchase Price</span>
                <span className="text-3xl font-black text-white">${artwork.price}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Availability</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-md border border-emerald-950">AVAILABLE</span>
              </div>
            </div>

            {/* স্ট্রাইপ পেমেন্ট বাটন */}
            <div className="pt-2 max-w-lg">
              <button 
                onClick={handlePurchase}
                disabled={buying || isPurchased}
                className={`w-full font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isPurchased 
                    ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 cursor-not-allowed shadow-emerald-500/5" 
                    : "bg-[#5c3ef2] hover:bg-[#4c30d3] text-white shadow-purple-500/10"
                }`}
              >
                {buying ? (
                  <>
                    <FaSpinner className="animate-spin" size={14} /> Processing...
                  </>
                ) : isPurchased ? (
                  <>
                    <FaCheckCircle size={14} /> Owned / Acquired
                  </>
                ) : (
                  <>
                    <FaShoppingCart size={14} /> Buy Now with Stripe
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}