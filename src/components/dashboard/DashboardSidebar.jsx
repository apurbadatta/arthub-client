"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaImages, 
  FaHistory, 
  FaUser, 
  FaShoppingBag, 
  FaCrown, 
  FaUsers, 
  FaCreditCard, 
  FaChartPie, 
  FaHome, 
  FaSignOutAlt, 
  FaArtstation,
  FaTimes
} from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function DashboardSidebar({ session, isOpen, onClose }) {
  const pathname = usePathname();
  const role = session?.user?.role || "user";
  const user = session?.user;

  const menus = {
    artist: [
      {
        title: "Manage Artworks",
        href: "/dashboard/artist/manage-artworks",
      },
      {
        title: "Sales History",
        href: "/dashboard/artist/sales-history",
      },
      {
        title: "Profile",
        href: "/dashboard/artist/profile",
      },
    ],

    user: [
      {
        title: "Purchase History",
        href: "/dashboard/user/purchase-history",
      },
      {
        title: "Bought Artworks",
        href: "/dashboard/user/bought-artworks",
      },
      {
        title: "Subscription",
        href: "/dashboard/user/subscription",
      },
      {
        title: "Profile",
        href: "/dashboard/user/profile",
      },
    ],

    admin: [
      {
        title: "Manage Users",
        href: "/dashboard/admin/manage-users",
      },
      {
        title: "Manage Artworks",
        href: "/dashboard/admin/manage-artworks",
      },
      {
        title: "Transactions",
        href: "/dashboard/admin/transactions",
      },
      {
        title: "Analytics",
        href: "/dashboard/admin/analytics",
      },
      {
        title: "Profile",
        href: "/dashboard/admin/profile",
      },
    ],
  };

  const links = menus[role] || [];

  const getIcon = (title) => {
    const normalized = title.toLowerCase();
    if (normalized.includes("artworks") || normalized.includes("art")) return <FaImages size={14} />;
    if (normalized.includes("history") || normalized.includes("sales")) return <FaHistory size={14} />;
    if (normalized.includes("profile")) return <FaUser size={14} />;
    if (normalized.includes("bought")) return <FaShoppingBag size={14} />;
    if (normalized.includes("subscription")) return <FaCrown size={14} />;
    if (normalized.includes("users")) return <FaUsers size={14} />;
    if (normalized.includes("transactions")) return <FaCreditCard size={14} />;
    if (normalized.includes("analytics")) return <FaChartPie size={14} />;
    return <FaImages size={14} />;
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            window.location.href = "/login";
          },
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0b0f19] border-r border-slate-800/80 flex flex-col justify-between p-6 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-7">
          {/* Logo & Close button */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 font-black text-2xl text-[#8b5cf6]">
              <FaArtstation className="text-3xl animate-pulse" />
              <span className="text-white">
                Art<span className="text-[#8b5cf6]">Hub</span>
              </span>
            </Link>
            {/* Close button for mobile screen */}
            <button 
              onClick={onClose}
              className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 rounded-lg transition cursor-pointer"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* User profile section like in design image */}
          <div className="flex items-center gap-3.5 p-1 py-2 border-t border-b border-slate-800/50">
            <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-indigo-500 shadow-md">
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt={user.name} 
                  className="w-11 h-11 rounded-full object-cover border border-[#0b0f19]"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-[#0b0f19]">
                  {user?.name ? user.name[0].toUpperCase() : "A"}
                </div>
              )}
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-sm font-extrabold text-white truncate tracking-wide">{user?.name || "Artist"}</p>
              <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{role}</p>
            </div>
          </div>

          {/* Navigation link group */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">Navigation</p>
            <nav className="flex flex-col gap-1.5">
              {links.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 border ${
                      active
                        ? "bg-gradient-to-r from-[#201538] to-[#120a22] border-purple-500/20 shadow-md"
                        : "border-transparent hover:bg-slate-900/40 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rounded icon box */}
                      <div className={`p-2 rounded-xl border transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-tr from-purple-600 to-pink-500 border-purple-400/20 text-white shadow-lg shadow-purple-500/10"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:border-slate-700/60"
                      }`}>
                        {getIcon(item.title)}
                      </div>
                      <span className={`text-xs font-bold tracking-wide ${active ? "text-white" : ""}`}>
                        {item.title}
                      </span>
                    </div>

                    {/* Glowing pink/purple dot for selected item */}
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-lg shadow-pink-500/60" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom items */}
        <div className="space-y-2 border-t border-slate-800/60 pt-4">
          <Link
            href="/"
            className="group flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent transition-all duration-200"
          >
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:border-slate-700/60">
              <FaHome size={14} />
            </div>
            <span className="text-xs font-bold tracking-wide">Back to Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent transition-all duration-200 cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-red-950/20 border border-red-900/30 text-red-400 group-hover:text-red-300 group-hover:border-red-800/40">
              <FaSignOutAlt size={14} />
            </div>
            <span className="text-xs font-bold tracking-wide">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}