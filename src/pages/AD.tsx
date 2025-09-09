import AutoSync from "@/components/rooms/AutoSync";
import StatusIndicator from "@/components/rooms/StatusIndicator";
import Spacing from "@/components/Spacing";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useActiveDirectory from "@/hooks/use-activeDirectory";
import type { ADCredentials } from "@/types/ADCredentials";
import { Save } from "lucide-react";

const AD = () => {
  const { adCredentials, data: credentials } = useActiveDirectory();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    let ldapUser = formData.get("ldapUser");
    if (ldapUser && typeof ldapUser === "string" && ldapUser.includes("\\")) {
      const splittedUser = ldapUser.split("\\");
      data.ldapUser = splittedUser.length === 2 ? splittedUser[1] : ldapUser;
    }

    const processedData = {
      ...data,
      ldapPort: Number(data.ldapPort),
      ldapAutoSync: credentials?.ldapAutoSync ?? true,
    } as ADCredentials;

    adCredentials.mutate(processedData);
  };

  return (
    <>
      <Title
        title="Active Directory Integration"
        subtitle="Hier können Sie eine Verbindung zum vorhandenen Active Directory herstellen und die automatische Computer Synchronisierung auf Basis der Organisationseinheiten aktivieren. (Empfohlen)"
        backLink="/raumverwaltung"
      />
      <h2 className="pb-1.5">Zugangsdaten</h2>
      <p className="md:w-3/4">
        Damit ClassInsights eine Verknüpfung zum Active Directory herstellen kann, werden
        verschiedene Informationen benötigt. Diese Daten verlassen niemals das Schulnetzwerk!
      </p>
      <Spacing size="md" />
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 lg:w-3/4 xl:w-1/2">
        <div>
          <Label htmlFor="ad-server" className="pb-1">
            FQDN (Fully Qualified Domain Name) oder IP des Domaincontrollers
          </Label>
          <Input
            name="ldapServer"
            id="ad-server"
            placeholder="FQDN oder IP"
            defaultValue={credentials?.ldapServer}
            required
          />
        </div>
        <div>
          <Label htmlFor="ad-port" className="pb-1">
            Port des Domaincontrollers (Standardmäßig 389 oder 3268 für Global Catalog)
          </Label>
          <Input
            name="ldapPort"
            id="ad-port"
            type="number"
            placeholder="389"
            defaultValue={credentials?.ldapPort}
            required
          />
        </div>
        <p className="mt-5">
          Zudem benötigt ClassInsights einen Active Directory Benutzer um auf die
          Organisationseinheiten zugreifen zu können. Erstellen Sie hierfür bitte einen neuen{" "}
          <span className="font-medium">Benutzer OHNE Administratorrechte</span> (aus
          Sicherheitsgründen) und geben Sie diese Zugangsdaten unten an.
        </p>
        <div>
          <Label htmlFor="ad-user" className="pb-1">
            Benutzername (ohne Domainpräfix)
          </Label>
          <Input
            name="ldapUser"
            id="ad-user"
            placeholder="Benutzername"
            defaultValue={credentials?.ldapUser}
            required
          />
        </div>
        <div>
          <Label htmlFor="ad-password" className="pb-1">
            Passwort (wird sicher gespeichert)
          </Label>
          <Input
            type="password"
            name="ldapPass"
            id="ad-password"
            placeholder="Benutzer Passwort"
            defaultValue={credentials?.ldapPass ?? ""}
            required
          />
        </div>
        <StatusIndicator status={adCredentials.status} />
        <Button type="submit" disabled={adCredentials.isPending}>
          <Save />
          {adCredentials.isPending
            ? "Verbindung wird getestet..."
            : "Verbindung testen & speichern"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Hinweis: Die Verbindung wird getestet, sobald Sie auf "Verbindung testen & speichern"
          klicken.
        </p>
      </form>
      <Spacing size="md" />
      <AutoSync />
      {!!credentials && <Spacing size="md" />}
    </>
  );
};

export default AD;
