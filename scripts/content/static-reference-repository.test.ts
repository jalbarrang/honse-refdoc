import { describe, expect, it } from "vitest";
import { StaticReferenceRepository } from "../../src/domains/reference/infrastructure";

describe("StaticReferenceRepository", () => {
  it("lists manifest metadata and lazily loads article JSON", async () => {
    const repository = new StaticReferenceRepository();

    expect(repository.listDomains()).toHaveLength(6);
    expect(repository.listArticles("banners")).toHaveLength(10);
    await expect(repository.getArticle("/strategy/grand-live")).resolves.toMatchObject({
      domain: "strategy",
      slug: "grand-live",
      title: "Grand Live",
    });
    await expect(repository.getArticle("/missing")).resolves.toBeUndefined();
  });
});
