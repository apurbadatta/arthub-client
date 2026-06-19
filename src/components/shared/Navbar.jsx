"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; // Better Auth 
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaArtstation, FaUserCircle, FaThLarge } from "react-icons/fa"; 
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Better Auth 
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // 
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          setIsOpen(false);
          router.push("/login");
        },
      },
    });
  };

  // 
  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* লোগো সেকশন */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl text-[#7c3aed]"
          >
            <FaArtstation className="text-3xl" />
            <span className="text-white">
              Art<span className="text-[#7c3aed]">Hub</span>
            </span>
          </Link>

          {/* ডেস্কটপ নেভিগেশন লিংকসমূহ */}
          <div className="hidden md:flex items-center gap-8 font-medium">
            <Link 
              href="/" 
              className={`transition ${isActive("/") ? "text-[#7c3aed] font-bold" : "text-slate-300 hover:text-[#7c3aed]"}`}
            >
              Home
            </Link>
            <Link 
              href="/artworks" 
              className={`transition ${isActive("/artworks") ? "text-[#7c3aed] font-bold" : "text-slate-300 hover:text-[#7c3aed]"}`}
            >
              Browse Artworks
            </Link>

            {/* ইউজার লগইন থাকলে ডেস্কটপ মেনুতে ড্যাশবোর্ড শর্টকাট দেখাবে */}
            {!isPending && user && (
              <Link
                href="/dashboard"
                className={`font-semibold transition flex items-center gap-1.5 ${isActive("/dashboard") ? "text-[#7c3aed]" : "text-slate-300 hover:text-[#7c3aed]"}`}
              >
                <FaThLarge className="text-sm" /> Dashboard
              </Link>
            )}
          </div>

          {/* লগইন / প্রোফাইল সেকশন (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {!isPending && (
              <>
                {user ? (
                  /* ইউজার লগইন থাকলে এই অংশটি রেন্ডার হবে */
                  <div className="flex items-center gap-3">
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full text-sm transition group border border-slate-700"
                    >
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-xl text-[#7c3aed] group-hover:scale-105 transition" />
                      )}
                      <span className="font-medium text-slate-200">
                        {user.name}
                      </span>
                      <span className="bg-purple-900/50 text-[#a78bfa] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-purple-700/50">
                        {user.role || "user"}
                      </span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="bg-red-950/40 hover:bg-red-900/60 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer border border-red-900/50"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  /* ইউজার লগইন না থাকলে (Guest) শুধুমাত্র এই বাটনগুলো দেখাবে */
                  <div className="flex items-center gap-3">
                    <Link
                      href="/login"
                      className="text-slate-300 hover:text-[#7c3aed] font-medium transition px-4 py-2"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2 rounded-xl font-semibold shadow-sm transition"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* মোবাইল হ্যামবার্গার বাটন */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 text-2xl focus:outline-none cursor-pointer hover:text-white"
            >
              {isOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {isOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-slate-800 px-4 pt-2 pb-4 space-y-3 font-medium text-slate-300 animate-fadeIn">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block py-2 ${isActive("/") ? "text-[#7c3aed] font-bold" : "hover:text-[#7c3aed]"}`}
          >
            Home
          </Link>
          <Link
            href="/artworks"
            onClick={() => setIsOpen(false)}
            className={`block py-2 ${isActive("/artworks") ? "text-[#7c3aed] font-bold" : "hover:text-[#7c3aed]"}`}
          >
            Browse Artworks
          </Link>

          {!isPending && user && (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`block py-2 font-semibold border-t border-slate-800 pt-2 ${isActive("/dashboard") ? "text-[#7c3aed]" : "text-[#7c3aed] hover:opacity-90"}`}
            >
              Go to Dashboard ({user.role || "user"})
            </Link>
          )}

          <div className="border-t border-slate-800 pt-3">
            {!isPending && (
              <>
                {user ? (
                  <div className="space-y-3">
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <span>Logged in as:</span>
                      <span className="font-bold text-slate-200">
                        {user.name}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center border border-slate-700 py-2.5 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center bg-[#7c3aed] hover:bg-[#6d28d9] text-white py-2.5 rounded-xl font-medium transition"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;