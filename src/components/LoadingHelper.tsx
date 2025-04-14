import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

const LoadingHelper = ({ children }: { children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState(true);
	const auth = useAuth();
	const data = useData();

	useEffect(() => {
		setIsLoading(auth.isLoading || data.isLoading);
	}, [auth.isLoading, data.isLoading]);

	if (isLoading) return <h1>Loading</h1>;

	if (!auth.data) return <h1>Auth failed</h1>;
	if (!data.computers) return <h1>Computer fetch failed</h1>;
	if (!data.rooms) return <h1>Rooms fetch failed</h1>;

	return children;
};

export default LoadingHelper;
