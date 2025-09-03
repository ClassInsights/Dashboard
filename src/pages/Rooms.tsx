import RoomList from "@/components/rooms/RoomList";
import Title from "@/components/Title";

const Rooms = () => {
  return (
    <>
      <Title
        title="Raumverwaltung"
        subtitle="Hier können Sie die automatische Raumzuweisung mithilfe von Active Directory Organisationseinheiten einstellen und ClassInsights für bestimmte Räume verwalten verwalten."
        backLink="/"
      />
      <RoomList />
    </>
  );
};

export default Rooms;
