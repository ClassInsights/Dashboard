type BadgeProps = {
	text: string;
	headIcon?: React.ReactNode;
	tailIcon?: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
};

const Badge = ({ text, headIcon, tailIcon, onClick, disabled = false }: BadgeProps) => {
	return (
		<div
			className={`flex items-center gap-3 rounded-lg bg-container px-5 py-2 ${disabled ? "cursor-not-allowed" : onClick ? "cursor-pointer" : "cursor-default"}`}
			onClick={disabled ? undefined : onClick}
			onKeyDown={disabled ? undefined : onClick}
		>
			{headIcon && headIcon}
			<p className="font-medium">{text}</p>
			{tailIcon && tailIcon}
		</div>
	);
};

export default Badge;
