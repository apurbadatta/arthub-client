"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner, Card } from "@heroui/react";
import { 
  FaHistory, FaShoppingBag, FaUserCog, FaUserCircle, 
  FaPalette, FaPlus, FaUsers, FaChartLine, FaDollarSign, FaPieChart 
} from "react-icons/fa";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  
  //  (Default: user)
  const userRole = user?.role || "user"; 

  // role set
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (userRole) {
      // রোল অনুযায়ী প্রথম ট্যাবটি ডিফল্ট একটিভ হবে
      if (userRole === "user") setActiveTab("purchase_history");
      else if (userRole === "artist") setActiveTab("manage_artworks");
      else if (userRole === "admin") setActiveTab("manage_users");
    }
  }, [session, isPending, router, userRole]);

  if (isPending || !session) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center bg-white gap-3">
        <Spinner size="lg" color="secondary" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-700 p-4 md:p-10 flex flex-col justify-center items-center w-full">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8 items-start">
        
        
        <div className="w-full lg:w-80 bg-white border border-slate-100 rounded-3xl p-6 flex flex-col items-center shrink-0 shadow-sm">
          <div className="relative mb-4">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-28 h-28 rounded-full object-cover border-4 border-[#7c3aed]" />
            ) : (
              <FaUserCircle className="text-7xl text-slate-300" />
            )}
          </div>

          <h2 className="text-xl font-bold text-slate-900 text-center mb-1">{user?.name}</h2>
          <p className="text-xs text-slate-400 text-center mb-2">{user?.email}</p>
          <span className="bg-purple-100 text-[#7c3aed] text-[10px] uppercase font-black px-2.5 py-1 rounded-full border border-purple-200 mb-6">
            {userRole} Workspace
          </span>

          <div className="w-full border-t border-slate-100 mb-6"></div>

          {/* 🔘 */}
          <div className="flex flex-col gap-2 w-full">
            
            {/* 👤 BUYER (USER) TABS */}
            {userRole === "user" && (
              <>
                <button onClick={() => setActiveTab("purchase_history")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${activeTab === "purchase_history" ? "bg-[#7c3aed] text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
                  <FaHistory /> Purchase History
                </button>
                <button onClick={() => setActiveTab("bought_artworks")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${activeTab === "bought_artworks" ? "bg-[#7c3aed] text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
                  <FaShoppingBag /> Bought Artworks
                </button>
                <button onClick={() => setActiveTab("tier_overview")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${activeTab === "tier_overview" ? "bg-[#7c3aed] text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
                  <FaChartLine /> Subscription Tier
                </button>
              </>
            )}

            {/* 🎨 ARTIST TABS */}
            {userRole === "artist" && (
              <>
                <button onClick={() => setActiveTab("manage_artworks")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${activeTab === "manage_artworks" ? "bg-[#7c3aed] text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
                  <FaPalette /> Manage Artworks
                </button>
                <button onClick={() => setActiveTab("sales_history")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${activeTab === "sales_history" ? "bg-[#7c3aed] text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
                  <FaHistory /> Sales History
                </button>
              </>
            )}

            {/* 👑 ADMIN TABS */}
            {userRole === "admin" && (
              <>
                <button onClick={() => setActiveTab("manage_users")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${activeTab === "manage_users" ? "bg-[#7c3aed] text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
                  <FaUsers /> Manage Users
                </button>
                <button onClick={() => setActiveTab("admin_artworks")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${activeTab === "admin_artworks" ? "bg-[#7c3aed] text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
                  <FaPalette /> Manage All Artworks
                </button>
                <button onClick={() => setActiveTab("all_transactions")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${activeTab === "all_transactions" ? "bg-[#7c3aed] text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
                  <FaDollarSign /> View All Transactions
                </button>
                <button onClick={() => setActiveTab("admin_analytics")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${activeTab === "admin_analytics" ? "bg-[#7c3aed] text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
                  <FaChartLine /> Analytics & Charts
                </button>
              </>
            )}

            {/* */}
            <button onClick={() => setActiveTab("profile_management")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left cursor-pointer ${activeTab === "profile_management" ? "bg-[#7c3aed] text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
              <FaUserCog /> Profile Management
            </button>
          </div>
        </div>

        {/* */}
        <div className="flex-1 w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 min-h-[520px] flex flex-col shadow-sm">
          
          {/* ================= USER (BUYER) VIEWS ================= */}
          {activeTab === "purchase_history" && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Purchase History</h1>
              <p className="text-xs text-slate-400 mb-6">Table with artwork name, artist, price, purchase date.</p>
              <div className="w-full border-t border-slate-100 mb-6"></div>
              <p className="text-center py-20 text-sm text-slate-400">No purchase records found in table view.</p>
            </div>
          )}

          {activeTab === "bought_artworks" && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Bought Artworks</h1>
              <p className="text-xs text-slate-400 mb-6">Gallery view of purchased artworks (image, title, link to details).</p>
              <div className="w-full border-t border-slate-100 mb-6"></div>
              <p className="text-center py-20 text-sm text-slate-400">Your purchased gallery is empty.</p>
            </div>
          )}

          {activeTab === "tier_overview" && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Subscription Tier Overview</h1>
              <p className="text-xs text-slate-400 mb-6">Manage your current purchase tier allowance.</p>
              <div className="w-full border-t border-slate-100 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 bg-slate-50 border border-slate-200 shadow-none">
                  <span className="text-xs font-bold text-slate-400 uppercase">Free (Default)</span>
                  <p className="text-xl font-black text-slate-900 my-1">$0</p>
                  <p className="text-[11px] text-slate-500">Max Purchases: 3 paintings</p>
                </Card>
                <Card className="p-5 bg-white border-2 border-[#7c3aed] shadow-none">
                  <span className="text-xs font-bold text-[#7c3aed] uppercase">Pro</span>
                  <p className="text-xl font-black text-slate-900 my-1">$9.99/mo</p>
                  <p className="text-[11px] text-purple-700">Max Purchases: 9 paintings</p>
                </Card>
                <Card className="p-5 bg-slate-50 border border-slate-200 shadow-none">
                  <span className="text-xs font-bold text-slate-400 uppercase">Premium</span>
                  <p className="text-xl font-black text-slate-900 my-1">$19.99/mo</p>
                  <p className="text-[11px] text-slate-500">Max Purchases: Unlimited</p>
                </Card>
              </div>
            </div>
          )}

          {/* ================= ARTIST VIEWS ================= */}
          {activeTab === "manage_artworks" && (
            <div>
              <div className="flex justify-between items-start mb-1">
                <h1 className="text-2xl font-bold text-slate-900">Manage Artworks</h1>
                <button className="bg-[#7c3aed] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer hover:bg-[#6d28d9] shadow-sm">
                  <FaPlus /> Add Artwork
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-6">Table of own artworks with columns: title, price, actions (edit, delete).</p>
              <div className="w-full border-t border-slate-100 mb-6"></div>
              <p className="text-center py-20 text-sm text-slate-400">No artworks uploaded yet.</p>
            </div>
          )}

          {activeTab === "sales_history" && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Sales History</h1>
              <p className="text-xs text-slate-400 mb-6">Table: artwork title, buyer name, purchase date, amount.</p>
              <div className="w-full border-t border-slate-100 mb-6"></div>
              <p className="text-center py-20 text-sm text-slate-400">No sales transactions reported yet.</p>
            </div>
          )}

          {/* ================= ADMIN VIEWS ================= */}
          {activeTab === "manage_users" && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Manage Users</h1>
              <p className="text-xs text-slate-400 mb-6">Table: name, email, role, actions (change role to user/artist/admin).</p>
              <div className="w-full border-t border-slate-100 mb-6"></div>
              <p className="text-center py-20 text-sm text-slate-400">Loading user database...</p>
            </div>
          )}

          {activeTab === "admin_artworks" && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Manage All Artworks</h1>
              <p className="text-xs text-slate-400 mb-6">Table with title, artist name, price, actions (delete).</p>
              <div className="w-full border-t border-slate-100 mb-6"></div>
              <p className="text-center py-20 text-sm text-slate-400">No artworks submitted across the platform.</p>
            </div>
          )}

          {activeTab === "all_transactions" && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Platform Transactions</h1>
              <p className="text-xs text-slate-400 mb-6">Table: transaction ID, type, user/artist email, amount, date.</p>
              <div className="w-full border-t border-slate-100 mb-6"></div>
              <p className="text-center py-20 text-sm text-slate-400">No payment actions logged.</p>
            </div>
          )}

          {activeTab === "admin_analytics" && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Analytics Overview</h1>
              <p className="text-xs text-slate-400 mb-6">System wide analytics cards and charts.</p>
              <div className="w-full border-t border-slate-100 mb-6"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 bg-slate-50 border border-slate-100 shadow-none flex flex-row items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><FaUsers /></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Total Users</p><h3 className="text-base font-black">0</h3></div>
                </Card>
                <Card className="p-4 bg-slate-50 border border-slate-100 shadow-none flex flex-row items-center gap-3">
                  <div className="p-3 bg-purple-100 text-[#7c3aed] rounded-xl"><FaPalette /></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Total Artists</p><h3 className="text-base font-black">0</h3></div>
                </Card>
                <Card className="p-4 bg-slate-50 border border-slate-100 shadow-none flex flex-row items-center gap-3">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><FaChartLine /></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Sold Art</p><h3 className="text-base font-black">0</h3></div>
                </Card>
                <Card className="p-4 bg-slate-50 border border-slate-100 shadow-none flex flex-row items-center gap-3">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><FaDollarSign /></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Revenue</p><h3 className="text-base font-black">$0.00</h3></div>
                </Card>
              </div>

              <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 text-center text-xs text-slate-400 flex flex-col items-center gap-2 justify-center py-10">
                <FaPieChart className="text-2xl text-slate-300" />
                <span>Sales chart & Artworks by category pie chart (Placeholder)</span>
              </div>
            </div>
          )}

          {/* ================= COMMON: PROFILE MANAGEMENT ================= */}
          {activeTab === "profile_management" && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Profile Management</h1>
              <p className="text-xs text-slate-400 mb-6">Edit profile details and securely change password updates.</p>
              <div className="w-full border-t border-slate-100 mb-6"></div>
              <div className="max-w-xs space-y-3">
                <p className="text-sm font-medium">Name: <span className="text-slate-900 font-bold">{user?.name}</span></p>
                <p className="text-sm font-medium">Email: <span className="text-slate-900">{user?.email}</span></p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}