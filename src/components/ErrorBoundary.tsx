import type { FallbackProps } from "react-error-boundary";
import { Button } from "./ui/button";

const ErrorBoundaryFallback = ({ error }: FallbackProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-12">
      <img src="/logo.svg" alt="ClassInsights Logo" width={100} />
      <div className="flex flex-col items-center pb-20 text-center">
        <h1 className="pb-6">Etwas ist fehlgeschlagen</h1>
        <p className="w-3/4 pb-5 lg:w-1/2">
          Leider ist beim Aufrufen des Dashboards ein unerwarteter Fehler aufgetreten. Bitte
          versuchen Sie es später erneut. Wenn der Fehler bestehen bleibt kontaktieren Sie bitte
          Ihren Systemadministrator oder den{" "}
          <Button variant="link" className="m-0! p-0!">
            <a
              href={`mailto:office@classinsights.at?subject=Dashboard%20Crash&body=%0A%0AFehlerdetails%3A%0A${error.message}`}
            >
              ClassInsights Support
            </a>
          </Button>
          . (Bitte die Fehlerdetails in der Email nicht entfernen!)
        </p>
        <Button onClick={() => window.location.reload()}>Erneut versuchen</Button>
      </div>
    </div>
  );
};

export default ErrorBoundaryFallback;
