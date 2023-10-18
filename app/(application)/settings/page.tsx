"use client";

import Header from "@/app/components/general/Header";
import SettingsSection from "@/app/components/settings/SettingsSection";
import ListContainer from "@/app/components/containers/ListContainer";
import TextInput from "@/app/components/forms/TextInput";
import { useAlert } from "@/app/contexts/AlertContext";
import { useConfig } from "@/app/contexts/ConfigContext";
import Image from "next/image";
import { useMemo } from "react";
import Divider from "@/app/components/settings/Divider";
import Container from "@/app/components/containers/Container";
import SecretArea from "@/app/components/settings/SecretArea";
import DropDownList from "@/app/components/forms/DropDownList";

const SettingsPage = () => {
  const config = useConfig();
  const alert = useAlert();

  const currentConfig = useMemo(() => config.getConfig(), [config]);

  const details = [
    {
      name: "Aktuelles Jahr",
      value: config.getConfig()?.schoolYear.name ?? "Unbekannt",
    },
    {
      name: "Start",
      value:
        config.getConfig()?.schoolYear.startDate.toLocaleDateString("de-AT") ??
        "Unbekannt",
    },
    {
      name: "Ende",
      value:
        config.getConfig()?.schoolYear.endDate.toLocaleDateString("de-AT") ??
        "Unbekannt",
    },
  ];

  if (!currentConfig) return;

  return (
    <>
      <Header
        title="Einstellungen"
        subtitle="Hier kannst du das ClassInsights Ökosystem bearbeiten."
        previousPath="/"
      />
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
      <SettingsSection
        title="Azure Lehrergruppe"
        description="Hier kannst du die Azure Gruppe für die Lehrer festlegen."
        input={
          <DropDownList
            options={[
              {
                displayName: "2019KK",
                value: "e4816e17-4c37-8306-6fe6-9f96d74c4b25",
              },
              {
                displayName: "2020KK",
                value: "e4816e17-4c37-8306-6fe6-6f98d32c2b34",
              },
              {
                displayName: "2021KK",
                value: "e4816e17-4c37-8306-6fe6-2f93d72d4c82",
              },
              {
                displayName: "Teacher",
                value: "e4816e17-4c37-8306-6fe6-2f93b35d6c49",
              },
            ]}
            selected={currentConfig.teacherGroupId}
            title="Aktuelle Lehrergruppe"
            disabled={config.isSaving}
            onChange={(element) =>
              config.updateConfig({
                ...currentConfig,
                teacherGroupId: element.value,
              })
            }
          />
        }
      />
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
            initialValue={currentConfig.azureGroupPattern}
            placeholder="Gruppen Pattern"
            title="Aktuelles Pattern"
            regexPattern="(?=.*YEAR)(?=.*CLASS)"
            disabled={config.isSaving}
            onSubmit={(value) =>
              config.updateConfig({
                ...currentConfig,
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
            initialValue={currentConfig.caSubject}
            placeholder="CASubject"
            title="Aktuelles CASubject"
            disabled={config.isSaving}
            onSubmit={(value) =>
              config.updateConfig({
                ...currentConfig,
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
              DomainController ausführen (DOMAIN mit richtigem Domain Namen
              austauschen):
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
            initialValue={currentConfig.domainSid}
            placeholder="DomainSID"
            title="Aktuelle DomainSID"
            disabled={config.isSaving}
            onSubmit={(value) =>
              config.updateConfig({
                ...currentConfig,
                domainSid: value,
              })
            }
          />
        }
      />
    </>
  );
};

export default SettingsPage;
