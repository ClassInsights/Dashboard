import { useCallback, useMemo, useState } from "react";
import TextInput from "../forms/TextInput";
import { useAlert } from "@/app/contexts/AlertContext";
import { useAuth } from "@/app/contexts/AuthContext";

const SecretArea = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [azureSecret, setAzureSecret] = useState("");

  const alert = useAlert();
  const auth = useAuth();

  const submitAzureSecret = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // TODO send secret in body
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/config/graph/credentials`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) alert.show("Speichern von Secret fehlgeschlagen");
      setAzureSecret("");
      alert.show("Azure Secret wurde gespeichert");
    } catch (error) {
      alert.show("Speichern von Secret fehlgeschlagen");
    }
    setIsSubmitting(false);
  }, [alert, auth.token]);

  const disableSubmit = useMemo(
    () => azureSecret === "" || isSubmitting,
    [azureSecret, isSubmitting],
  );

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
      <TextInput
        placeholder="ClientSecret"
        initialValue={azureSecret}
        onChange={(value) => setAzureSecret(value)}
        style="tertiary"
        disabled={isSubmitting}
        reset={isSubmitting}
      />
      <button
        disabled={disableSubmit}
        className={`rounded-md bg-tertiary px-4 py-2 transition-opacity dark:bg-dark-tertiary ${
          disableSubmit ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        onClick={submitAzureSecret}
      >
        Speichern
      </button>
    </div>
  );
};

export default SecretArea;
