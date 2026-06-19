"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; // Better Auth ক্লায়েন্ট
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaArtstation, FaUserCircle, FaThLarge } from "react-icons/fa"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Better Auth সেশন হুক
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // ফিক্সড লিংক: সব রোল এখন সরাসরি একটি সিঙ্গেল ড্যাশবোর্ড পেজেই যাবে
  const getDashboardLink = () => {
    return "/dashboard";
  };

  // লগআউট হ্যান্ডলার
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

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* লোগো */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl text-[#7c3aed]"
          >
            <FaArtstation className="text-3xl" />
            <span>
              Art<span className="text-gray-900">Hub</span>
            </span>
          </Link>

          {/* ডেস্কটপ মেনু */}
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <Link href="/artworks" className="hover:text-[#7c3aed] transition">
              Browse Art
            </Link>
            <Link href="/artists" className="hover:text-[#7c3aed] transition">
              Artists
            </Link>
            <Link
              href="/exhibitions"
              className="hover:text-[#7c3aed] transition"
            >
              Exhibitions
            </Link>

            {/* লগইন থাকলে ডেস্কটপ মেনুতে ড্যাশবোর্ড শর্টকাট */}
            {!isPending && user && (
              <Link
                href={getDashboardLink()}
                className="text-[#7c3aed] font-semibold hover:opacity-80 transition flex items-center gap-1.5"
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
                  <div className="flex items-center gap-3">
                    {/* প্রোফাইল ব্যাজটি ক্লিকেবল এবং এটি সরাসরি ড্যাশবোর্ডে নিয়ে যাবে */}
                    <Link 
                      href={getDashboardLink()} 
                      className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full text-sm transition group"
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
                      <span className="font-medium text-gray-700">
                        {user.name}
                      </span>
                      <span className="bg-purple-100 text-[#7c3aed] text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                        {user.role || "user"}
                      </span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-[#7c3aed] font-medium transition px-4 py-2"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      className="bg-slate-950 hover:bg-slate-900 text-white px-5 py-2 rounded-xl font-semibold shadow-sm transition"
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
              className="text-gray-700 text-2xl focus:outline-none cursor-pointer"
            >
              {isOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-3 font-medium text-gray-600 animate-fadeIn">
          <Link
            href="/artworks"
            onClick={() => setIsOpen(false)}
            className="block py-2 hover:text-[#7c3aed]"
          >
            Browse Art
          </Link>
          <Link
            href="/artists"
            onClick={() => setIsOpen(false)}
            className="block py-2 hover:text-[#7c3aed]"
          >
            Artists
          </Link>
          <Link
            href="/exhibitions"
            onClick={() => setIsOpen(false)}
            className="block py-2 hover:text-[#7c3aed]"
          >
            Exhibitions
          </Link>

          {!isPending && user && (
            <Link
              href={getDashboardLink()}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-[#7c3aed] font-semibold border-t border-gray-50 pt-2"
            >
              Go to Dashboard ({user.role || "user"})
            </Link>
          )}

          <div className="border-t border-gray-100 pt-3">
            {!isPending && (
              <>
                {user ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>Logged in as:</span>
                      <span className="font-bold text-gray-700">
                        {user.name}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center border border-gray-200 py-2.5 rounded-xl text-gray-700 font-medium"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center bg-slate-950 text-white py-2.5 rounded-xl font-medium"
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