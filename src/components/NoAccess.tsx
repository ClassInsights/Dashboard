import { useAuth } from "../contexts/AuthContext";
import Spacing from "./Spacing";
import ArrowSVG from "../assets/svg/arrow.svg?react";
import LogoutSVG from "../assets/svg/logout.svg?react";
import { useNavigate } from "react-router-dom";

const NoAccess = ({ inPage = false, adminOnly = false }: { inPage?: boolean; adminOnly?: boolean }) => {
	const auth = useAuth();
	const navigate = useNavigate();

	return (
		<div className={`flex w-full flex-col items-center justify-center gap-12 ${inPage ? "h-full" : "h-dvh"}`}>
			<img src="/logo.svg" alt="ClassInsights Logo" width={80} className="pointer-events-auto cursor-pointer" />
			<div className="flex flex-col items-center text-center">
				<h1>Kein Zugriff</h1>
				<Spacing size="md" />
				<p className="md:w-3/5">
					Um auf {inPage ? "diese Seite" : "das Dashboard"} zugreifen zu können, müssen Sie{" "}
					{adminOnly ? "ein Administrator" : "entweder eine Lehrperson oder ein Administrator"} sein.
				</p>
				<Spacing size="sm" />
				<p className="md:w-3/5">
					Wenn Sie der Meinung sind, dass es sich hierbei um einen Fehler handelt, melden Sie sich doch bei Ihrem
					Schul-Administrator.
				</p>
				<Spacing size="md" />
				<div
					className="flex w-max cursor-pointer items-center gap-1.5"
					onClick={() => (inPage ? navigate("/") : auth.logout())}
					onKeyDown={() => (inPage ? navigate("/") : auth.logout())}
				>
					<p className="text-primary">{inPage ? "Zurück zur Startseite" : "Abmelden"}</p>
					{inPage ? (
						<ArrowSVG width={20} className="shrink-0 fill-primary" />
					) : (
						<LogoutSVG width={20} className="shrink-0 fill-primary" />
					)}
				</div>
			</div>
		</div>
	);
};

export default NoAccess;
