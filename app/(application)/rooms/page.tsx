"use client";

import { useEffect, useMemo, useState } from "react";
import { FetchError, useData } from "@/app/contexts/DataContext";
import Header from "../../components/general/Header";
import { useRouter, useSearchParams } from "next/navigation";
import PageContent from "@/app/components/computer/RoomPageContent";
import ContainerPreset from "@/app/components/containers/ContainerPreset";
import Image from "next/image";
import { useAlert } from "@/app/contexts/AlertContext";
import { useRatelimit } from "@/app/contexts/RatelimitContext";

export default function RoomOverviewPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const query = useSearchParams();

  const alert = useAlert();
  const data = useData();
  const ratelimit = useRatelimit();

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
          const timeout = setTimeout(
            () => !hasFinished && setLoading(true),
            500,
          );
          const result = await data.fetchRooms();
          hasFinished = true;
          setLoading(false);
          if (result === FetchError.Unknown) {
            alert.show("Etwas ist schiefgelaufen");
            return;
          }
          if (result === FetchError.Ratelimited) {
            const limit = ratelimit.getRatelimit("fetchRooms");
            if (!limit) {
              alert.show("Etwas ist schiefgelaufen");
              return;
            }
            const secondsLeft = Math.ceil(
              (limit.startedAt.getTime() + limit.duration - Date.now()) / 1000,
            );
            alert.show(
              `Warte noch ${secondsLeft} ${
                secondsLeft === 1 ? "Sekunde" : "Sekunden"
              } zum Aktualisieren`,
            );
            clearTimeout(timeout);
            return;
          }
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
