"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AzureGroup from "../types/azureGroup";
import SchoolClass from "../types/schoolClass";
import { useAuth } from "./AuthContext";
import { useFail } from "./FailContext";
import Loading from "../components/Loading";
import * as jsonpatch from "fast-json-patch";

type AzureContextType = {
  classes: SchoolClass[];
  groups: AzureGroup[];
  currentMapping: Map<number, String | undefined>;
  updateMapping: (classId: number, groupId: String | undefined) => void;
  hasUnsavedChanges: boolean;
  saveChanges: () => Promise<boolean>;
  getClassById: (classId: number | undefined) => SchoolClass | undefined;
  getAzureGroupById: (groupId: String | undefined) => AzureGroup | undefined;
  isSaving: boolean;
};

const AzureContext = createContext<AzureContextType | undefined>(undefined);

export const AzureProvider = ({ children }: { children: React.ReactNode }) => {
  const [groups, setGroups] = useState<AzureGroup[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [mappings, setMappings] = useState<Map<number, String | undefined>>(
    new Map(),
  );
  const [newMappings, setNewMappings] = useState<
    Map<number, String | undefined> | undefined
  >(undefined);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const auth = useAuth();
  const failer = useFail();

  const fetchSchoolClasses = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes`,
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        },
      );

      if (!response.ok) {
        failer.fail("Fehler beim Laden der Klassen", await response.text());
        return;
      }
      const schoolClasses = await response.json();

      const data = schoolClasses.map((schoolClass: any) => {
        return {
          id: schoolClass.classId,
          name: schoolClass.name,
          head: schoolClass.head,
          azureGroupId: schoolClass.azureGroupId,
        } as SchoolClass;
      }) as SchoolClass[];

      if (data.length === 0) return;
      setClasses(data);
    } catch (error: any) {
      failer.fail("Fehler beim Laden der Klassen", error.toString());
    }
  }, [auth.token, failer]);

  const fetchAzureGroups = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/azuregroups`,
        {
          headers: {
            authorization: `Bearer ${auth.token}`,
          },
        },
      );

      if (!response.ok) {
        failer.fail(
          "Fehler beim Laden der Azure Gruppen",
          await response.text(),
        );
        return;
      }

      const azureGroups = await response.json();

      if (azureGroups.length === 0) return;
      azureGroups.sort((a: AzureGroup, b: AzureGroup) => {
        if (a.displayName < b.displayName) return -1;
        if (a.displayName > b.displayName) return 1;
        return 0;
      });
      setGroups(azureGroups);
    } catch (error: any) {
      failer.fail("Fehler beim Laden der Azure Gruppen", error.toString());
    }
  }, [auth.token, failer]);

  useEffect(() => {
    if (!classes || !groups) return;
    const generatedMappings = new Map<number, String>();
    classes.forEach((schoolClass) => {
      const azureGroup = groups.find(
        (group) => group.id === schoolClass.azureGroupId,
      );
      if (!azureGroup) return;
      generatedMappings.set(schoolClass.id, azureGroup.id);
    });
    setMappings(generatedMappings);
  }, [classes, groups]);

  useEffect(() => {
    fetchSchoolClasses().then(() =>
      fetchAzureGroups().then(() => setIsLoading(false)),
    );
  }, [fetchSchoolClasses, fetchAzureGroups]);

  const currentMapping = useMemo(
    () => newMappings ?? mappings,
    [newMappings, mappings],
  );

  const updateMapping = useCallback(
    (classId: number, groupId: String | undefined) => {
      const updatedMappings = new Map(newMappings ?? mappings);
      if (groupId === undefined) {
        updatedMappings.delete(classId);
        setNewMappings(updatedMappings);
        return;
      }
      updatedMappings.forEach((value, key) => {
        if (value === groupId) {
          console.log(
            "Deleted: ",
            groups.find((group) => group.id === value)?.displayName,
          );
          updatedMappings.set(key, undefined);
        }
      });
      updatedMappings.set(classId, groupId);
      setNewMappings(updatedMappings);
    },
    [newMappings, mappings],
  );

  const patch = useMemo(() => {
    if (!mappings || !newMappings) return undefined;
    setHasUnsavedChanges(true);
    const newPatch = jsonpatch.compare(
      Array.from(mappings),
      Array.from(newMappings),
    );
    console.log("Patch: ", JSON.stringify(newPatch));
    return newPatch;
  }, [mappings, newMappings]);

  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    console.log("Patch: ", patch);
    setIsSaving(false);
    return true;
    // try {
    //   if (!newMappings || !patch || patch.length === 0) return false;
    //   const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`, {
    //     method: "PATCH",
    //     headers: {
    //       authorization: `Bearer ${auth.token}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(Array.from(newMappings)),
    //   });

    //   if (!result.ok) {
    //     setIsSaving(false);
    //     return false;
    //   }

    //   setMappings(newMappings);
    //   setNewMappings(undefined);

    //   setIsSaving(false);
    //   return true;
    // } catch (e) {
    //   setIsSaving(false);
    //   return false;
    // }
  }, [newMappings, patch, auth.token]);

  const getClassById = useCallback(
    (classId: number | undefined) => {
      if (!classId) return undefined;
      return classes.find((schoolClass) => schoolClass.id === classId);
    },
    [classes],
  );

  const getAzureGroupById = useCallback(
    (groupId: String | undefined) => {
      if (!groupId) return undefined;
      return groups.find((group) => group.id === groupId);
    },
    [groups],
  );

  if (isLoading) return <Loading />;

  return (
    <AzureContext.Provider
      value={{
        classes,
        groups,
        currentMapping,
        updateMapping,
        hasUnsavedChanges,
        saveChanges,
        getClassById,
        getAzureGroupById,
        isSaving,
      }}
    >
      {children}
    </AzureContext.Provider>
  );
};

export const useAzure = () => {
  const context = useContext(AzureContext);
  if (context === undefined) {
    throw new Error("useAzure must be used within a AzureProvider");
  }
  return context;
};
