import { ChevronRight } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

type ChangelogProps = {
  title: string;
  description: string;
  body?: string | null;
  releaseUrl: string;
};

const Changelog = ({ title, description, body, releaseUrl }: ChangelogProps) => {
  if (!body) return null;

  return (
    <Card className="w-full grow overflow-hidden">
      <CardHeader>
        <CardTitle>
          <h3 className="text-2xl">{title}</h3>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            li: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
            h1: ({ children }) => (
              <h4 className="mt-4 text-xl font-medium first:mt-0">{children}</h4>
            ),
            h2: ({ children }) => <h5 className="mt-3 text-lg font-medium">{children}</h5>,
            h3: ({ children }) => <h6 className="mt-2 font-medium">{children}</h6>,
            p: ({ children }) => <p className="pb-2 first:mt-0">{children}</p>,
            a: ({ children, href }) => (
              <a href={href} target="_blank" rel="noopener noreferrer">
                <Button variant="link" className="p-0!">
                  {children}
                </Button>
              </a>
            ),
          }}
        >
          {body}
        </Markdown>
      </CardContent>
      <CardFooter>
        <a href={releaseUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="link" className="p-0!">
            Release ansehen
            <ChevronRight />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

export default Changelog;
