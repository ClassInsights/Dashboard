import { useEffect, useRef, useState } from "react";

const Loading = () => {
  const loadingTexts = [
    "Drehe Däumchen und lade Daten...",
    "Poliere die Pixel auf Hochglanz...",
    "Wecke die Hamster im Serverraum...",
    "Beschwöre digitale Magie...",
    "Sortiere Einsen und Nullen (die Klassiker)...",
    "Füttere die Datenkraken...",
    "Entwirre den Datensalat...",
    "Tue so, als würde ich schwer arbeiten...",
    "Moment, suche noch den An-Knopf...",
    "Lade... fast so schnell wie mein Kaffeedurst am Morgen.",
    "Optimiere den Fluxkompensator...",
    "Zähle Schäfchen... äh, Bytes...",
    "Gleich geht's los, versprochen!",
    "Reticuliere Splines... (Ein Klassiker!)",
    "Halte durch, es ist fast geschafft!",
    "Frage die Bits höflich, ob sie mitmachen wollen...",
    "Suche nach dem Sinn des Ladens...",
    "Diese Ladezeit wird Ihnen präsentiert von... Geduld!",
    "Bin gleich zurück, muss kurz die Kabel neu stecken.",
  ];

  const randomText = () => loadingTexts[Math.floor(Math.random() * loadingTexts.length)];

  const [text, setText] = useState(randomText());
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => setText(randomText()), 1500);
    return () => clearInterval(intervalRef.current);
  }, [randomText]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-12">
      <img src="/logo.svg" alt="ClassInsights Logo" width={100} className="animate-pulse" />
      <div className="flex flex-col items-center pb-20 text-center">
        <h1 className="pb-6">Daten werden geladen</h1>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Loading;
