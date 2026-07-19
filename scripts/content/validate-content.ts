import { validateGeneratedContent } from "./validate-generated";

try {
  const result = await validateGeneratedContent();
  console.log(
    `Validated ${result.articleCount} articles and ${result.routeCount} routes with ` +
      `${result.semanticHeadingCount} semantic headings (${result.outlineHeadingCount} article outline headings), ` +
      `${result.assetCount} PNG assets, and ${result.imageNodeCount} image nodes.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
