import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { DOMAINS, EXPECTED_SOURCE, SOURCE_PATH } from "./content-config";

export interface SourceStats {
  bytes: number;
  sha256: string;
  lineCount: number;
  contentLineCount: number;
  headingCount: number;
  semanticHeadingCount: number;
  outlineHeadingCount: number;
  imageDefinitionCount: number;
  imageOccurrenceCount: number;
  emptyLinkCount: number;
  verticalTabCount: number;
}

export interface ImageDefinition {
  number: number;
  data: Buffer;
  width: number;
  height: number;
}

export interface ProfiledSource {
  source: string;
  normalizedSource: string;
  lines: string[];
  images: ImageDefinition[];
  stats: SourceStats;
}

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const IMAGE_DEFINITION = /^\[image(\d+)\]:\s*<data:image\/png;base64,([^>]+)>\s*$/gm;

export function containsIllegalControl(value: string): boolean {
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127) {
      return true;
    }
  }
  return false;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Source profile mismatch: ${message}`);
}

export async function profileSource(path = SOURCE_PATH): Promise<ProfiledSource> {
  const bytes = await readFile(path);
  const source = bytes.toString("utf8");
  const lines = source.split(/\r?\n/);
  const imageMatches = [...source.matchAll(IMAGE_DEFINITION)];
  const images = imageMatches.map((match) => {
    const data = Buffer.from(match[2], "base64");
    return {
      number: Number(match[1]),
      data,
      width: data.readUInt32BE(16),
      height: data.readUInt32BE(20),
    };
  });
  const headingCount = lines.filter((line) => /^#{1,6}(?:\s|$)/.test(line)).length;
  const emptyHeadingCount = lines.filter((line) =>
    /^#{1,6}\s*(?:\{#[^}]+\})?\s*$/.test(line),
  ).length;
  const duplicateTabTitleCount = 5;
  const stats: SourceStats = {
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    lineCount: lines.length,
    contentLineCount: DOMAINS.at(-1)?.end ?? 0,
    headingCount,
    semanticHeadingCount: headingCount - emptyHeadingCount - duplicateTabTitleCount,
    outlineHeadingCount:
      headingCount -
      emptyHeadingCount -
      duplicateTabTitleCount -
      DOMAINS.reduce((count, domain) => count + domain.articleStarts.length, 0),
    imageDefinitionCount: imageMatches.length,
    imageOccurrenceCount: [...source.matchAll(/!\[[^\]]*\]\[image\d+\]/g)].length,
    emptyLinkCount: [...source.matchAll(/\[[^\]]+\]\(\)/g)].length,
    verticalTabCount: [...source].filter((character) => character === "\u000b").length,
  };

  assert(
    stats.bytes === EXPECTED_SOURCE.bytes,
    `expected ${EXPECTED_SOURCE.bytes} bytes, got ${stats.bytes}`,
  );
  assert(stats.sha256 === EXPECTED_SOURCE.sha256, `unexpected SHA-256 ${stats.sha256}`);
  for (const key of [
    "lineCount",
    "contentLineCount",
    "headingCount",
    "semanticHeadingCount",
    "outlineHeadingCount",
    "imageDefinitionCount",
    "imageOccurrenceCount",
    "emptyLinkCount",
    "verticalTabCount",
  ] as const) {
    assert(
      stats[key] === EXPECTED_SOURCE[key],
      `expected ${key}=${EXPECTED_SOURCE[key]}, got ${stats[key]}`,
    );
  }
  assert(
    images.every((image, index) => image.number === index + 1),
    "image definitions are not image1..image132 in order",
  );
  assert(
    images.every((image) => image.data.subarray(0, 8).equals(PNG_SIGNATURE)),
    "an image definition is not a PNG",
  );

  return {
    source,
    normalizedSource: source.replaceAll("\u000b", " "),
    lines: source.replaceAll("\u000b", " ").split(/\r?\n/),
    images,
    stats,
  };
}
