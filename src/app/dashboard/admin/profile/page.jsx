"use client";
import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaIdBadge, FaCloudUploadAlt, FaSpinner, FaSave } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";

export default function AdminProfile({ user }) {
  const { data: session, isPending: sessionLoading, refetch } = authClient.useSession();
  const sessionUser = session?.user;

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
    profileStyle: "", 
    avatar: ""
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    let userId = user?._id || user?.uid || user?.id || sessionUser?.id || sessionUser?._id;
    let fallbackName = user?.name || sessionUser?.name || "";
    let fallbackEmail = user?.email || sessionUser?.email || "";

    if (!userId) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser?._id || parsedUser?.uid || parsedUser?.id;
          if (!fallbackName) fallbackName = parsedUser?.name || "";
          if (!fallbackEmail) fallbackEmail = parsedUser?.email || "";
        } catch (e) {
          console.error("Localstorage read error", e);
        }
      }
    }

    if (!userId) {
      if (!sessionLoading) {
        setFormData({
          name: fallbackName,
          email: fallbackEmail,
          role: "admin",
          profileStyle: "",
          avatar: ""
        });
      }
      return;
    }

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/profile?id=${userId}`);
        if (!res.ok) throw new Error("Server error");

        const result = await res.json();
        if (result.success && result.data) {
          const userData = result.data;
          setFormData({
            name: userData.name || fallbackName,
            email: userData.email || fallbackEmail,
            role: userData.role || "admin",
            profileStyle: userData.profileStyle || "",
            avatar: userData.avatar || ""
          });
          setImagePreview(userData.avatar || null);
        } else {
          setFormData((prev) => ({
            ...prev,
            name: fallbackName,
            email: fallbackEmail,
          }));
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setFormData((prev) => ({
          ...prev,
          name: fallbackName,
          email: fallbackEmail,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, baseUrl, sessionUser, sessionLoading]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let userId = user?._id || user?.uid || user?.id || sessionUser?.id || sessionUser?._id;
    if (!userId) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        userId = parsed?._id || parsed?.uid || parsed?.id;
      }
    }
    
    if (!userId) {
      toast.error("User Unique ID not found! Check Console for Auth Details.");
      return;
    }
    
    setSubmitLoading(true);
    let finalAvatarUrl = formData.avatar;

    if (imageFile) {
      try {
        const imgFormData = new FormData();
        imgFormData.append("image", imageFile);

        const imgBBRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          { method: "POST", body: imgFormData }
        );
        const imgBBData = await imgBBRes.json();
        if (!imgBBData.success) throw new Error("Avatar upload failed!");
        finalAvatarUrl = imgBBData.data.url;
      } catch (error) {
        toast.error("Image upload failed!");
        setSubmitLoading(false);
        return;
      }
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        profileStyle: formData.profileStyle,
        avatar: finalAvatarUrl
      };

      const res = await fetch(`${baseUrl}/api/profile/update?id=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        try {
          await authClient.updateUser({
            name: formData.name,
            image: finalAvatarUrl,
            role: formData.role
          });
          await refetch();
        } catch (authErr) {
          console.error("Failed to sync auth session:", authErr);
        }

        toast.success("Profile saved and synced successfully! 🎉");
        
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.name = formData.name;
          parsed.role = formData.role;
          localStorage.setItem("user", JSON.stringify(parsed));
        }

        if (formData.role !== sessionUser?.role) {
          toast.info(`Role changed to ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}. Redirecting...`);
          setTimeout(() => {
            window.location.href = `/dashboard/${formData.role}/profile`;
          }, 2000);
        }
      } else {
        toast.error(result.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Server error during update!");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full text-slate-200 max-w-4xl min-h-[500px]">
      <ToastContainer theme="dark" position="top-right" autoClose={3000} />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile Management</h1>
        <p className="text-xs text-slate-400 mt-1">Update your personal profile details, account settings, and control your global system role.</p>
      </div>

      <div className="w-full border-t border-slate-800 my-6"></div>

      {loading || sessionLoading ? (
        <div className="flex flex-col justify-center items-center py-24 text-indigo-500 space-y-3">
          <FaSpinner className="animate-spin text-3xl" />
          <p className="text-xs text-slate-500">Fetching accurate data records...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-4 flex flex-col items-center space-y-4 bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center w-full">Profile Avatar</label>
            <div className="relative group w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-all bg-slate-900 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-4xl text-slate-600" />
              )}
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all">
                <FaCloudUploadAlt className="text-xl text-white mb-1" />
                <span className="text-[9px] font-bold text-slate-300">UPLOAD</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            <p className="text-[10px] text-slate-500 text-center">Recommend square size (PNG, JPG).</p>
          </div>

          <div className="md:col-span-8 space-y-5 bg-[#111827] border border-slate-800 rounded-2xl p-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FaUser className="text-slate-500 text-xs" /> Full Name
              </label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-[#0b0f19] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"/>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FaEnvelope className="text-slate-500 text-xs" /> Email Address
              </label>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-[#0b0f19] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"/>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FaIdBadge className="text-slate-500 text-xs" /> System Account Role
              </label>
              <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-[#0b0f19] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer transition-all">
                {sessionUser?.role === "admin" && (
                  <option value="admin">Admin (System Control)</option>
                )}
                <option value="artist">Artist (Sell & Showcase Art)</option>
                <option value="user">User / Buyer (Browse & Buy Art)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Artistic Bio</label>
              <textarea name="profileStyle" rows="3" value={formData.profileStyle} onChange={handleInputChange} placeholder="Describe your signature artistic style..." className="w-full bg-[#0b0f19] border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none resize-none transition-all"/>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex justify-end">
              <button type="submit" disabled={submitLoading} className="bg-[#5c3ef2] hover:bg-[#4c30d3] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all w-full sm:w-auto justify-center">
                {submitLoading ? <><FaSpinner className="animate-spin text-sm" /> Updating...</> : <><FaSave size={12} /> Save Changes</>}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}