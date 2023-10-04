"use client";

import { useRoom } from "@/app/contexts/RoomContext";
import Link from "next/link";

const Page = () => {
  const room = useRoom();
  return (
    <>
      <h1 className="select-light dark:select-dark text-onBackground dark:text-dark-onBackground">
        Räume
        <Link href="./details" onClick={() => room.switchRoom(0)}>
          Öffne Raum 0
        </Link>
      </h1>
    </>
  );
};

export default Page;
