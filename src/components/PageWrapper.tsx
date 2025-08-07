import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Spacing from "./Spacing";
import Footer from "./Footer";
import { AuthProvider } from "../contexts/AuthContext";
import LoadingHelper from "./LoadingHelper";
import { ToastProvider } from "../contexts/ToastContext";
import { SettingsProvider } from "../contexts/SettingsContext";
import { UpdateProvider } from "../contexts/UpdateContext";
import UpdateChecker from "./UpdateChecker";
import { useEffect } from "react";

const PageWrapper = () => {
	const location = useLocation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: Scroll to top on route change
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	return (
		<main className="page-spacing relative min-h-[100dvh] max-w-screen-xl">
			<ToastProvider>
				<AuthProvider>
					<SettingsProvider>
						<UpdateProvider>
							<LoadingHelper>
								<UpdateChecker />
								<Navbar />
								<Spacing size="xl" />
								<Outlet />
								<Spacing size="xl" />
								<Footer />
							</LoadingHelper>
						</UpdateProvider>
					</SettingsProvider>
				</AuthProvider>
			</ToastProvider>
		</main>
	);
};

export default PageWrapper;
