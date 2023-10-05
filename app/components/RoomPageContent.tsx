import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { useData } from "@/app/contexts/DataContext";
import { useSearchParams } from "next/navigation";
import Container from "./containers/Container";
import Computer from "../types/computer";
import ComputerDetail from "./ComputerDetail";
import Image from "next/image";

const PageContent = () => {
  const [leftComputers, setLeftComputers] = useState<Computer[]>([]);
  const [rightComputers, setRightComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);

  const query = useSearchParams();
  const data = useData();

  const room = useMemo(
    () =>
      data.rooms?.find((room) => room.id === parseInt(query.get("id") ?? "")),
    [query],
  );

  const computers = useMemo(
    () => data.computers?.filter((computer) => computer.roomId === room?.id),
    [data.computers, room],
  );

  const weightOfComputer = useCallback((computer: Computer) => {
    const details = [
      computer.ipAddress,
      computer.macAddress,
      computer.lastUser,
    ];
    const weight = details.filter((detail) => detail != null).length + 5;
    return weight;
  }, []);

  const getComputerWidget = useCallback(
    (computer: Computer, key: string) => (
      <Container key={key}>
        <div className="mb-1.5 flex justify-between">
          <h3>{computer.name}</h3>
          {computer.online ? (
            <div className="flex gap-2">
              <p>Online</p>
            </div>
          ) : (
            <div>Offline</div>
          )}
        </div>
        <ComputerDetail
          value={computer.online ? "Online" : "Offline"}
          iconPath="/status.svg"
          altText="Status Icon"
        />
        {computer.lastUser && (
          <ComputerDetail
            value={computer.lastUser}
            iconPath="/user.svg"
            altText="User Icon"
          />
        )}
        {computer.ipAddress && (
          <ComputerDetail
            value={computer.ipAddress}
            iconPath="/network.svg"
            altText="IP-Address Icon"
          />
        )}
        {computer.macAddress && (
          <ComputerDetail
            value={computer.macAddress}
            iconPath="/computer.svg"
            altText="Mac-Address Icon"
          />
        )}
      </Container>
    ),
    [],
  );

  var sortedComputers = useMemo(
    () =>
      computers?.sort(
        (first, second) => weightOfComputer(second) - weightOfComputer(first),
      ),
    [computers, weightOfComputer],
  );

  useEffect(() => {
    var leftWeight = 0;
    var rightWeight = 0;
    const newLeftComputers: Computer[] = [];
    const newRightComputers: Computer[] = [];

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
    console.log(leftWeight, rightWeight);
  }, [sortedComputers, weightOfComputer]);

  if (!room) {
    query.delete();
    return;
  }

  return (
    <>
      <div className="hidden md:block">
        <Header title={room.longName} previousPath="/rooms" />
      </div>
      <div className="block md:hidden">
        <Header title={room.name} previousPath="/rooms" />
      </div>
      {computers.length == 0 ? (
        <h3>Keine Computer gefunden!</h3>
      ) : (
        <div className="w-full">
          <div className="flex w-full flex-col gap-4 sm:hidden">
            {computers.map((computer, index) =>
              getComputerWidget(computer, `s-${index}`),
            )}
          </div>
          <div className="hidden w-full gap-4 sm:flex">
            <div className="flex w-full flex-col gap-4">
              {leftComputers.map((computer, index) =>
                getComputerWidget(computer, `l-${index}`),
              )}
            </div>
            <div className="flex w-full flex-col gap-4">
              {rightComputers.map((computer, index) =>
                getComputerWidget(computer, `r-${index}`),
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageContent;
