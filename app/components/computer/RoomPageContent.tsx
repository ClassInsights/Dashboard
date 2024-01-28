import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../general/Header";
import Computer from "../../types/computer";
import Image from "next/image";
import ComputerWidget from "./ComputerWidget";
import { useRooms } from "@/app/contexts/RoomContext";
import { useComputers } from "@/app/contexts/ComputerContext";
import LoadingCircle from "../general/LoadingCircle";
import { useRouter } from "next/navigation";

const PageContent = ({ roomId }: { roomId: number }) => {
  const [leftComputers, setLeftComputers] = useState<Computer[]>([]);
  const [rightComputers, setRightComputers] = useState<Computer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const roomData = useRooms();
  const computerData = useComputers();
  const router = useRouter();

  const room = useMemo(
    () => roomData.rooms?.find((room) => room.id === roomId),
    [roomData, roomId],
  );

  const computers = useMemo(() => {
    return computerData.computers.filter(
      (computer: Computer) => computer.roomId === roomId,
    );
  }, [computerData.computers, roomId]);

  useEffect(() => {
    if (!room) return;
    if (computers.length > 0) return;
    computerData.fetchComputers(roomId);
  }, [roomId, room]);

  const weightOfComputer = useCallback((computer: Computer) => {
    const details = [
      computer.ipAddress,
      computer.macAddress,
      computer.lastUser,
    ];
    return details.filter((detail) => detail).length + 5;
  }, []);

  useEffect(() => {
    var leftWeight = 0;
    var rightWeight = 0;
    const newLeftComputers: Computer[] = [];
    const newRightComputers: Computer[] = [];

    const sortedComputers = computers
      ?.sort((first, second) =>
        first.isOnline === second.isOnline ? 0 : first.isOnline ? -1 : 1,
      )
      .sort(
        (first, second) => weightOfComputer(second) - weightOfComputer(first),
      );

    sortedComputers.forEach((computer) => {
      if (leftWeight <= rightWeight) {
        newLeftComputers.push(computer);
        leftWeight += weightOfComputer(computer);
      } else {
        newRightComputers.push(computer);
        rightWeight += weightOfComputer(computer);
      }
    });

    setLeftComputers(newLeftComputers);
    setRightComputers(newRightComputers);
    setIsLoading(false);
  }, [computers, weightOfComputer]);

  useEffect(() => {
    if (!room && !roomData.isLoading) router.push("/rooms");
  }, [room, roomData.isLoading, router]);

  if (!room) return <LoadingCircle />;

  return (
    <div key={roomId}>
      <div className="hidden md:block">
        <Header
          title={room.longName}
          previousPath="/rooms"
          reloadAction={() => computerData.refreshComputers(room.id)}
        />
      </div>
      <div className="block md:hidden">
        <Header
          title={room.name}
          previousPath="/rooms"
          reloadAction={() => computerData.refreshComputers(room.id)}
        />
      </div>
      <h2 className="mb-2 w-full select-none">Registrierte Computer</h2>
      <div className="w-full">
        {computerData.isLoading || isLoading ? (
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
        ) : computers.length === 0 && !computerData.isLoading && !isLoading ? (
          <h3>Keine Computer gefunden!</h3>
        ) : (
          <div className="w-full">
            <div className="flex w-full flex-col gap-4 sm:hidden">
              {computers.map((computer, index) => (
                <ComputerWidget computer={computer} key={`s-${index}`} />
              ))}
            </div>
            <div className="hidden w-full gap-4 sm:flex">
              <div className="flex w-full flex-col gap-4">
                {leftComputers.map((computer, index) => (
                  <ComputerWidget computer={computer} key={`l-${index}`} />
                ))}
              </div>
              <div className="flex w-full flex-col gap-4">
                {rightComputers.map((computer, index) => (
                  <ComputerWidget computer={computer} key={`r-${index}`} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageContent;
