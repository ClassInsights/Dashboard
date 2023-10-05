import { useMemo, useState } from "react";
import Header from "./Header";
import { useData } from "@/app/contexts/DataContext";
import { useSearchParams } from "next/navigation";
import Container from "./containers/Container";
import ComputerDetail from "./ComputerDetail";

const PageContent = () => {
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

  return (
    <>
      <Header title={room.longName} previousPath="/rooms" />
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {computers.length == 0 ? (
          <h3>Keine Computer gefunden!</h3>
        ) : (
          computers.map((computer, index) => (
            <Container key={index}>
              <h3>{computer.name}</h3>
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
                  altText="IP Adress Icon"
                />
              )}
              {computer.macAddress && (
                <ComputerDetail
                  value={computer.macAddress}
                  iconPath="/computer.svg"
                  altText="Mac Adress Icon"
                />
              )}
            </Container>
          ))
        )}
      </div>
    </>
  );
};

export default PageContent;
