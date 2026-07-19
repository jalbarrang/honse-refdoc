import { fileURLToPath } from "node:url";

export interface DomainDefinition {
  slug: string;
  title: string;
  description: string;
  start: number;
  end: number;
  articleStarts: readonly number[];
}

export const ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const SOURCE_PATH = fileURLToPath(
  new URL("../../content/source/refdoc-global-latest.md", import.meta.url),
);
export const GENERATED_PATH = fileURLToPath(new URL("../../src/generated/", import.meta.url));
export const ARTICLES_PATH = fileURLToPath(
  new URL("../../src/generated/articles/", import.meta.url),
);
export const MEDIA_PATH = fileURLToPath(new URL("../../public/media/reference/", import.meta.url));

export const EXPECTED_SOURCE = {
  bytes: 18_490_387,
  sha256: "ed2438b9467421279bde515e3bae84494b8cc5c5b50d082d76f4f87ba9074511",
  lineCount: 4_463,
  contentLineCount: 4_200,
  headingCount: 189,
  semanticHeadingCount: 180,
  outlineHeadingCount: 130,
  imageDefinitionCount: 132,
  imageOccurrenceCount: 136,
  emptyLinkCount: 27,
  verticalTabCount: 1,
} as const;

export const DOMAINS: readonly DomainDefinition[] = [
  {
    slug: "banners",
    title: "Banners & Tier Lists",
    description: "Current banners, future releases, tier lists, and Umamusume reviews.",
    start: 1,
    end: 1_120,
    articleStarts: [1, 89, 174, 236, 497, 542, 572, 1_002, 1_061, 1_065],
  },
  {
    slug: "new-player",
    title: "New Player Info",
    description: "Information that is most useful early on or until you know it.",
    start: 1_121,
    end: 1_819,
    articleStarts: [
      1_121, 1_215, 1_233, 1_253, 1_270, 1_299, 1_364, 1_414, 1_470, 1_551, 1_562, 1_656,
    ],
  },
  {
    slug: "strategy",
    title: "Strategy",
    description: "Planning outside of runs, builds, breeding, and competitive theory.",
    start: 1_820,
    end: 2_914,
    articleStarts: [1_820, 1_918, 1_961, 2_103, 2_156, 2_303, 2_419, 2_439, 2_480, 2_519, 2_616],
  },
  {
    slug: "mid-run",
    title: "Mid-Run Info",
    description: "Information frequently referenced while training an Umamusume.",
    start: 2_915,
    end: 3_399,
    articleStarts: [2_915, 2_969, 3_052, 3_096, 3_125, 3_164],
  },
  {
    slug: "mechanics",
    title: "Mechanics",
    description: "Detailed numbers and explanations for the game's underlying mechanics.",
    start: 3_400,
    end: 4_075,
    articleStarts: [3_400, 3_482, 3_508, 3_566, 3_755, 3_777, 3_853, 3_949],
  },
  {
    slug: "scenarios",
    title: "Old Scenarios",
    description: "Guides and support-card builds for older training scenarios.",
    start: 4_076,
    end: 4_200,
    articleStarts: [4_076, 4_092, 4_120],
  },
] as const;

export const HUB_PATHS: Readonly<Record<string, string>> = {
  "main page": "/banners",
  "main tab": "/banners",
  "new player info": "/new-player",
  mechanics: "/mechanics",
  strategy: "/strategy",
  "mid-run info": "/mid-run",
};
