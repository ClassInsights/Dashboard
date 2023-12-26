import { useConfig } from "@/app/contexts/ConfigContext";
import TextInput from "../forms/TextInput";
import InfluxPart from "./InfluxPart";
import { useMemo } from "react";
import QueryArea from "./QueryArea";
import Link from "next/link";

const InfluxSection = () => {
  const config = useConfig();

  const currentConfig = useMemo(() => config.getConfig(), [config]);

  if (currentConfig === undefined || config.isLoading) return null;

  return (
    <section>
      <div className="pb-7">
        <h2 className="select-none pb-2">Sensoren konfigurieren (Influx)</h2>
        <p className="w-full select-none lg:w-3/4">
          Bei den folgenden Punkten kannst alle nötigen Einstellungen treffen,
          damit die API auf die aufgezeichneten Daten zugreifen kann.
        </p>
        <InfluxPart
          title="API Token"
          description="Dieser Token wird als Authentifizierung zu InfluxDB benötigt."
          info={
            <small>
              InfluxDB Dashboard &gt; Load Data &gt; API Tokens &gt; Generate
              API Token
            </small>
          }
          input={
            <TextInput
              initialValue={currentConfig.influx?.token}
              placeholder="API Token"
              title="Aktueller API Token"
              disabled={config.isSaving}
              onSubmit={(value) => {
                config.updateConfig({
                  ...currentConfig,
                  influx: {
                    ...currentConfig.influx,
                    token: value,
                  },
                });
              }}
            />
          }
          inline
        />
        <InfluxPart
          title="Server URL"
          description="Die vollständige URL zum InfluxDB Server mit Port und HTTP Protokoll."
          input={
            <TextInput
              initialValue={currentConfig.influx?.server}
              placeholder="Server URL"
              title="Aktuelle Server URL"
              disabled={config.isSaving}
              onSubmit={(value) => {
                config.updateConfig({
                  ...currentConfig,
                  influx: {
                    ...currentConfig.influx,
                    server: value,
                  },
                });
              }}
            />
          }
          inline
        />
        <InfluxPart
          title="Organisation"
          description="Dies ist der festgelegte Organisationsname im InfluxDB Dashboard."
          input={
            <TextInput
              initialValue={currentConfig.influx?.organisation}
              placeholder="Organisation"
              title="Aktuelle Organisation"
              disabled={config.isSaving}
              onSubmit={(value) => {
                config.updateConfig({
                  ...currentConfig,
                  influx: {
                    ...currentConfig.influx,
                    organisation: value,
                  },
                });
              }}
            />
          }
          inline
        />
        <InfluxPart
          title="Datenbank Abfrage"
          description="Diese Query wird an InfluxDB gesendet, um die gewünschten Daten abzufragen."
          info={
            <Link
              href="https://docs.influxdata.com/influxdb/v2/query-data/flux/"
              className="text-sm font-bold text-primary dark:text-dark-primary"
              target="_blank"
            >
              Dokumentation
            </Link>
          }
          gap="gap-3"
          input={<QueryArea />}
        />
      </div>
    </section>
  );
};

export default InfluxSection;
