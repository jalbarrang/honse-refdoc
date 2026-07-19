import manifest from "../../../generated/manifest.json";
import type { ArticleSummary, ReferenceArticle, ReferenceDomain } from "../models";
import type { ReferenceRepository } from "../reference-repository";

const articleLoaders = import.meta.glob<ReferenceArticle>("../../../generated/articles/*.json", {
  import: "default",
});

function fileName(summary: ArticleSummary): string {
  return summary.path === `/${summary.domain}`
    ? `${summary.domain}.json`
    : `${summary.domain}--${summary.slug}.json`;
}

export class StaticReferenceRepository implements ReferenceRepository {
  readonly #domains = manifest.domains satisfies ReferenceDomain[];
  readonly #summaries = manifest.summaries satisfies ArticleSummary[];
  readonly #loaders = new Map(
    this.#summaries.map((summary) => {
      const suffix = `/articles/${fileName(summary)}`;
      const loader = Object.entries(articleLoaders).find(([path]) =>
        path.replaceAll("\\", "/").endsWith(suffix),
      )?.[1];
      if (!loader) throw new Error(`Missing generated article loader for ${summary.path}`);
      return [summary.path, loader] as const;
    }),
  );

  async getArticle(path: string): Promise<ReferenceArticle | undefined> {
    return this.#loaders.get(path)?.();
  }

  listDomains(): ReferenceDomain[] {
    return this.#domains;
  }

  listArticles(domain: string): ArticleSummary[] {
    return this.#summaries.filter((article) => article.domain === domain);
  }
}
