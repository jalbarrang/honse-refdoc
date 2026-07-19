import { Show } from "solid-js";
import type { ReferenceArticle, ReferenceDomain } from "~/domains/reference";
import { Breadcrumbs } from "../navigation/Breadcrumbs";

export interface ArticleHeaderProps {
  article: ReferenceArticle;
  domain?: ReferenceDomain;
}

export function ArticleHeader(props: ArticleHeaderProps) {
  return (
    <header class="article-header">
      <Breadcrumbs
        items={[
          { label: "Guide", href: "/" },
          {
            label: props.domain?.title ?? props.article.domain,
            href: `/${props.article.domain}`,
          },
          { label: props.article.title },
        ]}
      />
      <p class="article-kicker">Track notes / {props.domain?.title ?? props.article.domain}</p>
      <h1>{props.article.title}</h1>
      <p class="article-deck">{props.article.description}</p>
      <Show when={props.article.updatedAt}>
        {(date) => (
          <p class="article-date">
            Last revised <time datetime={date()}>{date()}</time>
          </p>
        )}
      </Show>
    </header>
  );
}
