"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function AdminEditArtwork() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
    artistName: "",
    artistEmail: ""
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // ১. নির্দিষ্ট আর্টওয়ার্কের ডেটা ব্যাকএন্ড থেকে লোড করা
  useEffect(() => {
    const fetchArtworkDetails = async () => {
      try {
        // এখানে আপনার সিঙ্গেল আর্টওয়ার্ক গেট করার API ব্যবহার করবেন
        const res = await fetch(`${baseUrl}/api/artworks/${id}`);
        if (!res.ok) throw new Error("Failed to fetch artwork");
        
        const data = await res.json();
        // আপনার ব্যাকএন্ড রেসপন্স স্ট্রাকচার অনুযায়ী সেট করবেন (ধরে নিচ্ছি data বা data.data তে অবজেক্ট আছে)
        const artwork = data.data || data;
        
        setFormData({
          title: artwork.title || "",
          price: artwork.price || "",
          category: artwork.category || "",
          description: artwork.description || "",
          image: artwork.image || "",
          artistName: artwork.artistName || "",
          artistEmail: artwork.artistEmail || ""
        });
      } catch (error) {
        console.error(error);
        toast.error("Error loading artwork data!");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtworkDetails();
    }
  }, [id, baseUrl]);

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ২. আপডেট সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // আপনার এক্সিস্টিং PUT/PATCH API (/api/artworks/:id)
      const res = await fetch(`${baseUrl}/api/artworks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          price: Number(formData.price),
          category: formData.category,
          description: formData.description
        }),
      });

      if (res.ok) {
        toast.success("Artwork updated successfully! 🎨");
        // সফলভাবে আপডেট হওয়ার ২ সেকেন্ড পর মেইন তালিকায় ফেরত যাবে
        setTimeout(() => {
          router.push("/dashboard/admin/manage-artworks");
        }, 2000);
      } else {
        toast.error("Failed to update artwork");
      }
    } catch (error) {
      toast.error("Something went wrong during update!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 text-indigo-500">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-slate-500">Fetching artwork information...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-slate-200 p-6 space-y-6 max-w-4xl mx-auto">
      <ToastContainer theme="dark" position="top-right" />

      {/* হেডার ও ব্যাক বাটন */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Modify Artwork Details</h1>
          <p className="text-xs text-slate-400 mt-1">
            As an Administrator, you are editing content submitted by <span className="text-indigo-400">{formData.artistName}</span>.
          </p>
        </div>
        <Link 
          href="/dashboard/admin/manage-artworks"
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-lg transition"
        >
          Back to List
        </Link>
      </div>

      <div className="w-full border-t border-slate-800/60 my-2"></div>

      {/* এডিট ফর্ম ও প্রিভিউ গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* বামে ছোট প্রিভিউ উইন্ডো */}
        <div className="bg-[#0b111e] border border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3 h-fit">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider w-full text-left">Current Image</p>
          <img 
            src={formData.image || "https://placehold.co/600x400"} 
            alt="Preview" 
            className="w-full h-44 object-cover rounded-lg border border-slate-800 bg-slate-900 shadow-inner"
          />
          <div className="text-left w-full pt-2 border-t border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">Artist Account:</span>
            <span className="text-xs text-slate-300 font-mono break-all">{formData.artistEmail}</span>
          </div>
        </div>

        {/* ডানে মূল এডিট ফর্ম */}
        <div className="md:col-span-2 bg-[#0b111e] border border-slate-800/80 rounded-xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* টাইটেল ইনপুট */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Artwork Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-[#111827] border border-slate-800 text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition"
                placeholder="Enter masterpiece title"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* প্রাইস ইনপুট */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">Price (USD $)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full bg-[#111827] border border-slate-800 text-emerald-400 font-bold rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="0.00"
                />
              </div>

              {/* ক্যাটাগরি ইনপুট */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#111827] border border-slate-800 text-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="e.g. Oil Painting, Digital Art"
                />
              </div>
            </div>

            {/* ডেসক্রিপশন ইনপুট */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Artwork Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                className="w-full bg-[#111827] border border-slate-800 text-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                placeholder="Write comprehensive notes regarding this artwork submission..."
              ></textarea>
            </div>

            {/* অ্যাকশন বাটনস */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/dashboard/admin/manage-artworks"
                className="bg-transparent border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-medium px-4 py-2 rounded-lg transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updating}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-bold px-5 py-2 rounded-lg transition flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Changes...
                  </>
                ) : (
                  "Save & Apply Changes"
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}