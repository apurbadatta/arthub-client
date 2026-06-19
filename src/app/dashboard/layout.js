"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@heroui/react";

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
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-3">
        <Spinner size="lg" color="secondary" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  return <div className="w-full min-h-screen bg-slate-50">{children}</div>;
}