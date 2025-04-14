type BadgeProps = {
	text: string;
	headIcon?: React.ReactNode;
	tailIcon?: React.ReactNode;
	onClick?: () => void;
};

const Badge = ({ text, headIcon, tailIcon, onClick }: BadgeProps) => {
	return (
		<div
			className={`flex items-center gap-3 rounded-lg bg-container px-5 py-2 ${onClick ? "cursor-pointer" : "cursor-default"}`}
			onClick={onClick}
			onKeyDown={onClick}
		>
			{headIcon && headIcon}
			<p className="font-medium">{text}</p>
			{tailIcon && tailIcon}
		</div>
	);
};

export default Badge;
