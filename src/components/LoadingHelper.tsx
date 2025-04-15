import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Role } from "../types/AccessToken";
import LogoutSVG from "../assets/svg/logout.svg?react";
import ProgressSVG from "../assets/svg/progress.svg?react";
import Spacing from "./Spacing";
import NoAccess from "./NoAccess";

const LoadingHelper = ({ children }: { children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState(true);

	const loadingTexts = useMemo(
		() => [
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
		],
		[],
	);

	const [text, setText] = useState(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);

	const intervalRef = useRef<number | null>(null);

	const auth = useAuth();
	const data = useData();

	useEffect(() => {
		if (!intervalRef.current)
			intervalRef.current = setInterval(() => {
				const randomText = loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
				setText(randomText);
			}, 1000);
	}, [loadingTexts]);

	useEffect(() => {
		setIsLoading(auth.isLoading || data.isLoading);
	}, [auth.isLoading, data.isLoading]);

	if (isLoading)
		return (
			<div className="flex h-dvh w-full flex-col items-center justify-center gap-12">
				<img src="/logo.svg" alt="ClassInsights Logo" width={80} className="pointer-events-auto cursor-pointer" />
				<div className="flex flex-col items-center text-center">
					<h1 className="pb-6">Daten werden geladen</h1>
					<p className="md:w-3/5">{text}</p>
				</div>
				<ProgressSVG width={50} className="h-20 w-20 shrink-0 animate-spin fill-primary" />
			</div>
		);

	if (intervalRef.current) {
		clearInterval(intervalRef.current);
		intervalRef.current = null;
	}

	if (!auth.data?.roles.includes(Role.ADMIN) && !auth.data?.roles.includes(Role.TEACHER)) return <NoAccess />;

	if (!auth.data)
		return (
			<div className="flex h-dvh w-full flex-col items-center justify-center gap-12">
				<img src="/logo.svg" alt="ClassInsights Logo" width={80} className="pointer-events-auto cursor-pointer" />
				<div className="flex flex-col items-center text-center">
					<h1>Anmeldung fehlgeschlagen</h1>
					<Spacing size="md" />
					<p className="md:w-3/5">
						Bei der Anmeldung ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut oder melden
						Sie sich bei Ihrem Schul-Administrator.
					</p>
					<Spacing size="md" />
					<div className="flex w-max cursor-pointer items-center gap-1.5" onClick={auth.logout} onKeyDown={auth.logout}>
						<p className="text-primary">Abmelden</p>
						<LogoutSVG width={20} className="shrink-0 fill-primary" />
					</div>
				</div>
			</div>
		);

	if (!data.computers || !data.rooms || !data.lessons)
		return (
			<div className="flex h-dvh w-full flex-col items-center justify-center gap-12">
				<img src="/logo.svg" alt="ClassInsights Logo" width={80} className="pointer-events-auto cursor-pointer" />
				<div className="flex flex-col items-center text-center">
					<h1>Datenabfrage fehlgeschlagen</h1>
					<Spacing size="md" />
					<p className="md:w-3/5">
						Beim Abrufen der Daten ist ein Fehler aufgetreten. Bitte warten Sie ein paar Minuten und versuchen Sie es
						danach erneut. Wenn das Problem weiterhin über mehrere Tage hinweg besteht, wenden Sie sich bitte an Ihren
						Schul-Administrator.
					</p>
					<Spacing size="md" />
					<div className="flex w-max cursor-pointer items-center gap-1.5" onClick={auth.logout} onKeyDown={auth.logout}>
						<p className="text-primary">Abmelden</p>
						<LogoutSVG width={20} className="shrink-0 fill-primary" />
					</div>
				</div>
			</div>
		);

	return children;
};

export default LoadingHelper;
