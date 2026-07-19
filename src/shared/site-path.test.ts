import { describe, expect, it } from "vitest";
import { normalizeBasePath, rewriteSiteUrls, toSitePath } from "./site-path";

describe("site paths", () => {
  it("normalizes root and project deployment paths", () => {
    expect(normalizeBasePath(undefined)).toBe("");
    expect(normalizeBasePath("/")).toBe("");
    expect(normalizeBasePath(" honse-refdoc/ ")).toBe("/honse-refdoc");
  });

  it("prefixes same-site root-relative paths only once", () => {
    expect(toSitePath("/", "/honse-refdoc/")).toBe("/honse-refdoc/");
    expect(toSitePath("/new-player", "/honse-refdoc/")).toBe("/honse-refdoc/new-player");
    expect(toSitePath("/honse-refdoc/new-player", "/honse-refdoc/")).toBe(
      "/honse-refdoc/new-player",
    );
    expect(toSitePath("#top", "/honse-refdoc/")).toBe("#top");
    expect(toSitePath("https://example.com", "/honse-refdoc/")).toBe("https://example.com");
    expect(toSitePath("//cdn.example.com/app.js", "/honse-refdoc/")).toBe(
      "//cdn.example.com/app.js",
    );
  });

  it("rewrites trusted generated HTML URLs without changing external URLs", () => {
    const html =
      '<a href="/strategy">Strategy</a><img src="/media/reference/image-001.png"><a href="#notes">Notes</a><a href="https://example.com">External</a><script src="//cdn.example.com/app.js"></script>';

    expect(rewriteSiteUrls(html, "/honse-refdoc/")).toBe(
      '<a href="/honse-refdoc/strategy">Strategy</a><img src="/honse-refdoc/media/reference/image-001.png"><a href="#notes">Notes</a><a href="https://example.com">External</a><script src="//cdn.example.com/app.js"></script>',
    );
  });
});
