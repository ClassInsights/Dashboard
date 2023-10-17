"use client";

import Header from "@/app/components/Header";
import ListContainer from "@/app/components/containers/ListContainer";
import TextInput from "@/app/components/forms/TextInput";
import { useConfig } from "@/app/contexts/ConfigContext";
import { useMemo } from "react";

const SettingsPage = () => {
  const config = useConfig();

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
      <section className="flex select-none flex-col gap-4 sm:flex-row">
        <ListContainer title="Schuljahr">
          {details.map((detail) => (
            <div className="flex select-none justify-between" key={detail.name}>
              <p>{detail.name}</p>
              <p className="text-primary dark:text-dark-primary">
                {detail.value}
              </p>
            </div>
          ))}
        </ListContainer>
        <ListContainer title="Test"></ListContainer>
      </section>
      <section className="mt-10 flex w-full flex-col">
        <div>
          <h2 className="pb-2">Azure Gruppen Pattern</h2>
          <div className="flex w-full items-start justify-between">
            <div>
              <p className="pb-2">
                Hier kannst du das Muster/Pattern für die Azure Gruppen Namen
                festlegen.
              </p>
              <p className="mb-0.5">Beispiele:</p>
              <div className="grid w-max grid-cols-2 gap-x-10">
                <small>Klasse</small>
                <small className="mb-0.5">Pattern</small>
                <p>2019_KK</p>
                <p>YEAR_CLASS</p>
                <p>KKB/2022</p>
                <p>CLASS/YEAR</p>
              </div>
            </div>
            <TextInput
              initialValue={currentConfig.azureGroupPattern}
              placeholder="Gruppen Pattern"
              regexPattern="(?=.*YEAR)(?=.*CLASS)"
              onSubmit={(value) =>
                config.updateConfig({
                  ...currentConfig,
                  azureGroupPattern: value,
                })
              }
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default SettingsPage;
