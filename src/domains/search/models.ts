export interface SearchHeading {
  id: string;
  text: string;
}

export interface SearchDocument {
  path: string;
  domain: string;
  title: string;
  description: string;
  headings: SearchHeading[];
  body: string;
}

export interface SearchQuery {
  text: string;
  domain?: string;
  limit?: number;
}

export type SearchMatch = "title" | "heading" | "body";

export interface SearchResult {
  path: string;
  domain: string;
  title: string;
  description: string;
  score: 1 | 2 | 3;
  match: SearchMatch;
  heading?: SearchHeading;
}
