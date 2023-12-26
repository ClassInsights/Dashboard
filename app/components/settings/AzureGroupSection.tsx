"use client";

import { useAzure } from "@/app/contexts/AzureContext";
import { useCallback, useEffect, useMemo } from "react";
import DropDownList from "../forms/DropDownList";
import SchoolClass from "@/app/types/schoolClass";
import Divider from "./Divider";

const AzureGroupSection = () => {
  const azure = useAzure();

  const classes = useMemo(() => azure.classes, [azure]);
  const azureGroups = useMemo(() => azure.groups, [azure]);
  const mapping = useMemo(() => azure.currentMapping, [azure]);

  const disableSubmit = useMemo(
    () =>
      azureGroups.length !== 0 && !azure.isSaving && !azure.hasUnsavedChanges,
    [azureGroups, azure.isSaving, azure.hasUnsavedChanges],
  );

  const firstHalf = useMemo(
    () => classes.slice(0, Math.ceil(classes.length / 2)),
    [classes, mapping],
  );

  const secondHalf = useMemo(
    () => classes.slice(Math.ceil(classes.length / 2)),
    [classes, mapping],
  );

  const generateColumn = useCallback(
    (classes: SchoolClass[], inputWidth = "w-3/5") => {
      return (
        <div className="flex flex-col gap-4">
          {classes.map((schoolClass) => (
            <div
              key={`class-${schoolClass.id}`}
              className="flex flex-col justify-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <p>{azure.getClassById(schoolClass.id)?.name}</p>
              <div className={inputWidth}>
                <DropDownList
                  disabled={azureGroups.length === 0 || azure.isSaving}
                  options={azureGroups.map((group) => {
                    return { displayName: group.displayName, value: group.id };
                  })}
                  onChange={(option) =>
                    azure.updateMapping(schoolClass.id, option.value)
                  }
                  selected={mapping.get(schoolClass.id)}
                />
              </div>
            </div>
          ))}
        </div>
      );
    },
    [azureGroups, mapping, azure],
  );

  if (classes.length === 0)
    return <p>Es wurden keine Webuntis Klassen gefunden.</p>;

  return (
    <section className="flex flex-col">
      <div className="flex w-full items-start justify-between">
        <div>
          <h2 className="select-none pb-2 ">Klassen verknüpfen</h2>
          <p className="select-none pb-10">
            Hier kannst du die Webuntis Klassen mit den Azure Gruppen händisch
            verknüpfen
          </p>
        </div>
        <button
          disabled={disableSubmit}
          className={`rounded-md bg-tertiary px-4 py-2 transition-opacity dark:bg-dark-tertiary ${
            disableSubmit ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
          onClick={() => azure.saveChanges()}
        >
          Speichern
        </button>
      </div>
      {secondHalf.length > 0 ? (
        <>
          <div className="hidden items-stretch md:flex">
            <div className="w-full">
              {generateColumn(firstHalf, "w-3/5 2xl:w-4/6")}
            </div>
            <Divider vertical />
            <div className="w-full">
              {generateColumn(secondHalf, "w-3/5 2xl:w-4/6")}
            </div>
          </div>
          <div className="block md:hidden">
            {generateColumn(classes, "w-full sm:w-1/2")}
          </div>
        </>
      ) : (
        generateColumn(classes, "w-full sm:w-1/2")
      )}
    </section>
  );
};

export default AzureGroupSection;
