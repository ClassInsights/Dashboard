import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../general/Header";
import { useData } from "@/app/contexts/DataContext";
import Computer from "../../types/computer";
import Image from "next/image";
import ComputerWidget from "./ComputerWidget";
import { useAlert } from "@/app/contexts/AlertContext";
import { useRatelimit } from "@/app/contexts/RatelimitContext";
import FetchError from "@/app/enums/fetchError";

const PageContent = ({ roomId }: { roomId: number }) => {
  const [leftComputers, setLeftComputers] = useState<Computer[]>([]);
  const [rightComputers, setRightComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);

  const data = useData();
  const alert = useAlert();
  const ratelimit = useRatelimit();

  const room = useMemo(
    () => data.rooms?.find((room) => room.id === roomId),
    [data, roomId],
  );

  useEffect(() => {
    if (!room) return;
    if (data.computers.find((computer) => computer.roomId === room.id)) return;
    data.fetchComputers(room?.id, true).then((response) => {
      if (response === FetchError.Unknown)
        alert.show("Etwas ist schiefgelaufen");
      else if (response === FetchError.Ratelimited)
        alert.show("Du hast zu oft aktualisiert");
    });
  }, [room, alert, data]);

  const computers = useMemo(
    () =>
      data.computers
        ?.filter((computer) => computer.roomId === room?.id)
        .sort((a, b) => +(+a.isOnline < +b.isOnline)),
    [data.computers, room],
  );

  const weightOfComputer = useCallback((computer: Computer) => {
    const details = [
      computer.ipAddress,
      computer.macAddress,
      computer.lastUser,
    ];
    const weight = details.filter((detail) => detail !== null).length + 5;
    return weight;
  }, []);

  useEffect(() => {
    var leftWeight = 0;
    var rightWeight = 0;
    const newLeftComputers: Computer[] = [];
    const newRightComputers: Computer[] = [];

    const sortedComputers = computers?.sort(
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
    if (computers) setLoading(false);
  }, [computers, weightOfComputer]);

  const reloadComputers = useCallback(async () => {
    if (!room) return;
    var hasFinished = false;
    const timeout = setTimeout(() => !hasFinished && setLoading(true), 500);
    const result = await data.fetchComputers(roomId);
    hasFinished = true;
    setLoading(false);
    if (result === FetchError.Unknown) {
      alert.show("Etwas ist schiefgelaufen");
      return;
    }
    if (result === FetchError.Ratelimited) {
      const limit = ratelimit.getRatelimit("fetchComputers");
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
    alert.show("Computer wurden aktualisiert");
  }, [room, data, alert, ratelimit, roomId]);

  if (!room) {
    alert.show("Raum nicht gefunden");
    return;
  }

  return (
    <>
      <div className="hidden md:block">
        <Header
          title={room.longName}
          previousPath="/rooms"
          reloadAction={reloadComputers}
        />
      </div>
      <div className="block md:hidden">
        <Header
          title={room.name}
          previousPath="/rooms"
          reloadAction={reloadComputers}
        />
      </div>
      <h2 className="mb-2 w-full select-none">Registrierte Computer</h2>
      <div className="w-full">
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
        ) : computers.length == 0 ? (
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
    </>
  );
};

export default PageContent;
