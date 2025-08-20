import { useSearch } from "@/contexts/SearchContext";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "./ui/button";

const Search = () => {
  const { openSearch } = useSearch();
  return (
    <Button variant="ghost" onClick={openSearch}>
      <SearchIcon />
      <p className="hidden lg:block">Suche</p>
      <span className="sr-only">Suche öffnen</span>
    </Button>
  );
};

export default Search;
