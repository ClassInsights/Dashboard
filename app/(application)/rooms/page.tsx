"use client";

import { useEffect, useMemo, useState } from "react";
import { useData } from "@/app/contexts/DataContext";
import Header from "../../components/general/Header";
import { useRouter, useSearchParams } from "next/navigation";
import PageContent from "@/app/components/computer/RoomPageContent";
import ContainerPreset from "@/app/components/containers/ContainerPreset";
import Image from "next/image";
import { useAlert } from "@/app/contexts/AlertContext";

export default function RoomOverviewPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const query = useSearchParams();

  const alert = useAlert();
  const data = useData();

  const roomId = useMemo(
    () => (query.get("id") ? parseInt(query.get("id")!) : undefined),
    [query],
  );

  if (roomId) {
    console.log("RoomId: ", roomId);
    if (!data.rooms?.find((room) => room.id === roomId)) {
      window.history.pushState({}, "", "/rooms");
      return;
    } else return <PageContent />;
  }

  return (
    <>
      <Header
        title="Räume"
        subtitle="Hier siehst du alle Räume der Schule mit registrierten Geräten."
        previousPath="/"
        reloadAction={async () => {
          var hasFinished = false;
          setTimeout(() => !hasFinished && setLoading(true), 500);
          await data.fetchRooms();
          hasFinished = true;
          setLoading(false);
          alert.show("Räume wurden aktualisiert");
        }}
      />
      {loading ? (
        <div className="flex h-32 w-full items-center justify-center">
          <Image
            src="/progress.svg"
            height={20}
            width={20}
            alt="progess indicator"
            draggable={false}
            className="onBackground-light dark:onBackground-dark h-10 w-10 animate-spin"
          />
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {data.rooms?.map((room, index) => (
            <ContainerPreset
              key={index}
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
