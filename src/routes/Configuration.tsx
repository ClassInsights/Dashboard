import { useCallback, useMemo } from "react";
import Headline from "../components/Headline";
import NoAccess from "../components/NoAccess";
import Setting from "../components/Setting";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { Role } from "../types/AccessToken";
import { useToast } from "../contexts/ToastContext";
import Spacing from "../components/Spacing";
import RoomTable from "../components/RoomTable";
import SaveSVG from "../assets/svg/save.svg?react";
import ProgressSVG from "../assets/svg/progress.svg?react";
import RefreshSVG from "../assets/svg/refresh.svg?react";

const Confgiguration = () => {
	const auth = useAuth();
	const settings = useSettings();
	const toast = useToast();

	const currentSettings = useMemo(() => settings.getSettings(), [settings.getSettings]);

	const saveSettings = useCallback(() => {
		settings
			.saveSettings()
			.then(() => toast.showMessage("Erfolgreich gespeichert"))
			.catch(() => toast.showMessage("Fehler beim Speichern", "error"));
	}, [settings.saveSettings, toast.showMessage]);

	if (!auth.data?.roles.includes(Role.ADMIN) && !auth.data?.roles.includes(Role.OWNER))
		return <NoAccess inPage={true} adminOnly={true} />;

	if (settings.isLoading)
		return (
			<div className="flex h-full w-full flex-col items-center justify-center">
				<ProgressSVG width={70} height={70} className="shrink-0 animate-spin fill-primary" />
				<Spacing size="md" />
				<h2>Lade Einstellungen</h2>
			</div>
		);

	if (!settings.getSettings())
		return (
			<Headline
				title="Fehler beim Laden der Einstellungen"
				subtitle="Die Einstellungen konnten nicht geladen werden. Bitte versuchen Sie es später erneut."
				backLink="/"
			/>
		);

	return (
		<>
			{settings.hasUnsavedChanges && (
				<button
					type="button"
					className="fixed right-4 bottom-4 z-10 flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-background shadow-md"
					onClick={saveSettings}
				>
					Speichern
					<SaveSVG width={15} className="shrink-0 fill-background" />
				</button>
			)}
			<Headline
				title="Konfiguration"
				subtitle="Diese Seite können nur Administratoren aufrufen, hier können Änderungen am gesamten ClassInsights Ökosystem vorgenommen werden."
				backLink="/"
			/>
			<div className="flex w-full justify-end">
				<RefreshSVG className="shrink-0 cursor-pointer fill-primary" onClick={() => settings.refreshSettings()} />
			</div>
			<div className="flex flex-col gap-20">
				<Setting
					title="Tagesende"
					desciption="Hiermit wird die Zeit konfiguriert, die gewartet wird, bis eine Herunterfahren-Meldung an alle Computer in diesem Raum gesendet wird, wenn in diesem Raum heute keine Unterrichtsstunden mehr stattfinden. (Standard: 50 Minuten)"
					inputValue={currentSettings?.noLessonsTime}
					inputAction={(value) => settings.updateSettings("noLessonsTime", value)}
					currentHint={
						<p>
							Wenn in einem Raum keine Unterrichtsstunden mehr stattfinden, wird nach{" "}
							<span className="text-primary">{currentSettings?.noLessonsTime} Minuten</span>{" "}
							{currentSettings?.delayShutdown ? (
								<span>
									und anschließenden{" "}
									<span className="text-primary">{currentSettings.shutdownDelay} Minuten Wartezeit </span>
								</span>
							) : (
								""
							)}
							eine Herunterfahren-Meldung an alle eingeschalteten Computer dieses Raumes versendet.
						</p>
					}
				/>
				<Setting
					title="Stundenlücken"
					desciption="Bezieht sich auf die Zeit in Minuten zwischen zwei Unterrichtsstunden, die entscheidet, ob an einen Computer ein Shutdown-Befehl gesendet wird. (Standard: 20 Minuten)"
					toggleValue={currentSettings?.checkGap}
					toggleAction={(value) => settings.updateSettings("checkGap", value)}
					inputValue={currentSettings?.lessonGapMinutes}
					inputAction={(value) => settings.updateSettings("lessonGapMinutes", value)}
					currentHint={
						<p>
							Wenn zwischen zwei Unterrichtseinheiten mehr als{" "}
							<span className="text-primary">{currentSettings?.lessonGapMinutes} Minuten</span> dazwischen sind, wird{" "}
							{currentSettings?.delayShutdown ? (
								<span>
									nach <span className="text-primary">{currentSettings.shutdownDelay} Minuten Wartezeit </span>
								</span>
							) : (
								""
							)}{" "}
							ein Shutdown-Befehl an die Computer dieses Raumes gesendet. Wenn weniger als 30 Minuten zwischen zwei
							Stunden sind, wird kein Shutdown-Befehl gesendet.
						</p>
					}
				/>
				<Setting
					title="Wartezeit (Puffer)"
					desciption="Dies ist die Zeit, die immer nach einer Stunde gewartet wird, bevor überprüft wird, ob ein Herunterfahren-Meldung gesendet werden sollte oder nicht. (Standard: 3 Minuten)"
					toggleValue={currentSettings?.delayShutdown}
					toggleAction={(value) => settings.updateSettings("delayShutdown", value)}
					inputValue={currentSettings?.shutdownDelay}
					inputAction={(value) => settings.updateSettings("shutdownDelay", value)}
					currentHint={
						<p>
							Nun wird <span className="text-primary">{currentSettings?.shutdownDelay} Minuten</span> nach
							Unterrichtsende für alle eingeschalteten Computer überprüft, ob sie eine eine automatische
							Herunterfahren-Meldung erhalten sollten.
						</p>
					}
				/>
				<Setting
					title="Abmelden bei Inaktivität"
					desciption="Damit wird die Zeit in Minuten konfiguriert, nach der ein inaktiver Benutzer automatisch abgemeldet wird. (Standard: 15 Minuten)"
					toggleValue={currentSettings?.checkAfk}
					toggleAction={(value) => settings.updateSettings("checkAfk", value)}
					inputValue={currentSettings?.afkTimeout}
					inputAction={(value) => settings.updateSettings("afkTimeout", value)}
					currentHint={
						<p>
							Wenn ein Benutzer den Computer für <span>{currentSettings?.afkTimeout} Minuten</span> nicht verwendet hat,
							wird der Benutzer automatisch abgemeldet.
						</p>
					}
				/>
				<Setting
					title="Herunterfahren ohne Benutzer"
					desciption="Hiermit wird bestimmt, ob Computer ohne angemeldete Benutzer automatisch heruntergefahren werden sollten. (Standard: Ja)"
					toggleValue={currentSettings?.checkUser}
					toggleAction={(value) => settings.updateSettings("checkUser", value)}
				/>
				<div className="mx-auto my-10 h-[2px] w-3/4 bg-container" />
				<div>
					<h2>Raumkonfiguration</h2>
					<Spacing size="sm" />
					<p>
						Damit ClassInsights funktionieren kann, muss in jedem Raum ein einheitliches Benennungsschema der Computer
						verwendet werden. Somit können wir anhand des Computernamens herausfinden, in welchem Raum sich dieser
						befindet und was für Unterrichtsstunden in diesem Raum stattfinden.
					</p>
					<Spacing size="sm" />
					<p>
						Sie müssen für alle Räume, in denen ClassInsights verwendet wird, eine{" "}
						<span className="font-medium">Regular Expression (Regex)</span> festlegen. Mithilfe des{" "}
						<span className="font-medium">Regex Umwandlers</span> können Sie ein einfaches{" "}
						<span className="font-medium">Pattern</span> (mit * und ?) in einen Regex umwandeln.
					</p>
					<Spacing size="md" />
					<h3>Pattern</h3>
					<p>Ein Pattern ist ein normaler Text, mit zwei speziellen Sonderzeichen: * (Stern) und ? (Fragezeichen)</p>
					<p>? steht für ein beliebiges Zeichen an dieser Stelle (z. B. A, -, 3, ...)</p>
					<p>* steht für beliebig viele Zeichen an dieser Stelle (z. B. CI, A, 123, ...)</p>
					<Spacing size="sm" />
					<b>Beispiele</b>
					<p>Beginnt mit “DV6-”, danach beliebige Zeichen: DV6-*</p>
					<p>Beginnt mit “DV1-”, danach genau zwei beliebige Zeichen, dann “-PC”: DV6-??-PC</p>
					<p>Beginn mit zwei Zahlen, danach “-CPR”: ??-CPR</p>
					<Spacing size="md" />
					<h3>Regex</h3>
					<p>Regular Expressions ermöglichen es, komplexe Muster mit einer “Schablone” abzugleichen.</p>
					<div className="flex flex-col md:flex-row md:gap-4">
						<p>Hilfreiche Ressourcen:</p>
						<a href="https://regexlearn.com/learn" className="text-primary" target="_blank" rel="noreferrer">
							Regex lernen
						</a>
						<a href="https://regex101.com/" className="text-primary" target="_blank" rel="noreferrer">
							Regex testen
						</a>
					</div>
					<Spacing size="sm" />
					<b>Beispiele</b>
					<p>Beginnt mit “DV6-”, danach beliebige Zeichen: ^DV6-.*$</p>
					<p>Beginnt mit “DV1-”, danach genau zwei beliebige Zeichen, dann “-PC”: ^DV6-..-PC$</p>
					<p>Beginn mit zwei Zahlen, danach “-CPR”: ^..-CPR$</p>
					<Spacing size="md" />
					<RoomTable />
				</div>
			</div>
		</>
	);
};

export default Confgiguration;
