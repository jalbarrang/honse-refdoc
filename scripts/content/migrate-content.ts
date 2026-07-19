import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Marked, Renderer, type Tokens } from "marked";
import {
  ARTICLES_PATH,
  DOMAINS,
  GENERATED_PATH,
  HUB_PATHS,
  MEDIA_PATH,
  type DomainDefinition,
} from "./content-config";
import {
  containsIllegalControl,
  profileSource,
  type ImageDefinition,
  type ProfiledSource,
  type SourceStats,
} from "./source-profile";

interface HeadingRecord {
  line: number;
  depth: number;
  text: string;
  markdown: string;
  sourceAlias?: string;
  images: string[];
  canonicalId?: string;
  title: boolean;
  discarded: boolean;
}

interface ArticleWork {
  domain: DomainDefinition;
  start: number;
  end: number;
  slug: string;
  path: string;
  title: string;
  headings: HeadingRecord[];
}

interface GeneratedHeading {
  id: string;
  text: string;
  level: 2 | 3 | 4 | 5 | 6;
}

interface GeneratedArticle {
  path: string;
  domain: string;
  slug: string;
  title: string;
  description: string;
  html: string;
  headings: GeneratedHeading[];
  aliases: Record<string, string>;
}

interface ArticleSummary {
  path: string;
  domain: string;
  slug: string;
  title: string;
  description: string;
}

export interface BuildResult {
  articleCount: number;
  headingCount: number;
  imageCount: number;
  source: SourceStats;
}

const HEADING = /^(#{1,6})\s+(.*?)\s*$/;
const EXPLICIT_ALIAS = /\s*\{#([^}]+)\}\s*$/;
const HEADING_IMAGE = /!\[[^\]]*\]\[image\d+\]/g;

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\\([!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g, "$1")
    .toLocaleLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function plainInline(value: string): string {
  return value
    .replace(HEADING_IMAGE, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~`]/g, "")
    .replace(/\\([!"#$%&'()*+,./:;<=>?@[\]^_`{|}~-])/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseHeading(line: string, lineNumber: number): HeadingRecord | undefined {
  const match = HEADING.exec(line);
  if (!match) return undefined;
  const aliasMatch = EXPLICIT_ALIAS.exec(match[2]);
  const withoutAlias = aliasMatch ? match[2].slice(0, aliasMatch.index) : match[2];
  const images = withoutAlias.match(HEADING_IMAGE) ?? [];
  const markdown = withoutAlias.replace(HEADING_IMAGE, "").trim();
  return {
    line: lineNumber,
    depth: match[1].length,
    text: plainInline(markdown),
    markdown,
    sourceAlias: aliasMatch?.[1],
    images,
    title: false,
    discarded: markdown.length === 0,
  };
}

function makeArticleWork(source: ProfiledSource): ArticleWork[] {
  return DOMAINS.flatMap((domain) =>
    domain.articleStarts.map((start, index) => {
      const end = domain.articleStarts[index + 1]
        ? domain.articleStarts[index + 1] - 1
        : domain.end;
      const headings = source.lines
        .slice(start - 1, end)
        .map((line, lineIndex) => parseHeading(line, start + lineIndex))
        .filter((heading): heading is HeadingRecord => heading !== undefined);
      const primary = headings[0];
      if (!primary || primary.line !== start)
        throw new Error(`Article boundary ${start} is not a heading`);
      primary.title = true;
      const hub = index === 0;
      const title = hub ? domain.title : primary.text;
      const slug = hub ? domain.slug : slugify(title);
      const path = hub ? `/${domain.slug}` : `/${domain.slug}/${slug}`;
      const duplicate = headings.find(
        (heading) =>
          heading !== primary &&
          heading.line <= start + 3 &&
          slugify(heading.text) === slugify(title),
      );
      if (duplicate) duplicate.discarded = true;

      const usedIds = new Set<string>();
      for (const heading of headings) {
        if (heading.title || heading.discarded) continue;
        const base = slugify(heading.text) || `heading-${heading.line}`;
        let id = base;
        let suffix = 2;
        while (usedIds.has(id)) id = `${base}-${suffix++}`;
        usedIds.add(id);
        heading.canonicalId = id;
      }
      return { domain, start, end, slug, path, title, headings };
    }),
  );
}

function normalizeAlias(value: string): string {
  let decoded = value.replace(/\\([()])/g, "$1");
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Marked leaves malformed percent escapes untouched; they can still match source aliases.
  }
  return decoded.toLocaleLowerCase();
}

function buildTargets(articles: ArticleWork[]): {
  aliases: Map<string, string>;
  titles: Map<string, string[]>;
} {
  const aliases = new Map<string, string>();
  const titles = new Map<string, string[]>();
  const addAlias = (alias: string | undefined, target: string) => {
    if (!alias) return;
    const key = normalizeAlias(alias);
    const existing = aliases.get(key);
    if (!existing || existing === target) aliases.set(key, target);
  };

  for (const article of articles) {
    for (const heading of article.headings) {
      const target = heading.canonicalId ? `${article.path}#${heading.canonicalId}` : article.path;
      addAlias(heading.sourceAlias, target);
      addAlias(slugify(heading.text), target);
      const key = heading.text.toLocaleLowerCase();
      titles.set(key, [...(titles.get(key) ?? []), target]);
    }
  }
  for (const [alias, line] of [
    ["heading=h.7d7a4fobtwk3", 970],
    ["heading=h.9d3peshfq7pp", 1_961],
  ] as const) {
    const article = articles.find((candidate) =>
      candidate.headings.some((heading) => heading.line === line),
    );
    const heading = article?.headings.find((candidate) => candidate.line === line);
    if (!article || !heading) throw new Error(`Missing source fragment target at line ${line}`);
    aliases.set(
      alias,
      heading.canonicalId ? `${article.path}#${heading.canonicalId}` : article.path,
    );
  }
  return { aliases, titles };
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function rewriteInternalHref(
  href: string,
  text: string,
  targets: ReturnType<typeof buildTargets>,
): string {
  if (href === "") {
    const hub = HUB_PATHS[plainInline(text).toLocaleLowerCase()];
    if (!hub) throw new Error(`Unmapped empty link: ${text}`);
    return hub;
  }
  if (!href.startsWith("#")) return href;
  const alias = normalizeAlias(href.slice(1));
  const direct = targets.aliases.get(alias);
  if (direct) return direct;
  const titleTargets = [
    ...new Set(targets.titles.get(plainInline(text).toLocaleLowerCase()) ?? []),
  ];
  if (titleTargets.length === 1) return titleTargets[0];
  throw new Error(`Unresolved source fragment ${href} (${text})`);
}

function repairAwakeningRow(line: string, lineNumber: number): string | undefined {
  if (lineNumber === 1_032) return undefined;
  if (lineNumber < 1_014 || lineNumber > 1_059) return line;
  return line.replace(/\*\(([^)]*)\)\*/g, (match, contents: string) =>
    match.replace(contents, contents.replace(/(?<!\\)\|/g, "\\|")),
  );
}

function prepareMarkdown(article: ArticleWork, lines: string[]): string {
  const headingsByLine = new Map(article.headings.map((heading) => [heading.line, heading]));
  const prepared: string[] = [];
  for (let lineNumber = article.start; lineNumber <= article.end; lineNumber++) {
    const heading = headingsByLine.get(lineNumber);
    if (heading) {
      if (!heading.title && !heading.discarded) {
        prepared.push(`${"#".repeat(Math.max(2, heading.depth))} ${heading.markdown}`);
        prepared.push(...heading.images);
      }
      continue;
    }
    const repaired = repairAwakeningRow(lines[lineNumber - 1], lineNumber);
    if (repaired !== undefined) prepared.push(repaired);
  }
  return prepared
    .join("\n")
    .replace(
      /!\[([^\]]*)\]\[image(\d+)\]/g,
      (_match, alt: string, number: string) =>
        `![${alt}](/media/reference/image-${number.padStart(3, "0")}.png)`,
    );
}

function renderArticle(
  article: ArticleWork,
  lines: string[],
  targets: ReturnType<typeof buildTargets>,
  images: ImageDefinition[],
): {
  html: string;
  headings: GeneratedHeading[];
  aliases: Record<string, string>;
  markdown: string;
} {
  const records = article.headings.filter(
    (heading): heading is HeadingRecord & { canonicalId: string } =>
      !heading.title && !heading.discarded && heading.canonicalId !== undefined,
  );
  const headings = records.map((heading) => ({
    id: heading.canonicalId,
    text: heading.text,
    level: Math.max(2, heading.depth) as GeneratedHeading["level"],
  }));
  const aliases = Object.fromEntries(
    records
      .filter((heading) => heading.sourceAlias)
      .map((heading) => [heading.sourceAlias as string, heading.canonicalId])
      .toSorted(([left], [right]) => left.localeCompare(right)),
  );
  let headingIndex = 0;
  const renderer = new Renderer();
  renderer.heading = function ({ tokens, depth }: Tokens.Heading): string {
    const heading = headings[headingIndex++];
    if (!heading) throw new Error(`Marked emitted an unexpected heading in ${article.path}`);
    const level = Math.max(2, depth);
    return `<h${level} id="${escapeAttribute(heading.id)}">${this.parser.parseInline(tokens)}</h${level}>\n`;
  };
  renderer.link = function ({ href, title, text, tokens }: Tokens.Link): string {
    const rewritten = rewriteInternalHref(href, text, targets);
    const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";
    return `<a href="${escapeAttribute(rewritten)}"${titleAttribute}>${this.parser.parseInline(tokens)}</a>`;
  };
  renderer.image = function ({ href, title, text }: Tokens.Image): string {
    const number = Number(/image-(\d+)\.png$/.exec(href)?.[1]);
    const image = images.find((candidate) => candidate.number === number);
    if (!image) throw new Error(`Missing dimensions for image in ${article.path}: ${href}`);
    const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";
    const alt = text.trim() || `Visual reference for ${article.title}`;
    return `<img src="${escapeAttribute(href)}" alt="${escapeAttribute(alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async"${titleAttribute}>`;
  };
  const markdown = prepareMarkdown(article, lines);
  const html = new Marked({ renderer }).parse(markdown) as string;
  if (headingIndex !== headings.length) {
    throw new Error(
      `Marked rendered ${headingIndex}/${headings.length} headings in ${article.path}`,
    );
  }
  return { html, headings, aliases, markdown };
}

function htmlToText(html: string): string {
  return html
    .replace(/<img\b[^>]*>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/\s+/g, " ")
    .trim();
}

function descriptionFor(article: ArticleWork, markdown: string, html: string): string {
  if (article.start === article.domain.start) return article.domain.description;
  const paragraph = new Marked().lexer(markdown).find((token) => token.type === "paragraph");
  if (paragraph?.type === "paragraph") {
    const text = plainInline(paragraph.text);
    if (text && !text.startsWith("Document Tabs:")) return text;
  }
  return htmlToText(html).split(/(?<=[.!?])\s/, 1)[0] || article.title;
}

function articleFileName(article: ArticleWork): string {
  return article.start === article.domain.start
    ? `${article.domain.slug}.json`
    : `${article.domain.slug}--${article.slug}.json`;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value)}\n`, "utf8");
}

export async function buildContent(): Promise<BuildResult> {
  const source = await profileSource();
  if (containsIllegalControl(source.normalizedSource)) {
    throw new Error("Illegal controls remain after normalization");
  }
  const articleWork = makeArticleWork(source);
  const targets = buildTargets(articleWork);
  const generated: Array<{ work: ArticleWork; article: GeneratedArticle; body: string }> = [];

  for (const work of articleWork) {
    const rendered = renderArticle(work, source.lines, targets, source.images);
    const article: GeneratedArticle = {
      path: work.path,
      domain: work.domain.slug,
      slug: work.slug,
      title: work.title,
      description: descriptionFor(work, rendered.markdown, rendered.html),
      html: rendered.html,
      headings: rendered.headings,
      aliases: rendered.aliases,
    };
    generated.push({ work, article, body: htmlToText(rendered.html) });
  }

  await Promise.all([
    rm(GENERATED_PATH, { recursive: true, force: true }),
    rm(MEDIA_PATH, { recursive: true, force: true }),
  ]);
  await Promise.all([
    mkdir(ARTICLES_PATH, { recursive: true }),
    mkdir(MEDIA_PATH, { recursive: true }),
  ]);
  await Promise.all([
    ...source.images.map((image) =>
      writeFile(join(MEDIA_PATH, `image-${String(image.number).padStart(3, "0")}.png`), image.data),
    ),
    ...generated.map(({ work, article }) =>
      writeJson(join(ARTICLES_PATH, articleFileName(work)), article),
    ),
  ]);

  const summaries: ArticleSummary[] = generated.map(({ article }) => ({
    path: article.path,
    domain: article.domain,
    slug: article.slug,
    title: article.title,
    description: article.description,
  }));
  const domains = DOMAINS.map(({ slug, title, description }) => ({ slug, title, description }));
  const manifest = {
    domains,
    summaries,
    routes: summaries.map(({ path }) => path),
    source: { ...source.stats, articleCount: summaries.length },
  };
  const searchDocuments = generated.map(({ article, body }) => ({
    path: article.path,
    domain: article.domain,
    title: article.title,
    description: article.description,
    headings: article.headings.map(({ id, text }) => ({ id, text })),
    body,
  }));
  await Promise.all([
    writeJson(join(GENERATED_PATH, "manifest.json"), manifest),
    writeJson(join(GENERATED_PATH, "search-documents.json"), searchDocuments),
  ]);

  return {
    articleCount: generated.length,
    headingCount: generated.reduce((count, { article }) => count + article.headings.length, 0),
    imageCount: source.stats.imageOccurrenceCount,
    source: source.stats,
  };
}
