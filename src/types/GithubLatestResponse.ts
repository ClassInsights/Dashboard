export type GitHubLatestResponse = {
  tag_name: string;
  body?: string | null;
};

export const isGitHubLatestResponse = (data: unknown): data is GitHubLatestResponse =>
  data !== null &&
  typeof data === "object" &&
  "tag_name" in data &&
  typeof data.tag_name === "string" &&
  (!("body" in data) || typeof data.body === "string" || data.body === null);
