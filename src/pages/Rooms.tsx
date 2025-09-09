import RoomList from "@/components/rooms/RoomList";
import Spacing from "@/components/Spacing";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useActiveDirectory from "@/hooks/use-activeDirectory";
import { Network, RefreshCcwDot, User } from "lucide-react";
import { Link } from "react-router";

const Rooms = () => {
  const { isError, isLoading, data } = useActiveDirectory();

  return (
    <>
      <Title
        title="Raumverwaltung"
        subtitle="Hier können Sie die automatische Raumzuweisung mithilfe von Active Directory Organisationseinheiten einstellen und ClassInsights für bestimmte Räume verwalten verwalten."
        backLink="/"
        actions={
          <Link to="ad">
            <Button variant="outline">
              <RefreshCcwDot />
              Active Directory Integration
            </Button>
          </Link>
        }
      />
      <div className="flex items-center justify-center rounded-xl border px-5 py-3 text-center">
        <div className="flex min-h-24 flex-col justify-center lg:w-3/4">
          {isLoading ? (
            <div className="pointer-events-none flex cursor-none flex-col justify-center">
              <span className="mx-auto animate-pulse rounded-md bg-accent text-accent">
                ................................................................................................................
              </span>
              <div className="h-2 w-full"></div>
              <span className="mx-auto mt-2 animate-pulse rounded-md bg-accent text-accent">
                .......................................
              </span>
              <span className="mx-auto mt-2 animate-pulse rounded-md bg-accent text-accent">
                .............................
              </span>
            </div>
          ) : isError ? (
            <p>
              Um die automatische Raumzuweisung mithilfe von Active Directory Organisationseinheiten
              nutzen zu können müssen Sie oben bei "Active Directory Integration" gültige
              Anmeldedaten angeben.
            </p>
          ) : (
            <>
              <span className="font-medium">
                Die Verbindung zu Active Directory wurde erfolgreich hergestellt.
              </span>
              <Spacing size="sm" />
              {[
                {
                  icon: Network,
                  value: data?.ldapServer,
                  label: "Domaincontroller",
                },
                {
                  icon: User,
                  value: data?.ldapUser,
                  label: "Benutzername",
                },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="mx-auto mt-2 flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon size={16} />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{label}</p>
                    </TooltipContent>
                  </Tooltip>
                  <span>{value}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <Spacing />
      <RoomList />
    </>
  );
};

export default Rooms;
