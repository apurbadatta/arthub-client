"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaCalendarAlt, FaCheckCircle, FaShoppingCart, FaArrowLeft, FaSpinner, FaComment, FaTrash, FaEdit, FaPaperPlane } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";
import DeleteModal from "../DeleteModal";

export default function ArtworkDetailsPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();
  const [buying, setBuying] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

 
  useEffect(() => {
    if (session?.user?.email && id) {
      const checkOwnership = async () => {
        try {
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

  const fetchComments = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/artworks/${id}/comments`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (id) fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`${baseUrl}/api/artworks/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id || session?.user?.email,
          userEmail: session?.user?.email,
          comment: newComment,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Comment added successfully! 💬");
        setNewComment("");
        fetchComments();
      } else {
        toast.error(data.message || "Failed to add comment.");
      }
    } catch (error) {
      toast.error("An error occurred while posting comment.");
    } finally {
      setSubmittingComment(false);
    }
  };


  const openDeleteModal = (commentId) => {
    setCommentToDelete(commentId);
    setIsModalOpen(true);
  };

 
  const handleCommentDelete = async () => {
    if (!commentToDelete) return;
    try {
      const res = await fetch(`${baseUrl}/api/comments/${commentToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: session?.user?.email }),
      });
      if (res.ok) {
        toast.success("Comment deleted successfully!");
        fetchComments();
      } else {
        toast.error("Failed to delete comment");
      }
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setIsModalOpen(false);
      setCommentToDelete(null);
    }
  };


  const handleCommentUpdate = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`${baseUrl}/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: editText,
          userEmail: session?.user?.email,
        }),
      });
      if (res.ok) {
        toast.success("Comment updated successfully!");
        setEditingCommentId(null);
        fetchComments();
      }
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };


  const handlePurchase = async () => {
    if (!session?.user) {
      toast.error("Please login first to purchase this artwork!");
      router.push("/login");
      return;
    }

    setBuying(true);
    try {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex justify-center items-center text-indigo-500">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

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

  const formattedDate = artwork.createdAt 
    ? new Date(artwork.createdAt).toLocaleDateString() 
    : "Recent";

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-8">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />

      <div className="max-w-6xl w-full mx-auto space-y-6">
    
        <button 
          onClick={() => router.back()} 
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer mb-4"
        >
          <FaArrowLeft size={10} /> Back to Gallery
        </button>

   
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d1424] border border-slate-900 rounded-3xl p-6 lg:p-8 shadow-2xl">
     
          <div className="lg:col-span-6 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 shadow-md">
            <img 
              src={artwork.image} 
              alt={artwork.title} 
              className="w-full h-full object-cover"
            />
          </div>

  
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold px-3 py-1 bg-indigo-950/60 border border-indigo-900/50 rounded-md text-indigo-400 tracking-wider">
                {artwork.category === "Digital" ? "Digital Art" : artwork.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <FaCalendarAlt size={12} /> {formattedDate}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {artwork.title}
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                {artwork.description || "No description provided for this premium masterpiece."}
              </p>
            </div>

            <div className="bg-[#11192a] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between max-w-lg">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-900/30 border border-indigo-500/20 flex items-center justify-center text-white font-bold overflow-hidden">
                  {artwork.artistName ? artwork.artistName.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Artist</span>
                  <span className="text-white font-bold text-sm sm:text-base">{artwork.artistName || "Unknown Artist"}</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-full">
                <FaCheckCircle size={10} /> Verified
              </span>
            </div>

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
                  <><FaSpinner className="animate-spin" size={14} /> Processing...</>
                ) : isPurchased ? (
                  <><FaCheckCircle size={14} /> Owned / Acquired</>
                ) : (
                  <><FaShoppingCart size={14} /> Buy Now with Stripe</>
                )}
              </button>
            </div>
          </div>
        </div>

 
        <div className="bg-[#0d1424] border border-slate-900 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <FaComment className="text-indigo-500" size={18} /> Artwork Reviews ({comments.length})
          </h2>

 
          {isPurchased ? (
            <form onSubmit={handleCommentSubmit} className="space-y-3 bg-[#11192a] border border-slate-800/60 p-4 rounded-2xl">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Leave a Review</label>
              <textarea
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your feedback about this purchased artwork..."
                className="w-full bg-[#162032] border border-slate-800 focus:border-indigo-500 text-white rounded-xl p-3 text-sm focus:outline-none transition resize-none"
              ></textarea>
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="bg-[#5c3ef2] hover:bg-[#4c30d3] disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                {submittingComment ? <FaSpinner className="animate-spin" /> : <FaPaperPlane size={12} />} Post Review
              </button>
            </form>
          ) : (
            <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-2xl text-center text-sm text-slate-400">
              🔒 Only verified buyers who purchased this artwork can leave a comment or review.
            </div>
          )}

  
          <div className="space-y-4 pt-2">
            {comments.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-4">No reviews on this artwork yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="bg-[#11192a]/40 border border-slate-900/60 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start gap-4 transition hover:border-slate-800">
                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300">{c.userEmail}</span>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Buyer</span>
                    </div>

                    {editingCommentId === c._id ? (
                      <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-xl">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-[#162032] border border-indigo-500 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                        />
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleCommentUpdate(c._id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer">Save</button>
                          <button onClick={() => setEditingCommentId(null)} className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold cursor-pointer">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-300 font-medium pt-1">{c.comment}</p>
                    )}
                  </div>

         
                  {session?.user?.email === c.userEmail && editingCommentId !== c._id && (
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-start">
                      <button
                        onClick={() => { setEditingCommentId(c._id); setEditText(c.comment); }}
                        className="text-slate-500 hover:text-indigo-400 transition p-1 cursor-pointer"
                        title="Edit Comment"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(c._id)}
                        className="text-slate-500 hover:text-rose-400 transition p-1 cursor-pointer"
                        title="Delete Comment"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>


      <DeleteModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setCommentToDelete(null); }} 
        onConfirm={handleCommentDelete} 
      />
    </div>
  );
}