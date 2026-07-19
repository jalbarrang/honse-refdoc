import type { ArticleSummary } from "./models";
import type { ReferenceRepository } from "./reference-repository";

export function listDomainArticles(
  repository: ReferenceRepository,
  domain: string,
): ArticleSummary[] {
  return repository.listArticles(domain);
}
