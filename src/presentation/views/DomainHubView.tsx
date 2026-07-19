import { For, Show } from "solid-js";
import type { ArticleSummary, ReferenceDomain } from "~/domains/reference";

export interface DomainHubViewProps {
  domain: ReferenceDomain;
  articles: readonly ArticleSummary[];
}

export function DomainHubView(props: DomainHubViewProps) {
  return (
    <section class="domain-hub" aria-labelledby="domain-title">
      <header class="domain-masthead">
        <p>Field section / {props.domain.slug}</p>
        <h1 id="domain-title">{props.domain.title}</h1>
        <div>
          <span aria-hidden="true">{String(props.articles.length).padStart(2, "0")}</span>
          <p>{props.domain.description}</p>
        </div>
      </header>
      <Show
        when={props.articles.length > 0}
        fallback={<p class="empty-state">Notes for this section are still being prepared.</p>}
      >
        <ol class="article-index">
          <For each={props.articles}>
            {(article, index) => (
              <li>
                <a href={article.path}>
                  <span class="index-number">{String(index() + 1).padStart(2, "0")}</span>
                  <span class="index-copy">
                    <strong>{article.title}</strong>
                    <span>{article.description}</span>
                  </span>
                  <Show when={article.updatedAt}>
                    {(date) => <time datetime={date()}>{date()}</time>}
                  </Show>
                  <span class="index-arrow" aria-hidden="true">
                    &#8594;
                  </span>
                </a>
              </li>
            )}
          </For>
        </ol>
      </Show>
    </section>
  );
}
