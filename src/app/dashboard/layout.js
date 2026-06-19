"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    // Login না থাকলে
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

    // নিজের route ছাড়া অন্য route এ গেলে block
    if (!pathname.startsWith(allowedRoute) && pathname !== "/dashboard") {
      router.replace(allowedRoute);
    }
  }, [session, isPending, pathname, router]);

  if (isPending || !session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <DashboardSidebar session={session} />

      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}