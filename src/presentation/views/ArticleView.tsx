import type { ReferenceArticle, ReferenceDomain } from "~/domains/reference";
import { ArticleBody } from "../article/ArticleBody";
import { ArticleHeader } from "../article/ArticleHeader";
import { SourceAttribution } from "../article/SourceAttribution";
import { TableOfContents } from "../navigation/TableOfContents";

export interface ArticleViewProps {
  article: ReferenceArticle;
  domain?: ReferenceDomain;
  sourceUrl?: string;
  sourceLabel?: string;
}

export function ArticleView(props: ArticleViewProps) {
  return (
    <div class="article-layout">
      <article>
        <ArticleHeader article={props.article} domain={props.domain} />
        <ArticleBody html={props.article.html} />
        <SourceAttribution sourceUrl={props.sourceUrl} sourceLabel={props.sourceLabel} />
      </article>
      <aside class="toc-rail">
        <TableOfContents headings={props.article.headings} />
      </aside>
    </div>
  );
}
