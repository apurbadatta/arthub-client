"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaSpinner, FaTrash, FaEdit, FaExclamationTriangle, FaCrown } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArtworkForm from "./ArtworkForm"; 

export default function ManageArtworks({ user }) {
  const [view, setView] = useState("list"); // 'list', 'add', or 'edit'
  const [artworks, setArtworks] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [userTier, setUserTier] = useState("free"); // ইউজারের বর্তমান টিয়ার ট্র্যাক করার জন্য
  
  // delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // edit and selakt 
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // আর্টিস্টের নিজের ডেটা এবং প্রোফাইল টিয়ার ফেচ করা
  const fetchArtworksAndTier = async () => {
    if (!user?.email) return;
    setDbLoading(true);
    try {
      // ১. আর্টওয়ার্কস লোড
      const res = await fetch(`${baseUrl}/api/my-artworks?email=${user.email}`); 
      const result = await res.json();
      if (result.success) {
        setArtworks(result.data || []);
      } else if (Array.isArray(result)) {
        setArtworks(result);
      }

      // ২. ইউজারের আইডি খোঁজা (টিয়ার ডিটেক্ট করার জন্য আপনার এক্সিস্টিং প্রোফাইল এপিআই ব্যবহার)
      const idToQuery = user?._id || user?.uid || user?.id;
      if (idToQuery) {
        const profileRes = await fetch(`${baseUrl}/api/profile?id=${idToQuery}`);
        const profileData = await profileRes.json();
        if (profileData.success && profileData.data) {
          setUserTier(profileData.data.tier || "free");
        }
      }
    } catch (error) {
      console.error("Error fetching gallery metrics:", error);
      toast.error("Failed to load gallery data");
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworksAndTier();
  }, [user?.email]);

  // প্লাস বাটনে ক্লিক করলে মেম্বারশিপ এবং কাউন্ট ভ্যালিডেশন গার্ড
  const handleAddArtworkClick = () => {
    if (userTier === "free" && artworks.length >= 3) {
      toast.error("❌ Limit Reached! standard accounts are limited to 3 items. Please upgrade to Premium package.");
      return;
    }
    setView("add");
  };
  
  const openDeleteModal = (id) => {
    setTargetDeleteId(id);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!targetDeleteId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/artworks/${targetDeleteId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.deletedCount > 0 || result.acknowledged) {
        toast.success("Artwork deleted successfully! 🗑️");
        setArtworks((prev) => prev.filter((art) => art._id !== targetDeleteId));
      } else {
        toast.error("Failed to delete artwork");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
      setTargetDeleteId(null);
    }
  };

  const handleEditClick = (artwork) => {
    setSelectedArtwork(artwork);
    setView("edit");
  };

  const handleFormSuccess = () => {
    setView("list");
    setSelectedArtwork(null);
    fetchArtworksAndTier();
  };
  

  if (view === "add" || view === "edit") {
    return (
      <ArtworkForm 
        user={user} 
        editData={selectedArtwork} 
        onSuccess={handleFormSuccess} 
        onCancel={() => { setView("list"); setSelectedArtwork(null); }} 
      />
    );
  }

 const handleUpgradePlanClick = async () => {
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
     
        body: JSON.stringify({ email: user?.email }), 
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url; 
      } else {
        toast.error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Something went wrong!");
    }
  };



  return (
    <div className="w-full text-slate-200">
      <ToastContainer theme="dark" position="top-right" autoClose={4000} />
      
      {/* হেডার */}
      <div className="flex justify-between items-center mb-1">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">My Artwork Gallery</h1>
          <p className="text-xs text-slate-400 mt-1">Create and publish art pieces for sale on the platform.</p>
        </div>
        <button 
          onClick={handleAddArtworkClick}
          className="bg-[#5c3ef2] hover:bg-[#4c30d3] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
        >
          <FaPlus className="text-[10px]" /> Add Artwork
        </button>
      </div>

      {/* ফ্রি টিয়ার নোটিশ ব্যানার (ইউজার যদি অলরেডি ৩টি আপলোড করে ফেলে) */}
      {userTier === "free" && artworks.length >= 3 && (
        <div className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <p className="leading-relaxed">
            ⚠️ You have utilized <strong>{artworks.length}/3 slots</strong> of your Free limits. Delete an item or upgrade to register unlimited masterpieces.
          </p>
         <button onClick={handleUpgradePlanClick} className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg hover:bg-amber-600 transition flex items-center gap-1 shrink-0 cursor-pointer uppercase tracking-wider text-[10px]">
            <FaCrown size={11}/> Upgrade Plan
          </button>

        </div>
      )}

      <div className="w-full border-t border-slate-800 my-6"></div>

      {dbLoading ? (
        <div className="flex justify-center items-center py-24 text-indigo-500">
          <FaSpinner className="animate-spin text-3xl" />
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-28 text-sm font-medium text-slate-500 tracking-wide">
          No artworks uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art) => (
            <div key={art._id} className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-md group">
              <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-4">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-800 rounded-md text-indigo-400">{art.category}</span>
                <h3 className="text-base font-bold text-white mt-2 truncate">{art.title}</h3>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800">
                  <span className="text-sm font-black text-indigo-400">${art.price}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditClick(art)} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer">
                      <FaEdit size={14}/>
                    </button>
                    <button onClick={() => openDeleteModal(art._id)} className="p-2 text-rose-400 hover:text-rose-500 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                      <FaTrash size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-500/10 text-rose-500">
              <FaExclamationTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Delete Artwork</h3>
              <p className="text-sm text-slate-400 mt-2">
                Are you sure you want to delete this artwork? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                disabled={deleteLoading}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl transition text-sm cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? <FaSpinner className="animate-spin" /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}