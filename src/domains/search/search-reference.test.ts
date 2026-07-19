import { describe, expect, it } from "vitest";
import { searchReference } from ".";
import type { SearchDocument } from ".";

const documents: SearchDocument[] = [
  {
    path: "/racing/pace",
    domain: "racing",
    title: "Pace",
    description: "Understand race pace.",
    headings: [],
    body: "Position affects stamina use.",
  },
  {
    path: "/training/stamina",
    domain: "training",
    title: "Training Stats",
    description: "Build stronger runners.",
    headings: [{ id: "pace", text: "Pace Strategy" }],
    body: "Choose a suitable training option.",
  },
  {
    path: "/racing/skills",
    domain: "racing",
    title: "Useful Skills",
    description: "Pick effective skills.",
    headings: [{ id: "recovery", text: "Recovery" }],
    body: "Pace changes throughout a race.",
  },
];

describe("searchReference", () => {
  it("ranks exact titles above headings and body matches", () => {
    const results = searchReference(documents, { text: "  PACE " });

    expect(results.map(({ path, score }) => [path, score])).toEqual([
      ["/racing/pace", 3],
      ["/training/stamina", 2],
      ["/racing/skills", 1],
    ]);
    expect(results[1]?.heading).toEqual({ id: "pace", text: "Pace Strategy" });
  });

  it("filters by domain and caps the result count", () => {
    const results = searchReference(documents, {
      text: "pace",
      domain: "racing",
      limit: 1,
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.path).toBe("/racing/pace");
  });

  it("returns no results for blank text or a zero limit", () => {
    expect(searchReference(documents, { text: "  " })).toEqual([]);
    expect(searchReference(documents, { text: "pace", limit: 0 })).toEqual([]);
  });
});
