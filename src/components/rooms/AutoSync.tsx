import useActiveDirectory from "@/hooks/use-activeDirectory";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const AutoSync = () => {
  const { data: credentials, updateAutoSync } = useActiveDirectory();

  const handleChange = (isEnabled: boolean) => {
    if (!credentials) return;
    updateAutoSync(isEnabled);
  };

  if (!credentials) return null;

  return (
    <>
      <h2 className="pb-1.5">Automatische Raumzuweisung</h2>
      <p className="md:w-3/4">
        Dadurch, dass ClassInsights nun Zugriff auf die Active Directory Organisationseinheiten hat,
        gibt es zwei Zuweisungsmodi:
      </p>
      <ul className="mt-2">
        <li>
          <span className="font-bold">
            Option 1: Automatische Zuweisung für alle Computer ohne Raum.
          </span>{" "}
          Sobald ein Computer einem Raum zugewiesen wurde, ändert sich diese Zuweisung nicht mehr
          automatisch, auch wenn man den Computer manuell in eine andere Active Directory
          Organisationseinheit verschiebt.
        </li>
        <li className="mt-1">
          <span className="font-bold">
            Option 2 (Empfohlen): Automatische Zuweisung für alle Computer (inkl. Synchronisation)
          </span>{" "}
          Änderungen an den Organisationseinheiten werden automatisch übernommen. Dies ist besonders
          dann empfohlen, wenn eine gute Active Directory Struktur vorliegt.{" "}
          <span className="font-medium">
            Wenn diese Option gewählt ist, ist die manuelle Raumzuweisung nicht mehr möglich!
          </span>
        </li>
      </ul>
      <ToggleGroup
        type="single"
        variant="outline"
        className="mt-6"
        disabled={!credentials}
        defaultValue={credentials?.ldapAutoSync ? "on" : "off"}
        onValueChange={(value) => handleChange(value === "on")}
      >
        <ToggleGroupItem value="off" size="lg">
          Ohne Synchronisation (Option 1)
        </ToggleGroupItem>
        <ToggleGroupItem value="on" size="lg">
          Mit Synchronisation (Option 2)
        </ToggleGroupItem>
      </ToggleGroup>
      <p className="mt-2">
        Automatische Raumzuweisung mit Synchronisation ist{" "}
        <span
          className={
            credentials?.ldapAutoSync
              ? "font-medium text-primary"
              : "font-medium text-muted-foreground"
          }
        >
          {credentials?.ldapAutoSync ? "aktiviert" : "deaktiviert"}.
        </span>
      </p>
    </>
  );
};

export default AutoSync;
