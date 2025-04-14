type SpacingProps = {
	id?: string;
	size?: "sm" | "md" | "lg" | "xl";
};

const Spacing = ({ id, size = "lg" }: SpacingProps): JSX.Element => {
	return (
		<div
			id={id}
			className={`w-full ${size === "sm" ? "h-2" : size === "md" ? "h-8" : size === "lg" ? "h-24" : "h-52"}`}
		/>
	);
};

export default Spacing;
