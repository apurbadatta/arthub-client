"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArtworkRow from "./_components/ArtworkRow";
import DeleteModal from "./_components/DeleteModal";
import { authClient } from "@/lib/auth-client";

export default function ManageArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchAllArtworks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/admin/artworks`);
      const result = await res.json();
      if (result.success) setArtworks(result.data);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllArtworks();
  }, [baseUrl]);

  const handleApprove = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`${baseUrl}/api/admin/approve-artwork/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setArtworks((prev) => prev.map((art) => (art._id === id ? { ...art, status: "approved" } : art)));
      }
    } catch (error) {
      toast.error("Approval failed");
    } finally {
      setActionLoadingId(null);
    }
  };

 
  const openDeleteModal = (art) => {
    setSelectedArt(art);
    setIsModalOpen(true);
  };


 const handleConfirmDelete = async () => {
  if (!selectedArt) return;

  setIsDeleting(true);

  try {
    const { data: tokenData } = await authClient.token();

    const res = await fetch(
      `${baseUrl}/api/artworks/${selectedArt._id}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${tokenData?.token}`,
        },
      }
    );

    if (res.ok) {
      toast.success("Artwork deleted successfully!");
      setArtworks((prev) =>
        prev.filter((art) => art._id !== selectedArt._id)
      );
      setIsModalOpen(false);
    }
  } catch (error) {
    toast.error("Deletion failed");
  } finally {
    setIsDeleting(false);
    setSelectedArt(null);
  }
};

  return (
    <div className="w-full min-h-screen text-slate-200 p-6 space-y-6">
      <ToastContainer theme="dark" position="top-right" />

      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Manage Artworks</h1>
      </div>

      <div className="w-full border-t border-slate-800/60 my-2"></div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 text-indigo-500">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-slate-500">Loading masterworks registry...</p>
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-[#0b0f19]">
          No artworks submitted yet.
        </div>
      ) : (
        <div className="bg-[#0b111e] border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-[#111827]/60 tracking-wider">
                  <th className="py-4 px-6">Artwork Image & Title</th>
                  <th className="py-4 px-6">Artist Name</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {artworks.map((art) => (
                  <ArtworkRow 
                    key={art._id} 
                    art={art} 
                    onApprove={handleApprove} 
                    onDeleteClick={openDeleteModal} 
                    actionLoadingId={actionLoadingId} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DeleteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmDelete} 
        artTitle={selectedArt?.title || ""} 
        isDeleting={isDeleting} 
      />
    </div>
  );
}