import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Spacing from "./Spacing";
import { SearchProvider } from "../contexts/SearchContext";
import Footer from "./Footer";
import { AuthProvider } from "../contexts/AuthContext";
import LoadingHelper from "./LoadingHelper";
import { DataProvider } from "../contexts/DataContext";

const PageWrapper = () => (
	<main className="page-spacing relative min-h-[100dvh] max-w-screen-xl">
		<AuthProvider>
			<DataProvider>
				<LoadingHelper>
					<SearchProvider>
						<Navbar />
						<Spacing size="xl" />
						<Outlet />
						<Spacing size="xl" />
						<Footer />
					</SearchProvider>
				</LoadingHelper>
			</DataProvider>
		</AuthProvider>
	</main>
);

export default PageWrapper;
