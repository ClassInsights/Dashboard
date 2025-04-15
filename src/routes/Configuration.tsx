import Headline from "../components/Headline";
import NoAccess from "../components/NoAccess";
import { useAuth } from "../contexts/AuthContext";
import { Role } from "../types/AccessToken";

const Confgiguration = () => {
	const auth = useAuth();

	if (!auth.data?.roles.includes(Role.ADMIN)) return <NoAccess inPage={true} adminOnly={true} />;

	return (
		<Headline
			title="Konfiguration"
			subtitle="Diese Seite können nur Administratoren aufrufen, hier können Änderungen am gesamten ClassInsights Ökosystem vorgenommen werden."
			backLink="/"
		/>
	);
};

export default Confgiguration;
