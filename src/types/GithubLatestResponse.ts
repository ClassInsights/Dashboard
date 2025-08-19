export type GitHubLatestResponse = {
  tag_name: string;
};

export const isGitHubLatestResponse = (data: unknown): data is GitHubLatestResponse =>
  data !== null &&
  typeof data === "object" &&
  "tag_name" in data &&
  typeof data.tag_name === "string";
