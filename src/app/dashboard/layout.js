"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { HiMenuAlt2 } from "react-icons/hi";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;


    if (!session) {
      router.replace("/login");
      return;
    }

    const role = session.user.role;

    // Role allowed route
    const roleRoutes = {
      admin: "/dashboard/admin",
      artist: "/dashboard/artist",
      user: "/dashboard/user",
    };

    const allowedRoute = roleRoutes[role];

    // Unknown role
    if (!allowedRoute) {
      router.replace("/");
      return;
    }


    if (!pathname.startsWith(allowedRoute) && pathname !== "/dashboard") {
      router.replace(allowedRoute);
    }
  }, [session, isPending, pathname, router]);

  if (isPending || !session) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#070b13]">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#070b13] text-slate-200">
      {/* Sidebar for Desktop & Mobile */}
      <DashboardSidebar
        session={session}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-[#070b13]">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-[#0b0f19] border-b border-slate-800/80 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white tracking-tight">
              Art<span className="text-[#8b5cf6]">Hub</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white bg-slate-900/60 rounded-xl border border-slate-800/80 focus:outline-none transition cursor-pointer"
          >
            <HiMenuAlt2 size={20} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}