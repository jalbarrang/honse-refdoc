import type { ArticleSummary, ReferenceArticle, ReferenceDomain } from "./models";

export interface ReferenceRepository {
  getArticle(path: string): Promise<ReferenceArticle | undefined>;
  listDomains(): ReferenceDomain[];
  listArticles(domain: string): ArticleSummary[];
}
