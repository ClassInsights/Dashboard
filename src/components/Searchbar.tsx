import { useSearch } from "../contexts/SearchContext";

const SearchBar = () => {
	const search = useSearch();

	if (!search.isVisible) {
		return <></>;
	}

	return (
		<dialog>
			<div className="h-full w-full cursor-pointer bg-black opacity-30" onClick={search.hide} onKeyDown={search.hide} />
			<h1>Search</h1>
		</dialog>
	);
};

export default SearchBar;
