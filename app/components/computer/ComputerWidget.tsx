import Computer from "@/app/types/computer";
import Container from "../containers/Container";
import { useAlert } from "@/app/contexts/AlertContext";
import ComputerAction from "./ComputerAction";
import ComputerDetail from "./ComputerDetail";
import { useCallback, useMemo } from "react";

type ComputerWidgetProps = {
  computer: Computer;
};

const ComputerWidget: React.FC<ComputerWidgetProps> = ({ computer }) => {
  const alert = useAlert();

  const shutdownAction = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.ctrlKey) console.log("instant shutdown");
      else
        alert.show(
          `Möchtest du den Computer ${computer?.name} wirklich herunterfahren?`,
          [
            {
              value: "Ja",
              onClick: () => console.log("shutdown"),
            },
            {
              value: "Nein",
              onClick: () => console.log("no shutdown"),
            },
          ],
        );
    },
    [],
  );

  const restartAction = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.ctrlKey) console.log("instant restart");
      else
        alert.show(
          `Möchtest du den Computer ${computer?.name} wirklich neustarten?`,
          [
            {
              value: "Ja",
              onClick: () => console.log("restart"),
            },
            {
              value: "Nein",
              onClick: () => console.log("no restart"),
            },
          ],
        );
    },
    [],
  );

  const logoutAction = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.ctrlKey) console.log("instant logout");
      else
        alert.show(
          `Möchtest du den Computer ${computer?.name} wirklich abmelden?`,
          [
            {
              value: "Ja",
              onClick: () => console.log("logout"),
            },
            {
              value: "Nein",
              onClick: () => console.log("no logout"),
            },
          ],
        );
    },
    [],
  );

  return (
    <Container
      disabled={!computer.online}
      onClick={
        !computer.online
          ? () =>
              alert.show(
                `Möchtest du den Computer ${computer?.name} wirklich starten?`,
                [
                  { value: "Ja", onClick: () => console.log("Pc Start") },
                  {
                    value: "Nein",
                    onClick: () => console.log("Start canceled"),
                  },
                ],
              )
          : undefined
      }
    >
      <div className="mb-1.5 flex justify-between">
        <h3>{computer.name}</h3>
        {computer.online && (
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
      <ComputerDetail
        value={computer.online ? "Online" : "Offline"}
        iconPath="/status.svg"
        altText="Status Icon"
      />
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
    </Container>
  );
};

export default ComputerWidget;
