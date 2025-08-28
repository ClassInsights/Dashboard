import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPlatformShortcut,
} from "@/components/ui/command";
import { useSearch } from "@/contexts/SearchContext";
import { Computer, Home, PanelLeft, School, Settings } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSidebar } from "./ui/sidebar";

const CommandMenu = () => {
  const { isOpen, openSearch, closeSearch, result, generateResult } = useSearch();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        if (!isOpen) openSearch();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen]);

  return (
    <CommandDialog
      key={isOpen ? "open" : "closed"}
      open={isOpen}
      onOpenChange={(open) => {
        if (open) openSearch();
        else closeSearch();
      }}
    >
      <CommandInput
        placeholder="Suchbegriff oder Befehl eingeben..."
        onValueChange={generateResult}
        defaultValue={undefined}
      />
      <CommandList>
        <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
        <CommandGroup heading="Computer">
          {result.length > 0 ? (
            result.map((result) => (
              <CommandItem
                key={result.computerId}
                value={`${result.name},${result.room},${result.ipAddress},${result.macAddress.formatAsMac()},${result.lastUser}`}
                onSelect={() => {
                  closeSearch();
                  navigate(`/computer/${result.computerId}`);
                }}
              >
                <Computer />
                <span>
                  {result.name} ({result.room})
                </span>
                <span className="ml-2 font-medium">
                  <span>{result.text.slice(0, result.matchStart)}</span>
                  <span className="text-primary">
                    {result.text.slice(result.matchStart, result.matchStart + result.matchLength)}
                  </span>
                  {result.text.slice(result.matchStart + result.matchLength)}
                </span>
              </CommandItem>
            ))
          ) : (
            <div data-slot="command-empty" className="py-2 text-center text-sm">
              Suche nach Name, IP-Adresse, MAC-Adresse oder Benutzer
            </div>
          )}
        </CommandGroup>
        <CommandGroup heading="Befehle">
          <CommandItem
            onSelect={() => {
              closeSearch();
              navigate("/");
            }}
          >
            <Home />
            <span>Startseite öffnen</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              closeSearch();
              navigate("/computer");
            }}
          >
            <Computer />
            <span>Computer öffnen</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              closeSearch();
              navigate("/konfiguration");
            }}
          >
            <Settings />
            <span>Konfiguration öffnen</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              closeSearch();
              navigate("/raumverwaltung");
            }}
          >
            <School />
            <span>Raumverwaltung öffnen</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              closeSearch();
              toggleSidebar();
            }}
          >
            <PanelLeft />
            <span>Seitenleiste umschalten</span>
            <CommandPlatformShortcut triggerKey="B" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandMenu;
