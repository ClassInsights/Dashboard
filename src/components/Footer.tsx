const Footer = () => {
	return (
		<footer className="page-spacing absolute right-0 bottom-0 left-0 flex max-w-screen-xl select-none flex-col items-center justify-between bg-background pb-8 sm:flex-row">
			<p>&#169; {new Date().getFullYear()} ClassInsights</p>
			<div className="flex justify-between gap-10">
				<a href="https://classinsights.at/impressum" target="_blank" rel="noreferrer">
					<small>Impressum</small>
				</a>
				<a href="https://classinsights.at/datenschutz" target="_blank" rel="noreferrer">
					<small>Datenschutz</small>
				</a>
			</div>
		</footer>
	);
};

export default Footer;
