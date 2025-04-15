import Headline from "../components/Headline";
import ComputerList from "../components/ComputerList";
import ComputerModal from "../components/ComputerModal";

const Computer = () => {
	return (
		<>
			<ComputerModal />
			<Headline
				title="Registrierte Computer"
				mobileTitle="Computer"
				subtitle="Nachfolgend finden Sie eine Übersicht aller registrierten Computer Ihrer Schule. Sie haben die Möglichkeit, gezielt nach Computern zu suchen, Filteroptionen zu nutzen und die Sortierung individuell anzupassen."
				backLink="/"
			/>
			<ComputerList />
		</>
	);
};

export default Computer;
