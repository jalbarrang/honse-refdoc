import { describe, expect, it } from "vitest";
import { loadSearchDocuments } from "./load-search-documents";

describe("loadSearchDocuments", () => {
  it("caches the lazy import and returns search documents", async () => {
    const firstLoad = loadSearchDocuments();
    const secondLoad = loadSearchDocuments();

    expect(secondLoad).toBe(firstLoad);
    await expect(firstLoad).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: expect.stringMatching(/^\//),
          domain: expect.any(String),
          title: expect.any(String),
          headings: expect.any(Array),
          body: expect.any(String),
        }),
      ]),
    );
  });
});
