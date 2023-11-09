import Computer from "@/app/types/computer";
import Container from "../containers/Container";
import { useAlert } from "@/app/contexts/AlertContext";
import ComputerAction from "./ComputerAction";
import ComputerDetail from "./ComputerDetail";
import { useCallback } from "react";
import { useData } from "@/app/contexts/DataContext";
import { useAuth } from "@/app/contexts/AuthContext";

enum Action {
  SHUTDOWN = "shutdown",
  RESTART = "restart",
  LOGOUT = "logout",
}

const ComputerWidget = ({ computer }: { computer: Computer }) => {
  const auth = useAuth();
  const alert = useAlert();
  const data = useData();
  const translateAction = useCallback(
    (action: Action) =>
      action === Action.SHUTDOWN
        ? "heruntergefahren"
        : action === Action.RESTART
        ? "neugestartet"
        : "abgemeldet",
    [],
  );

  const performAction = useCallback(
    async (action: Action) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/computers/${computer.id}/${action}`,
          {
            method: "PATCH",
            headers: {
              authorization: `Bearer ${auth.token}`,
            },
          },
        );

        if (response.status === 200) {
          alert.show(
            `Computer ${computer.name} wurde erfolgreich ${translateAction(
              action,
            )}`,
          );
          return true;
        } else
          alert.show(
            `Computer ${computer.name} konnte nicht ${translateAction(
              action,
            )} werden (${response.status}))`,
          );
        return false;
      } catch (error) {
        alert.show("Ein unerwarteter Fehler ist aufgetreten");
        return false;
      }
    },
    [alert, computer.id, computer.name],
  );

  const shutdownAction = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.ctrlKey) performAction(Action.SHUTDOWN);
      else
        alert.show(
          `Möchtest du den Computer ${computer?.name} wirklich herunterfahren?`,
          [
            {
              value: "Ja",
              onClick: async () => {
                if (await performAction(Action.SHUTDOWN)) {
                  const newComputer = computer;
                  newComputer.isOnline = false;
                  data.updateComputer(newComputer);
                }
              },
            },
            {
              value: "Nein",
            },
          ],
        );
    },
    [alert, computer, data, performAction],
  );

  const restartAction = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.ctrlKey) performAction(Action.RESTART);
      else
        alert.show(
          `Möchtest du den Computer ${computer?.name} wirklich neustarten?`,
          [
            {
              value: "Ja",
              onClick: async () => {
                if (await performAction(Action.SHUTDOWN)) {
                  const newComputer = computer;
                  newComputer.isOnline = false;
                  data.updateComputer(newComputer);
                }
              },
            },
            {
              value: "Nein",
            },
          ],
        );
    },
    [alert, computer, data, performAction],
  );

  const logoutAction = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.ctrlKey) performAction(Action.LOGOUT);
      else
        alert.show(
          `Möchtest du den Computer ${computer?.name} wirklich abmelden?`,
          [
            {
              value: "Ja",
              onClick: () => performAction(Action.LOGOUT),
            },
            {
              value: "Nein",
            },
          ],
        );
    },
    [alert, computer?.name],
  );

  return (
    <Container disabled={!computer.isOnline} key={computer.id}>
      <div className="mb-1.5 flex justify-between">
        <h3 className="select-none">{computer.name}</h3>
        {computer.isOnline && (
          <div className="flex gap-1.5">
            <ComputerAction
              computerId={computer.id}
              iconPath="/shutdown.svg"
              action={shutdownAction}
              altText="Shutdown Computer"
              hintText="Herunterfahren"
            />
            <ComputerAction
              computerId={computer.id}
              iconPath="/restart.svg"
              action={restartAction}
              altText="Restart Computer"
              hintText="Neustarten"
            />
            <ComputerAction
              computerId={computer.id}
              iconPath="/logout.svg"
              action={logoutAction}
              altText="Logout Computer"
              hintText="Abmelden"
            />
          </div>
        )}
      </div>
      <div className={!computer.isOnline ? "select-none" : ""}>
        <div className="select-none">
          <ComputerDetail
            value={computer.isOnline ? "Online" : "Offline"}
            iconPath="/status.svg"
            altText="Status Icon"
          />
        </div>
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
            altText="IP-Address Icon"
          />
        )}
        {computer.macAddress && (
          <ComputerDetail
            value={
              computer.macAddress
                .toString()
                .match(/.{1,2}/g)
                ?.reverse()
                .join(":") ?? ""
            }
            iconPath="/computer.svg"
            altText="Mac-Address Icon"
          />
        )}
      </div>
    </Container>
  );
};

export default ComputerWidget;
