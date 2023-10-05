"use client";

import { useData } from "@/app/contexts/DataContext";
import Header from "../../components/Header";
import Container from "@/app/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PageContent from "@/app/components/room/PageContent";

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
      />
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {data.rooms?.map((room, index) => (
          <Container
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
