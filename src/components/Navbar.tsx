import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuSVG from "../assets/svg/menu.svg?react";
import SearchSVG from "../assets/svg/search.svg?react";
import { useSearch } from "../contexts/SearchContext";

/** The main Navigation Bar component */
const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();
	const search = useSearch();

	/** Handler for clicking inside the viewport */
	const onDocumentClick = () => {
		setIsOpen(false);
		document.removeEventListener("click", onDocumentClick);
	};

	/** Extract the mobile menu */
	const handleMenu = () => {
		if (isOpen) return;
		setIsOpen(true);
		setTimeout(() => document.addEventListener("click", onDocumentClick), 100);
	};

	const scrollToTop = useCallback(() => {
		if (location.pathname !== "/") navigate("/");
		else {
			window.scrollTo({ top: 0 });
			history.pushState("", document.title, location.pathname + location.search);
		}
	}, [location, navigate]);

	return (
		<header
			key=""
			className="page-spacing fixed right-0 left-0 z-10 flex max-w-screen-xl justify-between bg-background pt-6 pb-3"
		>
			<img
				src="/logo.svg"
				alt="ClassInsights Logo"
				width={40}
				onClick={scrollToTop}
				onKeyDown={scrollToTop}
				className="pointer-events-auto cursor-pointer"
			/>
			<nav className="relative flex items-center gap-5">
				{/* Mobile Search Button */}
				<nav className="cursor-pointer md:hidden" aria-label="Suche" onClick={search.show} onKeyDown={search.show}>
					<SearchSVG width={25} className="shrink-0 fill-primary" />
				</nav>
				{/* Mobile Menu Icon */}
				<MenuSVG width={25} onClick={handleMenu} onKeyDown={handleMenu} className="shrink-0 cursor-pointer md:hidden" />
				{/* Mobile Menu */}
				<div
					className={`absolute top-10 right-0 flex flex-col overflow-hidden rounded-lg bg-container shadow-md transition-opacity duration-300 ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
				>
					{["Computer", "Räume", "Konfiguration"].map((label) => (
						<Link
							key={label}
							to={`/${label.toLowerCase()}`}
							className="w-full py-2 pr-3 pl-14 text-right hover:bg-container-selected"
						>
							{label}
						</Link>
					))}
				</div>
				{/* Desktop Menu */}
				<div className="hidden items-center gap-8 md:flex">
					<Link to="/computer">Computer</Link>
					<Link to="/räume">Räume</Link>
					<Link to="/konfiguration">Konfiguration</Link>
					<div
						className="hidden cursor-pointer items-center gap-1.5 text-primary md:flex"
						onClick={search.show}
						onKeyDown={search.show}
					>
						<p>Suche</p>
						<SearchSVG className="shrink-0 fill-primary" />
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
