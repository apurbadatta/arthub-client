"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@heroui/react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";



export default function DashboardLayout({ children }) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-3 bg-white">
        <Spinner size="lg" color="secondary" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <DashboardSidebar session={session} />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}