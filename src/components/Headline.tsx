import { Link } from "react-router-dom";
import ArrowSVG from "../assets/svg/arrow.svg?react";
import Spacing from "./Spacing";

type HeadlineProps = {
	title: string;
	mobileTitle?: string;
	subtitle: string;
	backLink?: string;
};

const Headline = ({ title, mobileTitle, subtitle, backLink }: HeadlineProps) => {
	return (
		<>
			<div className="relative">
				{backLink !== undefined && (
					<Link
						to={backLink === null ? "/" : backLink}
						className="-top-10 absolute flex w-max items-center gap-1.5 pb-2"
					>
						<ArrowSVG className="shrink-0 rotate-180 fill-primary" />
						<p className="text-primary">Zurück</p>
					</Link>
				)}
				{mobileTitle ? (
					<>
						<h1 className="md:hidden">{mobileTitle}</h1>
						<h1 className="hidden md:block">{title}</h1>
					</>
				) : (
					<h1>{title}</h1>
				)}
				<p className="pt-3 text-print-width">{subtitle}</p>
			</div>
			<Spacing size="md" />
		</>
	);
};

export default Headline;
