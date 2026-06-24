"use client";
import { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
export default function ArtworkForm({ user, editData, onSuccess, onCancel }) {
  const isEditMode = !!editData;
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Painting",
    imageUrlLink: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

 
  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        price: editData.price || "",
        category: editData.category || "Painting",
        imageUrlLink: editData.image || ""
      });
      setImagePreview(editData.image || null);
    }
  }, [editData, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, imageUrlLink: "" })); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalImageUrl = formData.imageUrlLink;


    if (imageFile) {
      setSubmitLoading(true);
      try {
        const imgFormData = new FormData();
        imgFormData.append("image", imageFile);

        const imgBBRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          { method: "POST", body: imgFormData }
        );
        const imgBBData = await imgBBRes.json();

        if (!imgBBData.success) throw new Error("Image upload to ImgBB failed!");
        finalImageUrl = imgBBData.data.url;
      } catch (error) {
        toast.error(error.message || "Image upload failed!");
        setSubmitLoading(false);
        return;
      }
    }

    if (!finalImageUrl) {
      toast.warning("Please upload an image file or provide an image link!");
      return;
    }

    setSubmitLoading(true);
    try {
      const artworkData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        image: finalImageUrl,
        artistName: user?.name || editData?.artistName || "Apurba",
        artistEmail: user?.email || editData?.artistEmail || "artist@arthub.com",
      };

   
      const url = isEditMode ? `${baseUrl}/api/artworks/${editData._id}` : `${baseUrl}/api/artworks`;
      const method = isEditMode ? "PUT" : "POST";
      const { data: tokenData } = await authClient.token();

     const res = await fetch(url, {
  method: method,
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${tokenData?.token}`,
  },
  body: JSON.stringify(artworkData),
});

      const result = await res.json();

      if (res.ok && (result.acknowledged || result.success || result.modifiedCount > 0)) {
        toast.success(isEditMode ? "Artwork updated successfully! 🎉" : "Artwork saved successfully! 🎉");
        onSuccess(); 
      } else {
       
        toast.error(result.error || result.message || "Database operation failed!");
      }


    } catch (error) {
      console.error(error);
      toast.error("Something went wrong on the server!");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full text-slate-200 animate-in fade-in duration-200">
      {/* ফর্ম হেডার */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-black tracking-wide">
          {isEditMode ? "Edit Artwork" : "Upload New Artwork"}
        </h1>
        <button 
          onClick={onCancel}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
        >
          <FaArrowLeft className="text-[10px]" /> Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
        <div className="lg:col-span-7 space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Artwork Title</label>
            <input 
              type="text" name="title" required value={formData.title} onChange={handleInputChange}
              placeholder="e.g. Neon Horizon"
              className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Description</label>
            <textarea 
              name="description" required rows="5" value={formData.description} onChange={handleInputChange}
              placeholder="Describe the medium, design system, inspiration, or backstory..."
              className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Category</label>
              <select 
                name="category" value={formData.category} onChange={handleInputChange}
                className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer transition-all"
              >
                <option value="Painting">Painting</option>
                <option value="Digital">Digital Art</option>
                <option value="Sculpture">Sculpture</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Price ($ USD)</label>
              <input 
                type="number" name="price" required value={formData.price} onChange={handleInputChange}
                placeholder="250"
                className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

     
        <div className="lg:col-span-5 space-y-5 h-full flex flex-col">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Artwork Image File</label>
            <label className="group relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[200px] bg-[#111827]/60 transition-all overflow-hidden">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              
              {imagePreview ? (
                <div className="absolute inset-0 w-full h-full p-2 bg-[#111827]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                </div>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-3xl text-slate-500 group-hover:text-indigo-400 transition-colors mb-3" />
                  <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">CLICK TO SELECT LOCAL FILE</p>
                  <p className="text-[10px] text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                </>
              )}
            </label>
          </div>

          <div className="relative flex py-2 items-center justify-center">
            <div className="flex-grow border-t border-slate-800/60"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">OR</span>
            <div className="flex-grow border-t border-slate-800/60"></div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Image URL Link</label>
            <input 
              type="url" name="imageUrlLink" value={formData.imageUrlLink} onChange={handleInputChange}
              disabled={imageFile !== null}
              placeholder="https://unsplash.com/... or imgBB link"
              className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none disabled:opacity-30 transition-all"
            />
          </div>
        </div>

    
        <div className="col-span-1 lg:col-span-12 border-t border-slate-800/60 pt-5 mt-4">
          <button
            type="submit"
            disabled={submitLoading}
            className="bg-[#5c3ef2] hover:bg-[#4c30d3] disabled:bg-purple-900/50 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
          >
            {submitLoading ? (
              <><FaSpinner className="animate-spin text-sm" /> Processing...</>
            ) : (
              isEditMode ? "Update Artwork" : "Save Artwork"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}