import { useMemo } from "react";
import Header from "../Header";
import { useData } from "@/app/contexts/DataContext";
import { useSearchParams } from "next/navigation";

const PageContent = () => {
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

  return (
    <>
      <Header title={room.longName} previousPath="/" />
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3"></div>
    </>
  );
};

export default PageContent;
