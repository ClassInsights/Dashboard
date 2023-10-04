"use client";

import Header from "@/app/components/Header";
import { useRoom } from "@/app/contexts/RoomContext";
import Link from "next/link";

const Page = () => {
  const room = useRoom();
  return (
    <>
      <Header
        title="Räume"
        subtitle="Hier siehst du alle Räume der Schule mit registrierten Geräten."
        previousPath="/"
      />
    </>
  );
};

export default Page;
