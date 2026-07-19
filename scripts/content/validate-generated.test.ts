import { describe, expect, it } from "vitest";
import { validateGeneratedContent } from "./validate-generated";

describe("generated reference content", () => {
  it("passes source, route, fragment, ID, link, and asset validation", async () => {
    await expect(validateGeneratedContent()).resolves.toEqual({
      articleCount: 50,
      semanticHeadingCount: 180,
      outlineHeadingCount: 130,
      assetCount: 132,
      imageNodeCount: 136,
      routeCount: 50,
    });
  });
});
