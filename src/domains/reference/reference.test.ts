import { describe, expect, it, vi } from "vitest";
import { getArticle, listDomainArticles } from ".";
import type { ReferenceArticle, ReferenceRepository } from ".";

const article: ReferenceArticle = {
  path: "/training/basics",
  domain: "training",
  slug: "basics",
  title: "Training Basics",
  description: "How training works.",
  html: "<p>Train wisely.</p>",
  headings: [{ id: "energy", text: "Energy", level: 2 }],
};

function repository(): ReferenceRepository {
  return {
    getArticle: vi.fn(async () => article),
    listDomains: vi.fn(() => []),
    listArticles: vi.fn(() => [article]),
  };
}

describe("reference application functions", () => {
  it("gets an article by path through the repository port", async () => {
    const port = repository();

    await expect(getArticle(port, article.path)).resolves.toBe(article);
    expect(port.getArticle).toHaveBeenCalledWith(article.path);
  });

  it("lists summaries for one domain through the repository port", () => {
    const port = repository();

    expect(listDomainArticles(port, "training")).toEqual([article]);
    expect(port.listArticles).toHaveBeenCalledWith("training");
  });
});
