"use client";
import { useState, useEffect } from "react";
import {
  FaCloudUploadAlt,
  FaSpinner,
  FaArrowLeft,
  FaMagic,
  FaPalette,
  FaTags,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function ArtworkForm({ user, editData, onSuccess, onCancel }) {
  const isEditMode = !!editData;
  const [submitLoading, setSubmitLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMetadata, setAiMetadata] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Painting",
    imageUrlLink: "",
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
        imageUrlLink: editData.image || "",
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
      setAiMetadata(null);
    }
  };

  // Convert file to base64 helper
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // AI Vision Auto-Tagger Handler
  const handleAIVisionAutotag = async () => {
    if (!imageFile && !formData.imageUrlLink && !imagePreview) {
      toast.warning("Please upload an image or provide an image link first! 🖼️");
      return;
    }

    setAiLoading(true);
    try {
      let payload = {};
      if (imageFile) {
        const base64Data = await fileToBase64(imageFile);
        payload.imageBase64 = base64Data;
      } else if (formData.imageUrlLink || imagePreview) {
        payload.imageUrl = formData.imageUrlLink || imagePreview;
      }

      const res = await fetch("/api/ai/vision-autotag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        const d = resData.data;
        setFormData((prev) => ({
          ...prev,
          title: d.title || prev.title,
          description: d.description || prev.description,
          category: d.category || prev.category,
          price: d.price || prev.price,
        }));
        setAiMetadata(d);
        toast.success("✨ AI analysis complete! Title, details & pricing auto-filled.");
      } else {
        toast.error("AI vision could not process this image.");
      }
    } catch (err) {
      console.error("AI Autotag error:", err);
      toast.error("AI Vision service encountered an error.");
    } finally {
      setAiLoading(false);
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

      const url = isEditMode
        ? `${baseUrl}/api/artworks/${editData._id}`
        : `${baseUrl}/api/artworks`;
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

      if (
        res.ok &&
        (result.acknowledged || result.success || result.modifiedCount > 0)
      ) {
        toast.success(
          isEditMode
            ? "Artwork updated successfully! 🎉"
            : "Artwork saved successfully! 🎉"
        );
        onSuccess();
      } else {
        toast.error(
          result.error || result.message || "Database operation failed!"
        );
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
      {/* Form Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-wide">
            {isEditMode ? "Edit Artwork" : "Upload New Artwork"}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            List your masterpiece on ArtHub with instant AI assistant capabilities
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700"
        >
          <FaArrowLeft className="text-[10px]" /> Back to List
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column - Details */}
        <div className="lg:col-span-7 space-y-5">
          {/* AI Banner */}
          <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900/60 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
                <FaMagic className="text-sm animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wide">
                  AI Vision Auto-Fill
                </h4>
                <p className="text-[11px] text-slate-400">
                  Select an image and let AI craft title, description, and pricing
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAIVisionAutotag}
              disabled={aiLoading || (!imagePreview && !formData.imageUrlLink)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-900/30 whitespace-nowrap"
            >
              {aiLoading ? (
                <>
                  <FaSpinner className="animate-spin text-xs" /> Analyzing...
                </>
              ) : (
                <>
                  <FaMagic className="text-xs" /> Auto-Fill Info
                </>
              )}
            </button>
          </div>

          {/* AI Metadata Tags Preview */}
          {aiMetadata && (
            <div className="bg-[#131d33]/80 border border-purple-500/30 rounded-2xl p-3.5 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-300 font-semibold flex items-center gap-1.5">
                  <FaPalette className="text-xs" /> Detected Mood:{" "}
                  <span className="text-white font-bold">{aiMetadata.mood || "Artistic"}</span>
                </span>
                {aiMetadata.primaryColors && (
                  <span className="text-[11px] text-slate-400">
                    Colors: {aiMetadata.primaryColors.join(", ")}
                  </span>
                )}
              </div>
              {aiMetadata.tags && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {aiMetadata.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-md border border-purple-800/40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
              Artwork Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Neon Horizon"
              className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
              Description
            </label>
            <textarea
              name="description"
              required
              rows="5"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the medium, design system, inspiration, or backstory..."
              className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer transition-all"
              >
                <option value="Painting">Painting</option>
                <option value="Digital">Digital Art</option>
                <option value="Sculpture">Sculpture</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
                Price ($ USD)
              </label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleInputChange}
                placeholder="250"
                className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Image Upload & Link */}
        <div className="lg:col-span-5 space-y-5 h-full flex flex-col">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
              Artwork Image File
            </label>
            <label className="group relative border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] bg-[#111827]/60 transition-all overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="absolute inset-0 w-full h-full p-2 bg-[#111827]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-3xl text-slate-500 group-hover:text-indigo-400 transition-colors mb-3" />
                  <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                    CLICK TO SELECT LOCAL FILE
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </>
              )}
            </label>
          </div>

          <div className="relative flex py-2 items-center justify-center">
            <div className="flex-grow border-t border-slate-800/60"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              OR
            </span>
            <div className="flex-grow border-t border-slate-800/60"></div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
              Image URL Link
            </label>
            <input
              type="url"
              name="imageUrlLink"
              value={formData.imageUrlLink}
              onChange={(e) => {
                handleInputChange(e);
                setImagePreview(e.target.value);
              }}
              disabled={imageFile !== null}
              placeholder="https://unsplash.com/... or imgBB link"
              className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none disabled:opacity-30 transition-all"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="col-span-1 lg:col-span-12 border-t border-slate-800/60 pt-5 mt-4">
          <button
            type="submit"
            disabled={submitLoading}
            className="bg-[#5c3ef2] hover:bg-[#4c30d3] disabled:bg-purple-900/50 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
          >
            {submitLoading ? (
              <>
                <FaSpinner className="animate-spin text-sm" /> Processing...
              </>
            ) : isEditMode ? (
              "Update Artwork"
            ) : (
              "Save Artwork"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}