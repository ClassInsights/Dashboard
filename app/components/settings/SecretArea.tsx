import { useCallback, useMemo, useState } from "react";
import TextInput from "../forms/TextInput";
import { useAlert } from "@/app/contexts/AlertContext";

const SecretArea = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [azureSecret, setAzureSecret] = useState("");

  const alert = useAlert();

  const submitAzureSecret = useCallback(async () => {
    setAzureSecret("");
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert.show("ClientSecret wurde gespeichert");
  }, [azureSecret]);

  const disableSubmit = useMemo(
    () => azureSecret === "" || isSubmitting,
    [azureSecret, isSubmitting],
  );

  return (
    <div className="flex w-max flex-col gap-2 sm:flex-row sm:gap-4">
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
