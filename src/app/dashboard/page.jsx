"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@heroui/react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    const role = session?.user?.role;

    switch (role) {
      case "admin":
        router.replace("/dashboard/admin/manage-users");
        break;

      case "artist":
        router.replace("/dashboard/artist/manage-artworks");
        break;

      case "user":
        router.replace("/dashboard/user/purchase-history");
        break;

      default:
        router.replace("/");
    }
  }, [session, isPending, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" color="secondary" />
        <p className="text-gray-500 font-medium">
          Redirecting...
        </p>
      </div>
    </div>
  );
}