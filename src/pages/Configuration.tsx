import Setting from "@/components/Setting";
import Spacing from "@/components/Spacing";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import useConfiguration from "@/hooks/use-configuration";
import type { Configuration as Config } from "@/types/Configuration";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Save } from "lucide-react";
import { useState } from "react";

const Configuration = () => {
  const { data: config } = useConfiguration();
  const queryClient = useQueryClient();
  const {
    accessToken,
    school: { apiUrl },
  } = useAuth();

  const mutation = useMutation({
    mutationFn: async (newConfig: Config) => {
      const response = await fetch(`${apiUrl}/settings/dashboard`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newConfig),
      });

      if (!response.ok) throw new Error("Failed to update configuration");

      return response.json();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["configuration"] });
    },
  });

  if (!config) return null;

  const [currentConfig, setCurrentConfig] = useState<Config>(config);

  const updateConfig = (key: keyof Config, value: any) => {
    console.log(`Updating ${key} to`, value);
    setCurrentConfig((prev) => ({ ...prev, [key]: value }));
  };

  const hasChanged = JSON.stringify(currentConfig) !== JSON.stringify(config);

  const resetConfig = () => setCurrentConfig(config);

  return (
    <>
      {hasChanged && (
        <div className="fixed right-4 bottom-4 flex items-center gap-2 lg:right-10">
          <Button variant="outline" onClick={resetConfig}>
            <RotateCcw />
            Änderungen verwerfen
          </Button>
          <Button onClick={() => mutation.mutate(currentConfig)}>
            <Save />
            Änderungen speichern
          </Button>
        </div>
      )}
      <Title
        title="Konfiguration"
        subtitle="Auf dieser Seite können Sie Änderungen am gesamten ClassInsights Ökosystem vornehmen. Um die Änderungen zu speichern, klicken Sie auf den Button unten."
      />
      <div className="flex flex-col gap-10">
        <Setting
          title="Tagesende"
          description="Hiermit wird die Zeit konfiguriert, die gewartet wird, bis eine Herunterfahren-Meldung an alle Computer in diesem Raum gesendet wird, wenn in diesem Raum heute keine Unterrichtsstunden mehr stattfinden. (Standard: 50 Minuten)"
          inputValue={currentConfig.noLessonsTime}
          inputAction={(value) => updateConfig("noLessonsTime", value)}
          currentHint={
            <p>
              Wenn in einem Raum keine Unterrichtsstunden mehr stattfinden, wird nach{" "}
              <span className="text-primary">{currentConfig.noLessonsTime} Minuten</span>{" "}
              {currentConfig.delayShutdown ? (
                <span>
                  und anschließenden{" "}
                  <span className="text-primary">
                    {currentConfig.shutdownDelay} Minuten Wartezeit{" "}
                  </span>
                </span>
              ) : (
                ""
              )}
              eine Herunterfahren-Meldung an alle eingeschalteten Computer dieses Raumes versendet.
            </p>
          }
          disabled={mutation.isPending}
        />
        <Separator className="mx-auto w-3/4!" />
        <Setting
          title="Stundenlücken"
          description="Bezieht sich auf die Zeit in Minuten zwischen zwei Unterrichtsstunden, die entscheidet, ob an einen Computer ein Shutdown-Befehl gesendet wird. (Standard: 20 Minuten)"
          toggleValue={currentConfig.checkGap}
          toggleAction={(value) => updateConfig("checkGap", value)}
          inputValue={currentConfig.lessonGapMinutes}
          inputAction={(value) => updateConfig("lessonGapMinutes", value)}
          currentHint={
            <p>
              Wenn zwischen zwei Unterrichtseinheiten mehr als{" "}
              <span className="text-primary">{currentConfig.lessonGapMinutes} Minuten</span>{" "}
              dazwischen sind, wird{" "}
              {currentConfig.delayShutdown ? (
                <span>
                  nach{" "}
                  <span className="text-primary">
                    {currentConfig.shutdownDelay} Minuten Wartezeit{" "}
                  </span>
                </span>
              ) : (
                ""
              )}{" "}
              ein Shutdown-Befehl an die Computer dieses Raumes gesendet. Wenn weniger als 30
              Minuten zwischen zwei Stunden sind, wird kein Shutdown-Befehl gesendet.
            </p>
          }
          disabled={mutation.isPending}
        />
        <Separator className="mx-auto w-3/4!" />
        <Setting
          title="Wartezeit (Puffer)"
          description="Dies ist die Zeit, die immer nach einer Stunde gewartet wird, bevor überprüft wird, ob ein Herunterfahren-Meldung gesendet werden sollte oder nicht. (Standard: 3 Minuten)"
          toggleValue={currentConfig.delayShutdown}
          toggleAction={(value) => updateConfig("delayShutdown", value)}
          inputValue={currentConfig.shutdownDelay}
          inputAction={(value) => updateConfig("shutdownDelay", value)}
          currentHint={
            <p>
              Nun wird <span className="text-primary">{currentConfig.shutdownDelay} Minuten</span>{" "}
              nach Unterrichtsende für alle eingeschalteten Computer überprüft, ob sie eine eine
              automatische Herunterfahren-Meldung erhalten sollten.
            </p>
          }
          disabled={mutation.isPending}
        />
        <Separator className="mx-auto w-3/4!" />
        <Setting
          title="Abmelden bei Inaktivität"
          description="Damit wird die Zeit in Minuten konfiguriert, nach der ein inaktiver Benutzer automatisch abgemeldet wird. (Standard: 15 Minuten)"
          toggleValue={currentConfig.checkAfk}
          toggleAction={(value) => updateConfig("checkAfk", value)}
          inputValue={currentConfig.afkTimeout}
          inputAction={(value) => updateConfig("afkTimeout", value)}
          currentHint={
            <p>
              Wenn ein Benutzer den Computer für{" "}
              <span className="text-primary">{currentConfig.afkTimeout} Minuten</span> nicht
              verwendet hat, wird der Benutzer automatisch abgemeldet.
            </p>
          }
          disabled={mutation.isPending}
        />
        <Separator className="mx-auto w-3/4!" />
        <Setting
          title="Herunterfahren ohne Benutzer"
          description="Hiermit wird bestimmt, ob Computer ohne angemeldete Benutzer automatisch heruntergefahren werden sollten. (Standard: Ja)"
          toggleValue={currentConfig.checkUser}
          toggleAction={(value) => updateConfig("checkUser", value)}
          disabled={mutation.isPending}
        />
      </div>
      <Spacing />
    </>
  );
};

export default Configuration;
