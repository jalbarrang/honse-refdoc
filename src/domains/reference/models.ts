export interface ReferenceHeading {
  id: string;
  text: string;
  level: 2 | 3 | 4 | 5 | 6;
}

export interface ArticleSummary {
  path: string;
  domain: string;
  slug: string;
  title: string;
  description: string;
  updatedAt?: string;
}

export interface ReferenceArticle extends ArticleSummary {
  html: string;
  headings: ReferenceHeading[];
}

export interface ReferenceDomain {
  slug: string;
  title: string;
  description: string;
}
