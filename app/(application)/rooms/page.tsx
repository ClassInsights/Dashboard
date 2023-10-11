"use client";

import { useData } from "@/app/contexts/DataContext";
import Header from "../../components/Header";
import { useRouter, useSearchParams } from "next/navigation";
import PageContent from "@/app/components/RoomPageContent";
import ContainerPreset from "@/app/components/containers/ContainerPreset";
import Image from "next/image";

export default function RoomOverviewPage() {
  const router = useRouter();
  const query = useSearchParams();

  const data = useData();

  if (
    query.get("id") !== null &&
    data.rooms?.find((room) => room.id === parseInt(query.get("id") ?? ""))
  )
    return <PageContent />;

  return (
    <>
      <Header
        title="Räume"
        subtitle="Hier siehst du alle Räume der Schule mit registrierten Geräten."
        previousPath="/"
        action={
          <div
            className="dark:bg-primary-dark flex-shrink-0 flex-grow cursor-pointer rounded-md bg-primary p-1.5"
            onClick={() => data.reloadRooms()}
          >
            <Image
              src="/refresh.svg"
              alt="Refresh rooms"
              height={15}
              width={15}
              className="dark:onBackground-light onBackground-dark h-5 w-5"
              draggable={false}
            />
          </div>
        }
      />
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
    </>
  );
}
