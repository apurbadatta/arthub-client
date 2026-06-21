"use client";
import { authClient } from "@/lib/auth-client";
import ManageArtworks from "@/components/artist/ManageArtworks";
import { Spinner } from "@heroui/react";

export default function ArtistManageArtworksPage() {
  const { data: session, isPending, refetch } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-48 w-full">
        <Spinner color="secondary" size="md" />
      </div>
    );
  }

  return <ManageArtworks user={session?.user} refetch={refetch} />;
}

