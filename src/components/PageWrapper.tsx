import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Spacing from "./Spacing";
import { SearchProvider } from "../contexts/SearchContext";
import Footer from "./Footer";
import { AuthProvider } from "../contexts/AuthContext";
import LoadingHelper from "./LoadingHelper";
import { DataProvider } from "../contexts/DataContext";
import { ComputerProvider } from "../contexts/ComputerContext";
import SearchBar from "./Searchbar";
import ComputerModal from "./ComputerModal";
import { ToastProvider } from "../contexts/ToastContext";

const PageWrapper = () => (
	<main className="page-spacing relative min-h-[100dvh] max-w-screen-xl">
		<ToastProvider>
			<AuthProvider>
				<DataProvider>
					<LoadingHelper>
						<ComputerProvider>
							<SearchProvider>
								<SearchBar />
								<ComputerModal />
								<Navbar />
								<Spacing size="xl" />
								<Outlet />
								<Spacing size="xl" />
								<Footer />
							</SearchProvider>
						</ComputerProvider>
					</LoadingHelper>
				</DataProvider>
			</AuthProvider>
		</ToastProvider>
	</main>
);

export default PageWrapper;
