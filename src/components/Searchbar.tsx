import { type ChangeEvent, useCallback, useEffect } from "react";
import { useSearch } from "../contexts/SearchContext";
import SearchSVG from "../assets/svg/search.svg?react";
import { useComputer } from "../contexts/ComputerContext";

const SearchBar = () => {
	const search = useSearch();
	const { open } = useComputer();

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value.trim();
			search.generateResult(value);
		},
		[search.generateResult],
	);

	useEffect(() => {
		const input = document.getElementById("search") as HTMLInputElement;
		if (input) input.focus();
	});

	if (!search.isVisible) return <></>;

	return (
		<dialog className="fixed top-0 z-20 flex h-dvh w-screen items-center justify-center bg-transparent">
			<div className="h-full w-full cursor-pointer bg-black opacity-30" onClick={search.hide} onKeyDown={search.hide} />
			<div className="absolute mb-44 md:mb-0 md:w-[30rem]">
				<div className={`bg-background px-5 pt-2 ${search.result.length === 0 ? "rounded-lg" : "rounded-t-lg"}`}>
					<p className="text-sm">Tipp: Mit Strg + K kann diese Suchleiste überall geöffnet werden</p>
					<div className="mt-2 h-[2px] w-full bg-container" />
					<div className="mx-2 flex items-center gap-2">
						<input
							id="search"
							type="text"
							autoComplete="off"
							autoCorrect="off"
							spellCheck="false"
							maxLength={40}
							placeholder="Suche nach Computer Name, IP- oder Mac-Adresse..."
							onChange={handleChange}
							className="my-2 w-full bg-transparent outline-none"
						/>
						<SearchSVG width={20} className="shrink-0 cursor-pointer fill-black" />
					</div>
				</div>
				<div className={`h-[2px] bg-background px-5 ${search.result.length === 0 ? "opacity-0" : ""}`}>
					<div className="h-[2px] bg-container" />
				</div>
				<div className={search.result.length === 0 ? "opacity-0" : ""}>
					<p className="bg-background px-5 pt-5">Gefundene Computer</p>
					<div className="h-36">
						<div className="max-h-36 overflow-y-scroll rounded-b-lg bg-background px-5">
							{search.result.map((result) => (
								<button
									type="button"
									key={result.computerId}
									className="flex h-12 w-full cursor-pointer items-center border-container border-t-2 px-2 outline-none hover:border-container-selected hover:bg-container-selected focus:border-container-selected focus:bg-container-selected"
									onClick={() => {
										search.hide();
										open(result);
									}}
								>
									{result.room}
									<span className="ml-5 font-medium">
										<span>{result.text.slice(0, result.matchStart)}</span>
										<span className="text-primary">
											{result.text.slice(result.matchStart, result.matchStart + result.matchLength)}
										</span>
										{result.text.slice(result.matchStart + result.matchLength)}
									</span>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</dialog>
	);
};

export default SearchBar;
