"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaCloudUploadAlt, FaSpinner, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageArtworks({ user }) {
  const [view, setView] = useState("list"); // 'list' অথবা 'add'
  const [artworks, setArtworks] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Painting",
    imageUrlLink: "" 
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  
  const fetchArtworks = async () => {
    setDbLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/artworks`); 
      const result = await res.json();
      
      if (Array.isArray(result)) {
        setArtworks(result);
      } else if (result.success || result.data) {
        setArtworks(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching artworks:", error);
      toast.error("Failed to load gallery data");
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ২. ImgBB + direct MongoDB submit handle
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
      
      const newArtworkData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        image: finalImageUrl,
        artistName: user?.name || "Apurba",
        artistEmail: user?.email || "artist@arthub.com",
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/artworks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtworkData),
      }
    );

      const result = await res.json();

      //  insertOne 
      if (result.acknowledged || result.success) {
        toast.success(" successfully! 🎉");
        
        // 
        setFormData({ title: "", description: "", price: "", category: "Painting", imageUrlLink: "" });
        setImageFile(null);
        setImagePreview(null);
        setView("list"); 
        fetchArtworks();  
      } else {
        toast.error(result.error || "Database saving failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong on the server!");
    } finally {
      setSubmitLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 
  // -------------------------------------------------------------
  if (view === "list") {
    return (
      <div className="w-full text-slate-200">
        <ToastContainer theme="dark" position="top-right" autoClose={3000} />
        <div className="flex justify-between items-center mb-1">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">My Artwork Gallery</h1>
            <p className="text-xs text-slate-400 mt-1">Create and publish art pieces for sale on the platform.</p>
          </div>
          <button 
            onClick={() => setView("add")}
            className="bg-[#5c3ef2] hover:bg-[#4c30d3] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/10 transition-all"
          >
            <FaPlus className="text-[10px]" /> Add Artwork
          </button>
        </div>

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
              <div key={art._id} className="bg-[#1a2333] border border-slate-800 rounded-2xl overflow-hidden shadow-md group">
                <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-800 rounded-md text-indigo-400">{art.category}</span>
                  <h3 className="text-base font-bold text-white mt-2 truncate">{art.title}</h3>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800">
                    <span className="text-sm font-black text-indigo-400">${art.price}</span>
                    <div className="flex gap-1">
                      <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"><FaEdit size={14}/></button>
                      <button className="p-2 text-rose-400 hover:text-rose-500 rounded-lg hover:bg-slate-800 transition"><FaTrash size={14}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // ভিউ ২: প্রিমিয়াম ডার্ক ফর্ম ভিউ (কালার অপ্টিমাইজড)
  // -------------------------------------------------------------
  return (
    <div className="w-full text-slate-200 animate-in fade-in duration-200">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      
      {/* ফর্ম হেডার */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white tracking-wide">Upload New Artwork</h1>
        <button 
          onClick={() => setView("list")}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
        >
          <FaArrowLeft className="text-[10px]" /> Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* বাম পাশের কলাম: ইনপুট ফিল্ডস */}
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

        {/* ডান পাশের কলাম: ফাইল ড্রপজোন ও ইউআরএল */}
        <div className="lg:col-span-5 space-y-5 h-full flex flex-col">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Artwork Image File</label>
            <label className="group relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[200px] bg-[#111827]/60 transition-all overflow-hidden">
              <input 
                type="file" accept="image/*" 
                onChange={handleImageChange}
                className="hidden" 
              />
              
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

        {/* বটম সেভ বাটন লাইনার */}
        <div className="col-span-1 lg:col-span-12 border-t border-slate-800/60 pt-5 mt-4">
          <button
            type="submit"
            disabled={submitLoading}
            className="bg-[#5c3ef2] hover:bg-[#4c30d3] disabled:bg-purple-900/50 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg shadow-purple-500/10 flex items-center gap-2 cursor-pointer transition-all"
          >
            {submitLoading ? (
              <><FaSpinner className="animate-spin text-sm" /> Saving Artwork...</>
            ) : (
              "Save Artwork"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}