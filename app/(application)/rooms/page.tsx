"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/general/Header";
import { useRouter, useSearchParams } from "next/navigation";
import PageContent from "@/app/components/computer/RoomPageContent";
import ContainerPreset from "@/app/components/containers/ContainerPreset";
import { useRooms } from "@/app/contexts/RoomContext";
import LoadingCircle from "@/app/components/general/LoadingCircle";

export default function RoomOverviewPage() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const query = useSearchParams();
  const roomData = useRooms();

  useEffect(() => {
    if (roomData.rooms) setLoading(false);
  }, [roomData.rooms]);

  const roomId = useMemo(
    () => (query.get("id") ? parseInt(query.get("id")!) : undefined),
    [query],
  );

  if (roomId) return <PageContent roomId={roomId} />;

  return (
    <>
      <Header
        title="Räume"
        subtitle="Hier siehst du alle Räume der Schule mit registrierten Geräten."
        previousPath="/"
        reloadAction={roomData.refreshRooms}
      />
      {loading ? (
        <LoadingCircle />
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {roomData.rooms?.map((room) => (
            <ContainerPreset
              key={room.id}
              label={`${room.deviceCount} ${
                room.deviceCount <= 1 ? "Gerät" : "Geräte"
              }`}
              title={room.name}
              onClick={() => router.push(`/rooms?id=${room.id}`)}
              showArrow
            />
          ))}
        </div>
      )}
    </>
  );
}
