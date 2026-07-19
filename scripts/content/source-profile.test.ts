import { describe, expect, it } from "vitest";
import { EXPECTED_SOURCE } from "./content-config";
import { profileSource } from "./source-profile";

describe("content source profile", () => {
  it("matches the approved line, heading, link, and image profile", async () => {
    const source = await profileSource();

    expect(source.stats).toEqual(EXPECTED_SOURCE);
    expect(source.images.map((image) => image.number)).toEqual(
      Array.from({ length: 132 }, (_, index) => index + 1),
    );
    expect(source.normalizedSource).not.toContain("\u000b");
  });
});
