import { For } from "solid-js";
import type { ArticleSummary, ReferenceDomain } from "~/domains/reference";

export interface HomeViewProps {
  domains: readonly ReferenceDomain[];
  articles: readonly ArticleSummary[];
}

export function HomeView(props: HomeViewProps) {
  const countFor = (slug: string) =>
    props.articles.filter((article) => article.domain === slug).length;

  return (
    <div class="home-view">
      <section class="home-hero" aria-labelledby="home-title">
        <p class="eyebrow">Global edition / community reference</p>
        <h1 id="home-title">The refdoc, made searchable.</h1>
        <p>
          Banners, training strategy, mid-run decisions, and the mechanics beneath every race, from
          Erzzy and Kireina&apos;s community reference document.
        </p>
        <a href="/new-player">New player starting line</a>
      </section>
      <section class="domain-program" aria-labelledby="program-title">
        <header>
          <p>Today&apos;s race card</p>
          <h2 id="program-title">Choose a field section</h2>
        </header>
        <ol>
          <For each={props.domains}>
            {(domain, index) => (
              <li>
                <a href={`/${domain.slug}`}>
                  <span>{String(index() + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{domain.title}</strong>
                    <p>{domain.description}</p>
                  </div>
                  <small>{countFor(domain.slug)} entries</small>
                </a>
              </li>
            )}
          </For>
        </ol>
      </section>
    </div>
  );
}
