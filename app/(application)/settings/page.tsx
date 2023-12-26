"use client";

import Header from "@/app/components/general/Header";
import SettingsSection from "@/app/components/settings/SettingsSection";
import ListContainer from "@/app/components/containers/ListContainer";
import TextInput from "@/app/components/forms/TextInput";
import { useAlert } from "@/app/contexts/AlertContext";
import { useConfig } from "@/app/contexts/ConfigContext";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import Divider from "@/app/components/settings/Divider";
import Container from "@/app/components/containers/Container";
import SecretArea from "@/app/components/settings/SecretArea";
import DropDownList from "@/app/components/forms/DropDownList";
import AzureGroupSection from "@/app/components/settings/AzureGroupSection";
import { useAzure } from "@/app/contexts/AzureContext";
import { useRatelimit } from "@/app/contexts/RatelimitContext";
import InfluxSection from "@/app/components/settings/InfluxSection";

const SettingsPage = () => {
  const alert = useAlert();
  const azure = useAzure();
  const config = useConfig();
  const limiter = useRatelimit();

  const currentConfig = useMemo(() => config.getConfig(), [config]);

  const isLoading = useMemo(
    () => currentConfig === undefined || config.isLoading || azure.isLoading,
    [currentConfig, config.isLoading, azure.isLoading],
  );

  const refresh = useCallback(async () => {
    if (limiter.isRateLimited("settings")) {
      const limit = limiter.getRatelimit("settings");
      if (!limit) {
        alert.show("Etwas ist schiefgelaufen");
        return;
      }
      const secondsLeft = Math.ceil(
        (limit.startedAt.getTime() + limit.duration - Date.now()) / 1000,
      );
      alert.show(`Warte noch ${secondsLeft} Sekunden zum Aktualisieren`);
      return;
    }
    limiter.addRateLimit("settings", 10000);

    if (!(await config.fetchConfig()) || !(await azure.refreshAzureData())) {
      alert.show("Etwas ist schiefgelaufen");
      return;
    }
    alert.show("Erfolgreich aktualisiert");
  }, [config, limiter, alert, azure]);

  const details = [
    {
      name: "Aktuelles Jahr",
      value: config.getConfig()?.schoolYear?.name ?? "Unbekannt",
    },
    {
      name: "Start",
      value:
        config
          .getConfig()
          ?.schoolYear?.startDate?.toLocaleDateString("de-AT") ?? "Unbekannt",
    },
    {
      name: "Ende",
      value:
        config.getConfig()?.schoolYear?.endDate?.toLocaleDateString("de-AT") ??
        "Unbekannt",
    },
  ];

  return (
    <>
      <Header
        title="Einstellungen"
        subtitle="Hier kannst du das ClassInsights Ökosystem bearbeiten."
        previousPath="/"
        reloadAction={refresh}
      />
      {isLoading ? (
        <div className="flex h-32 w-full items-center justify-center">
          <Image
            src="/progress.svg"
            height={20}
            width={20}
            alt="progess indicator"
            draggable={false}
            className="onBackground-light dark:onBackground-dark h-10 w-10 animate-spin"
          />
        </div>
      ) : (
        <>
          <section className="grid select-none grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-stretch">
              <ListContainer title="Schuljahr">
                {details.map((detail) => (
                  <div
                    className="flex select-none justify-between"
                    key={detail.name}
                  >
                    <p>{detail.name}</p>
                    <p className="text-primary dark:text-dark-primary">
                      {detail.value}
                    </p>
                  </div>
                ))}
              </ListContainer>
            </div>
            <div className="flex w-full items-stretch sm:col-span-2 sm:w-max">
              <Container>
                <h3 className="mb-1.5">Azure Secret</h3>
                <p className="mb-2">
                  Hierfür musst du eine App im Azure Portal erstellen.
                </p>
                <SecretArea />
              </Container>
            </div>
          </section>
          <div className="h-20 w-full" />
          <section>
            <h2 className="select-none pb-2 ">Azure Lehrergruppe</h2>
            <div className="flex w-full flex-col items-start justify-between gap-8 sm:flex-row">
              <p className="w-full select-none">
                Hier kannst du die Azure Gruppe für die Lehrer festlegen.
              </p>
              <div className="w-full sm:w-4/5">
                <DropDownList
                  options={azure.groups.map((group) => {
                    return { displayName: group.displayName, value: group.id };
                  })}
                  selected={currentConfig!.teacherGroupId}
                  title="Aktuelle Lehrergruppe"
                  disabled={config.isSaving}
                  onChange={(element) =>
                    config.updateConfig({
                      ...currentConfig!,
                      teacherGroupId: element.value.toString(),
                    })
                  }
                />
              </div>
            </div>
          </section>
          <Divider />
          <SettingsSection
            title="Azure Gruppen Pattern"
            description="Hier kannst du das Muster/Pattern für die Benennung der Azure Schüler Gruppen festlegen."
            info={
              <div className="select-none">
                <p className="mb-0.5">Beispiele:</p>
                <div className="grid w-max grid-cols-2 gap-x-4 sm:gap-x-10">
                  <small>Klasse</small>
                  <small className="mb-0.5">Pattern</small>
                  <p>2019_KK</p>
                  <p>YEAR_CLASS</p>
                  <p>KKB/2022</p>
                  <p>CLASS/YEAR</p>
                </div>
              </div>
            }
            input={
              <TextInput
                initialValue={currentConfig!.azureGroupPattern}
                placeholder="Gruppen Pattern"
                title="Aktuelles Pattern"
                regexPattern="(?=.*YEAR)(?=.*CLASS)"
                disabled={config.isSaving}
                onSubmit={(value) =>
                  config.updateConfig({
                    ...currentConfig!,
                    azureGroupPattern: value,
                  })
                }
              />
            }
          />
          <Divider />
          <SettingsSection
            title="CASubject (Clientzertifikat)"
            description="Das CASubject ist der Name der Zertifizierungsstelle, die das Clientztertifikat erstellt hat."
            input={
              <TextInput
                initialValue={currentConfig!.caSubject}
                placeholder="CASubject"
                title="Aktuelles CASubject"
                disabled={config.isSaving}
                onSubmit={(value) =>
                  config.updateConfig({
                    ...currentConfig!,
                    caSubject: value,
                  })
                }
              />
            }
          />
          <Divider />
          <SettingsSection
            title="Domain Security Identifier"
            description="Die DomainSID ist eine eindeutige Kennung für eine Windows-Domäne."
            info={
              <>
                <p className="select-none pb-1.5">
                  Hierfür musst du folgenden PowerShell Befehl auf dem
                  DomainController ausführen. Damit dieser Command auch
                  außerhalb des DomainControllers ausgeführt werden kann, musst
                  du die Remote Server Administration Tools installieren.
                  (DOMAIN mit richtigem Domain Namen austauschen):
                </p>
                <div className="flex w-full items-center justify-between gap-4 rounded-md border-2 border-primary p-2 dark:border-dark-primary xl:w-max">
                  <p>Get-ADDomain -Identity DOMAIN | Select Name, DomainSID</p>
                  <Image
                    src={"/copy.svg"}
                    width={25}
                    height={25}
                    alt="Copy to Clipboard"
                    className="onBackground-light dark:onBackground-dark h-5 w-auto cursor-pointer"
                    onClick={async () => {
                      if (
                        navigator === undefined ||
                        navigator.clipboard === undefined
                      ) {
                        alert.show(
                          "Kopieren fehlgeschlagen - du kannst noch manuell kopieren",
                        );
                        return;
                      }
                      try {
                        await navigator.clipboard.writeText(
                          "Get-ADDomain -Identity PROJEKT | Select Name, DomainSID",
                        );
                      } catch (_) {
                        alert.show(
                          "Kopieren fehlgeschlagen - du kannst noch manuell kopieren",
                        );
                        return;
                      }
                      alert.show("PowerShell Befehl kopiert");
                    }}
                    draggable={false}
                  />
                </div>
              </>
            }
            input={
              <TextInput
                initialValue={currentConfig!.domainSid}
                placeholder="DomainSID"
                title="Aktuelle DomainSID"
                disabled={config.isSaving}
                onSubmit={(value) =>
                  config.updateConfig({
                    ...currentConfig!,
                    domainSid: value,
                  })
                }
              />
            }
          />
          <Divider />
          <InfluxSection />
          <Divider />
          <AzureGroupSection />
        </>
      )}
    </>
  );
};

export default SettingsPage;
