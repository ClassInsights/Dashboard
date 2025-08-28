import useComputers from "@/hooks/use-computers";
import useRooms from "@/hooks/use-rooms";
import type { Prettify } from "@/lib/utils";
import type { Computer } from "@/types/Computer";
import { createContext, useContext, useState } from "react";

type SearchContextType = {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  result: SearchResult[];
  generateResult: (value: string) => void;
};

type SearchResult = Prettify<
  Computer & {
    room: string;
    text: string;
    matchStart: number;
    matchLength: number;
  }
>;

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<SearchResult[]>([]);

  const { data: computers } = useComputers();
  const { data: rooms } = useRooms();

  const openSearch = () => setIsOpen(true);
  const closeSearch = () => {
    setIsOpen(false);
    setTimeout(() => setResult([]), 200);

    // TODO: CHECK IF RESULT RESET WORKS, also check if the text input gets reset; MAYBE add a key with date to CommandDialog so it gets rebuild (reset input state; )
  };

  const generateResult = (value: string) => {
    const searchTerm = value.trim().toLowerCase();
    if (!computers || computers.length === 0) return;

    if (!searchTerm) {
      setResult([]);
      return;
    }

    const filteredComputers = computers.filter((computer) => {
      const nameMatch = computer.name.includesIgnoreCase(searchTerm);
      const ipMatch = computer.ipAddress.includesIgnoreCase(searchTerm);
      const macMatch = computer.macAddress.formatAsMac().includesIgnoreCase(searchTerm);
      const userMatch = computer.lastUser.includesIgnoreCase(searchTerm);

      return nameMatch || ipMatch || macMatch || userMatch;
    });

    const searchResults: SearchResult[] = filteredComputers.map((computer) => {
      const nameMatch = computer.name.toLowerCase().indexOf(searchTerm);
      const ipMatch = computer.ipAddress.toLowerCase().indexOf(searchTerm);
      const macMatch = computer.macAddress.formatAsMac().toLowerCase().indexOf(searchTerm);
      const userMatch = computer.lastUser.toLowerCase().indexOf(searchTerm);

      const matchStart = Math.min(
        ...[nameMatch, ipMatch, macMatch, userMatch].filter((match) => match >= 0),
      );

      let text = "";
      if (nameMatch >= 0) text = computer.name;
      else if (ipMatch >= 0) text = computer.ipAddress;
      else if (macMatch >= 0) text = computer.macAddress.formatAsMac();
      else if (userMatch >= 0) text = computer.lastUser;

      const matchLength = searchTerm.length;

      const room = rooms?.find((room) => room.roomId === computer.roomId)?.displayName ?? "???";

      return {
        ...computer,
        room,
        text,
        matchStart,
        matchLength,
      };
    });

    const sortedResults = searchResults
      .sort((a, b) => (a.matchLength > b.matchLength ? -1 : 1))
      .slice(0, 5);

    setResult(sortedResults);
  };

  return (
    <SearchContext.Provider value={{ isOpen, openSearch, closeSearch, result, generateResult }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};
