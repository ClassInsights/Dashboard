import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";

interface TitleProps {
  title: string;
  subtitle: string;
  backLink?: string;
}

const Title = ({ title, subtitle, backLink }: TitleProps) => (
  <div className="relative mt-4 py-8">
    <h1 className="pb-2">{title}</h1>
    <p className="xl:w-3/5; md:w-3/4">{subtitle}</p>
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
