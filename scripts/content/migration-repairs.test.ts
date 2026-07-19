import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ARTICLES_PATH } from "./content-config";

async function article(name: string): Promise<{ html: string; aliases: Record<string, string> }> {
  return JSON.parse(await readFile(join(ARTICLES_PATH, name), "utf8")) as {
    html: string;
    aliases: Record<string, string>;
  };
}

describe("known export repairs", () => {
  it("repairs the awakening table and removes its duplicate header", async () => {
    const result = await article("banners--what-umas-are-worth-leveling.json");
    const rows = [...result.html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].slice(1);

    expect(rows).toHaveLength(45);
    expect(rows.every((row) => [...row[1].matchAll(/<td/g)].length === 5)).toBe(true);
    expect(result.html).not.toContain("<strong>Uma</strong>");
  });

  it("moves heading images into body content and retains source aliases", async () => {
    const grandLive = await article("strategy--grand-live.json");
    const midRun = await article("mid-run--optional-races.json");

    expect(grandLive.html).toContain('<h3 id="ideal-song-pattern">Ideal Song Pattern</h3>');
    expect(grandLive.html).toContain("/media/reference/image-084.png");
    expect(grandLive.html).not.toMatch(/<h[1-6][^>]*>[^<]*<img/);
    expect(midRun.aliases["fan-checkpoints-(and-unique-skill-levels)"]).toBe(
      "fan-checkpoints-and-unique-skill-levels",
    );
  });
});
