import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { useData } from "@/app/contexts/DataContext";
import { useSearchParams } from "next/navigation";
import Container from "./containers/Container";
import Computer from "../types/computer";
import ComputerDetail from "./ComputerDetail";

const PageContent = () => {
  const [leftComputers, setLeftComputers] = useState<Computer[]>([]);
  const [rightComputers, setRightComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);

  const query = useSearchParams();
  const data = useData();

  const room = useMemo(
    () =>
      data.rooms?.find((room) => room.id === parseInt(query.get("id") ?? "")),
    [data.rooms, query],
  );

  if (!room) {
    query.delete();
    return;
  }

  const computers = useMemo(
    () => data.computers?.filter((computer) => computer.roomId === room.id),
    [data.computers, room],
  );

  const weightOfComputer = useCallback((computer: Computer) => {
    const details = [
      computer.ipAddress,
      computer.macAddress,
      computer.lastUser,
    ];
    const weight = details.filter((detail) => detail != null).length + 1;
    return weight;
  }, []);

  var sortedComputers = computers?.sort(
    (first, second) => weightOfComputer(second) - weightOfComputer(first),
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
  }, [computers]);

  const getComputerWidget = useCallback(
    (computer: Computer, key: string) => (
      <Container key={key}>
        <h3 className="mb-1">{computer.name}</h3>
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

  return (
    <>
      <Header title={room.longName} previousPath="/rooms" />
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
