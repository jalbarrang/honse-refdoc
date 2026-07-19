import type { ReferenceArticle, ReferenceDomain } from "~/domains/reference";
import { Show } from "solid-js";
import { ArticleBody } from "../article/ArticleBody";
import { ArticleHeader } from "../article/ArticleHeader";
import { SourceAttribution } from "../article/SourceAttribution";
import { TierList } from "../article/TierList";
import { TableOfContents } from "../navigation/TableOfContents";

export interface ArticleViewProps {
  article: ReferenceArticle;
  domain?: ReferenceDomain;
  sourceUrl?: string;
  sourceLabel?: string;
}

export function ArticleView(props: ArticleViewProps) {
  return (
    <div classList={{ "article-layout": true, "article-layout-wide": !!props.article.tierList }}>
      <article>
        <ArticleHeader article={props.article} domain={props.domain} />
        <Show when={props.article.tierList}>
          {(tierList) => <TierList tierList={tierList()} />}
        </Show>
        <ArticleBody html={props.article.html} />
        <SourceAttribution sourceUrl={props.sourceUrl} sourceLabel={props.sourceLabel} />
      </article>
      <aside class="toc-rail">
        <TableOfContents headings={props.article.headings} />
      </aside>
    </div>
  );
}
