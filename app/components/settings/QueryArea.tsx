import { useConfig } from "@/app/contexts/ConfigContext";
import { useCallback, useMemo, useState } from "react";

const QueryArea = () => {
  const config = useConfig();

  const query = useMemo(
    () => config.getConfig()?.influx?.query?.replaceAll(" |>", "\n     |>"),
    [config],
  );

  const lines = useMemo(() => query?.split("\n"), [query]);

  const [inputValue, setInputValue] = useState(query ?? "");

  const onSubmit = useCallback(() => {
    const newValue = inputValue
      .replaceAll("\n", "")
      .replace(/(\S)\s*\|>\s*(\S)/g, "$1 |> $2");
    if (newValue === config.getConfig()?.influx?.query) return;
    config.updateConfig({
      ...config.getConfig(),
      influx: {
        ...config.getConfig()?.influx,
        query: newValue,
      },
    });
  }, [inputValue, config]);

  return (
    <div className="w-full">
      <small className="select-none pb-1">Aktuelle Query</small>
      <textarea
        disabled={config.isLoading}
        value={inputValue}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        onInput={(event) => {
          const textarea = event.target as HTMLTextAreaElement;
          textarea.style.height = "auto";
          textarea.style.height = textarea.scrollHeight + "px";
        }}
        rows={lines?.length ?? 1}
        placeholder="Aktuelle Query"
        className={`w-full resize-none overflow-auto overflow-x-scroll whitespace-pre rounded-md bg-secondary px-4 py-2 placeholder-onBackground outline-none transition-opacity placeholder:opacity-40 dark:bg-dark-secondary dark:placeholder-dark-onBackground
        ${config.isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        onBlur={() => onSubmit()}
      />
    </div>
  );
};

export default QueryArea;
