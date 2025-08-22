import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";

interface TitleProps {
  title: string;
  subtitle: string;
  backLink?: string;
  titleBadge?: React.ReactNode;
  actions?: React.ReactNode;
}

const Title = ({ title, subtitle, backLink, titleBadge, actions }: TitleProps) => (
  <div className="relative mt-4 py-8">
    <div className="flex flex-row items-center gap-3 pb-2">
      <h1>{title}</h1>
      {titleBadge}
    </div>
    <p className="xl:w-3/5; md:w-3/4">{subtitle}</p>
    {actions && <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">{actions}</div>}
    {backLink && (
      <Link
        to={backLink}
        className="absolute top-0 left-0 flex items-center gap-1 text-sm text-primary"
      >
        <ChevronLeft size={20} />
        Zurück
      </Link>
    )}
  </div>
);

export default Title;
