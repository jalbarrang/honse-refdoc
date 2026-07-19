import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { ARTICLES_PATH, EXPECTED_SOURCE, GENERATED_PATH, MEDIA_PATH } from "./content-config";
import { containsIllegalControl, profileSource, type SourceStats } from "./source-profile";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Article {
  path: string;
  domain: string;
  slug: string;
  title: string;
  description: string;
  html: string;
  headings: Heading[];
  aliases: Record<string, string>;
}

interface Manifest {
  domains: Array<{ slug: string; title: string; description: string }>;
  summaries: Array<Omit<Article, "html" | "headings" | "aliases">>;
  routes: string[];
  source: SourceStats & { articleCount: number };
}

export interface ValidationResult {
  articleCount: number;
  semanticHeadingCount: number;
  outlineHeadingCount: number;
  assetCount: number;
  imageNodeCount: number;
  routeCount: number;
}

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Content validation failed: ${message}`);
}

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

function attributeValues(html: string, attribute: string): string[] {
  const expression = new RegExp(`\\b${attribute}="([^"]*)"`, "g");
  return [...html.matchAll(expression)].map((match) => match[1]);
}

function validateArticleShape(article: Article): void {
  assert(article.path.startsWith("/"), `${article.path} has an invalid route`);
  assert(
    article.title.length > 0 && article.description.length > 0,
    `${article.path} lacks metadata`,
  );
  assert(
    !containsIllegalControl(JSON.stringify(article)),
    `${article.path} contains an illegal control`,
  );
  assert(!/href=""/.test(article.html), `${article.path} contains an empty href`);
  assert(
    !/\[image\d+\]|data:image\/png/.test(article.html),
    `${article.path} has an unresolved image`,
  );
  assert(!/<h[1-6][^>]*>\s*<img\b/.test(article.html), `${article.path} has an image in a heading`);
  assert(!/<h[1-6][^>]*>\s*<\/h[1-6]>/.test(article.html), `${article.path} has an empty heading`);
  assert(!article.html.includes("{#"), `${article.path} displays a source alias`);
  assert(
    !/href="(?:javascript|data):/i.test(article.html),
    `${article.path} contains an unsafe link protocol`,
  );

  const images = [...article.html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  assert(
    images.every(
      (image) =>
        /alt="[^"]+"/.test(image) &&
        /width="\d+"/.test(image) &&
        /height="\d+"/.test(image) &&
        image.includes('loading="lazy"') &&
        image.includes('decoding="async"'),
    ),
    `${article.path} contains an image without accessible lazy-loading metadata`,
  );

  const ids = attributeValues(article.html, "id");
  assert(ids.length === new Set(ids).size, `${article.path} has duplicate IDs`);
  const headingIds = [...article.html.matchAll(/<h[2-6] id="([^"]+)"/g)].map((match) => match[1]);
  assert(
    article.headings.length === headingIds.length,
    `${article.path} heading metadata differs from HTML`,
  );
  assert(
    article.headings.every((heading, index) => heading.id === headingIds[index]),
    `${article.path} heading IDs are out of sync`,
  );
  assert(
    Object.values(article.aliases).every((id) => headingIds.includes(id)),
    `${article.path} has an alias without a canonical target`,
  );
}

function validateLinks(articles: Article[]): void {
  const routeIds = new Map(
    articles.map((article) => [article.path, new Set(attributeValues(article.html, "id"))]),
  );
  for (const article of articles) {
    for (const href of attributeValues(article.html, "href")) {
      if (!href.startsWith("/")) continue;
      const url = new URL(href, "https://reference.invalid");
      const ids = routeIds.get(url.pathname);
      assert(ids, `${article.path} links to missing route ${url.pathname}`);
      if (url.hash) {
        const fragment = decodeURIComponent(url.hash.slice(1));
        assert(
          ids.has(fragment),
          `${article.path} links to missing target ${url.pathname}#${fragment}`,
        );
      }
    }
  }
}

function validateAwakeningTable(articles: Article[]): void {
  const article = articles.find(
    (candidate) => candidate.path === "/banners/what-umas-are-worth-leveling",
  );
  assert(article, "awakening article is missing");
  const body = /<tbody>([\s\S]*?)<\/tbody>/.exec(article.html)?.[1];
  assert(body, "awakening table body is missing");
  const rows = [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((match) => match[1]);
  assert(rows.length === 45, `awakening table has ${rows.length} rows instead of 45`);
  assert(
    rows.every((row) => [...row.matchAll(/<td/g)].length === 5),
    "awakening table contains a malformed row",
  );
  assert(!body.includes("<strong>Uma</strong>"), "awakening table retains its duplicate header");
}

export async function validateGeneratedContent(): Promise<ValidationResult> {
  const source = await profileSource();
  const manifest = await readJson<Manifest>(join(GENERATED_PATH, "manifest.json"));
  const searchDocuments = await readJson<Array<Record<string, unknown>>>(
    join(GENERATED_PATH, "search-documents.json"),
  );
  const articleFiles = (await readdir(ARTICLES_PATH))
    .filter((file) => file.endsWith(".json"))
    .toSorted();
  const articles = await Promise.all(
    articleFiles.map((file) => readJson<Article>(join(ARTICLES_PATH, file))),
  );
  const mediaFiles = (await readdir(MEDIA_PATH)).filter((file) => file.endsWith(".png")).toSorted();

  assert(articleFiles.length === 50, `expected 50 article modules, got ${articleFiles.length}`);
  assert(manifest.domains.length === 6, `expected 6 domains, got ${manifest.domains.length}`);
  assert(
    manifest.summaries.length === articles.length,
    "manifest summary count differs from articles",
  );
  assert(manifest.routes.length === articles.length, "manifest route count differs from articles");
  assert(
    new Set(manifest.routes).size === manifest.routes.length,
    "manifest contains duplicate routes",
  );
  assert(
    JSON.stringify(manifest.source) ===
      JSON.stringify({ ...source.stats, articleCount: articles.length }),
    "manifest source stats differ from the source profile",
  );
  assert(searchDocuments.length === articles.length, "search document count differs from articles");
  assert(
    searchDocuments.every((document) => !("html" in document)),
    "search documents contain HTML fields",
  );

  for (const article of articles) validateArticleShape(article);
  validateLinks(articles);
  validateAwakeningTable(articles);

  assert(
    mediaFiles.length === EXPECTED_SOURCE.imageDefinitionCount,
    `expected 132 PNGs, got ${mediaFiles.length}`,
  );
  await Promise.all(
    Array.from({ length: EXPECTED_SOURCE.imageDefinitionCount }, async (_, offset) => {
      const index = offset + 1;
      const file = `image-${String(index).padStart(3, "0")}.png`;
      assert(mediaFiles[index - 1] === file, `missing or unexpected media asset near ${file}`);
      const data = await readFile(join(MEDIA_PATH, file));
      assert(data.subarray(0, 8).equals(PNG_SIGNATURE), `${file} is not a PNG`);
    }),
  );

  const imageSources = articles.flatMap((article) => attributeValues(article.html, "src"));
  assert(
    imageSources.length === EXPECTED_SOURCE.imageOccurrenceCount,
    `expected 136 image nodes, got ${imageSources.length}`,
  );
  const mediaRoutes = new Set(mediaFiles.map((file) => `/media/reference/${file}`));
  assert(
    imageSources.every((sourcePath) => mediaRoutes.has(sourcePath)),
    "an image node has no extracted asset",
  );
  const outlineHeadingCount = articles.reduce(
    (count, article) => count + article.headings.length,
    0,
  );
  assert(
    outlineHeadingCount === EXPECTED_SOURCE.outlineHeadingCount,
    `expected 130 outline headings, got ${outlineHeadingCount}`,
  );

  return {
    articleCount: articles.length,
    semanticHeadingCount: source.stats.semanticHeadingCount,
    outlineHeadingCount,
    assetCount: mediaFiles.length,
    imageNodeCount: imageSources.length,
    routeCount: manifest.routes.length,
  };
}
