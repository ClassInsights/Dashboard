import { RoomProvider } from "../../contexts/RoomContext";

export default function Page({ children }: { children: React.ReactNode }) {
  return <RoomProvider>{children}</RoomProvider>;
}
