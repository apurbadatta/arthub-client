"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Button, Spinner, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { 
  FaUser, FaPalette, FaUsers, FaPlus, 
  FaShoppingBag, FaHistory, FaChartLine, FaDollarSign, FaSignOutAlt 
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  
  // হিরোইউ মডেল কন্ট্রোল (আর্টওয়ার্ক অ্যাড করার জন্য)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // একটিভ ট্যাব স্টেট (সাইডবার মেনু চেঞ্জের জন্য)
  const [activeTab, setActiveTab] = useState("profile");

  // ফর্ম স্টেট
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/login");
        },
      },
    });
  };

  if (isPending || !session) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center bg-white gap-3">
        <Spinner size="lg" color="secondary" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col md:flex-row bg-slate-50 w-full">
      
      {/* 📊 বাম পাশের সাইডবার (Sidebar) */}
      <div className="w-full md:w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigation</h3>
            <p className="text-sm font-bold text-[#7c3aed] bg-purple-50 px-2 py-1 rounded capitalize">{user?.role || "user"} Workspace</p>
          </div>

          <div className="flex flex-col gap-2">
            {/* সাধারণ প্রোফাইল ট্যাব (সবার জন্য) */}
            <button 
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left cursor-pointer ${activeTab === "profile" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <FaUser /> Profile Overview
            </button>

            {/* 🛒 BUYER (USER) মেনু */}
            {(user?.role === "user" || !user?.role) && (
              <button 
                onClick={() => setActiveTab("purchases")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left cursor-pointer ${activeTab === "purchases" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                <FaShoppingBag /> My Purchases
              </button>
            )}

            {/* 🎨 ARTIST মেনু */}
            {user?.role === "artist" && (
              <>
                <button 
                  onClick={() => setActiveTab("gallery")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left cursor-pointer ${activeTab === "gallery" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <FaPalette /> My Gallery
                </button>
                <button 
                  onClick={() => setActiveTab("sales")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left cursor-pointer ${activeTab === "sales" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <FaHistory /> Sales History
                </button>
              </>
            )}

            {/* 👑 ADMIN মেনু */}
            {user?.role === "admin" && (
              <button 
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition w-full text-left cursor-pointer ${activeTab === "analytics" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                <FaChartLine /> Platform Analytics
              </button>
            )}
          </div>
        </div>

        {/* সাইডবার লগআউট বাটন */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition w-full text-left mt-8 cursor-pointer border-t border-slate-100 pt-4"
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>

      {/* 🖥️ ডান পাশের ডায়নামিক কন্টেন্ট সেকশন (Content Area) */}
      <div className="flex-1 p-6 md:p-10 w-full overflow-y-auto">
        
        {/* TAB 1: Profile Overview */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-50 text-[#7c3aed] rounded-full text-2xl">
                  {user?.role === "artist" ? <FaPalette /> : <FaUser />}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-950">Welcome, {user?.name}!</h1>
                  <p className="text-slate-500 text-sm">{user?.email}</p>
                </div>
              </div>
              {user?.role === "artist" && (
                <Button onPress={onOpen} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl shadow-md flex items-center gap-2 py-5 px-4 cursor-pointer">
                  <FaPlus /> Add New Artwork
                </Button>
              )}
            </div>

            {/* ইউজারদের জন্য সাবস্ক্রিপশন প্ল্যান ওভারভিউ */}
            {(user?.role === "user" || !user?.role) && (
              <div>
                <h2 className="text-lg font-bold text-slate-950 mb-4">Subscription Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-white border border-slate-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase">Free Tier</span>
                    <p className="text-2xl font-black text-slate-950 my-2">$0</p>
                    <p className="text-xs text-slate-500">Max Purchases: 3 paintings</p>
                  </Card>
                  <Card className="p-6 bg-white border-2 border-[#7c3aed] shadow-sm">
                    <span className="text-xs font-bold text-[#7c3aed] uppercase">Pro Tier</span>
                    <p className="text-2xl font-black text-purple-950 my-2">$9.99/mo</p>
                    <p className="text-xs text-purple-700 font-medium">Max Purchases: 9 paintings</p>
                  </Card>
                  <Card className="p-6 bg-white border border-slate-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-400 uppercase">Premium Tier</span>
                    <p className="text-2xl font-black text-slate-950 my-2">$19.99/mo</p>
                    <p className="text-xs text-slate-500">Max Purchases: Unlimited</p>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: My Purchases (User) */}
        {activeTab === "purchases" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950 mb-4 flex items-center gap-2"><FaShoppingBag /> My Purchases</h2>
            <div className="text-center py-16 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">No purchases found.</div>
          </div>
        )}

        {/* TAB 3: My Gallery (Artist) */}
        {activeTab === "gallery" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2"><FaPalette /> My Gallery Collection</h2>
              <Button onPress={onOpen} size="sm" className="bg-[#7c3aed] text-white font-bold rounded-lg cursor-pointer"><FaPlus /> Add Art</Button>
            </div>
            <div className="text-center py-16 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">No artworks uploaded yet.</div>
          </div>
        )}

        {/* TAB 4: Sales History (Artist) */}
        {activeTab === "sales" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950 mb-4 flex items-center gap-2"><FaHistory /> Sales Report</h2>
            <div className="text-center py-16 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">Your sales ledger is currently empty.</div>
          </div>
        )}

        {/* TAB 5: Platform Analytics (Admin) */}
        {activeTab === "analytics" && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-5 bg-white border border-slate-100 shadow-sm flex flex-row items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-xl text-xl"><FaUsers /></div>
                <div><p className="text-xs font-bold text-slate-400 uppercase">Total Users</p><h3 className="text-xl font-black text-slate-950">0</h3></div>
              </Card>
              <Card className="p-5 bg-white border border-slate-100 shadow-sm flex flex-row items-center gap-4">
                <div className="p-4 bg-purple-50 text-[#7c3aed] rounded-xl text-xl"><FaPalette /></div>
                <div><p className="text-xs font-bold text-slate-400 uppercase">Total Artists</p><h3 className="text-xl font-black text-slate-950">0</h3></div>
              </Card>
              <Card className="p-5 bg-white border border-slate-100 shadow-sm flex flex-row items-center gap-4">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-xl"><FaChartLine /></div>
                <div><p className="text-xs font-bold text-slate-400 uppercase">Artworks Sold</p><h3 className="text-xl font-black text-slate-950">0</h3></div>
              </Card>
              <Card className="p-5 bg-white border border-slate-100 shadow-sm flex flex-row items-center gap-4">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-xl text-xl"><FaDollarSign /></div>
                <div><p className="text-xs font-bold text-slate-400 uppercase">Total Revenue</p><h3 className="text-xl font-black text-slate-950">$0.00</h3></div>
              </Card>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950 mb-4">Admin Control panel</h2>
              <div className="text-center py-16 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">System overview data loading...</div>
            </div>
          </div>
        )}

      </div>

      {/* 🖼️ ARTWORK ADD MODAL (পপ-আপ ফর্ম) */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur" className="max-w-md mx-4">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-black text-slate-950">Add New Artwork</ModalHeader>
              <ModalBody className="space-y-4">
                <Input label="Artwork Title" placeholder="Enter title" variant="bordered" radius="xl" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Input label="Price ($)" type="number" placeholder="0.00" variant="bordered" radius="xl" value={price} onChange={(e) => setPrice(e.target.value)} />
                <Select label="Select Category" variant="bordered" radius="xl" placeholder="Choose a style" onChange={(e) => setCategory(e.target.value)}>
                  <SelectItem key="painting" value="painting">Painting</SelectItem>
                  <SelectItem key="digital" value="digital">Digital Art</SelectItem>
                  <SelectItem key="sculpture" value="sculpture">Sculpture</SelectItem>
                </Select>
                <Textarea label="Description" placeholder="Tell us about your masterpiece..." variant="bordered" radius="xl" value={description} onChange={(e) => setDescription(e.target.value)} />
                
                {/* ইমেজ আপলোডার এরিয়া */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-[#7c3aed] transition bg-slate-50/50">
                  <input type="file" id="artImage" className="hidden" accept="image/*" />
                  <label htmlFor="artImage" className="cursor-pointer text-xs font-medium text-slate-500 flex flex-col items-center gap-1">
                    <FaPlus className="text-lg text-[#7c3aed]" />
                    <span>Upload Artwork Image</span>
                  </label>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" radius="xl" className="font-bold cursor-pointer" onPress={onClose}>Cancel</Button>
                <Button className="bg-[#7c3aed] text-white font-bold radius-xl px-6 cursor-pointer" onPress={() => { toast.success("Artwork saved!"); onClose(); }}>Upload Art</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}