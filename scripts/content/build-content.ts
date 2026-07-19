import { buildContent } from "./migrate-content";

try {
  const result = await buildContent();
  console.log(
    `Built ${result.articleCount} articles, ${result.source.semanticHeadingCount} semantic headings ` +
      `(${result.headingCount} article outline headings), and ${result.imageCount} image nodes from ` +
      `${result.source.lineCount} source lines.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
