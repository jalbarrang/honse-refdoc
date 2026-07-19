import { For, Show } from "solid-js";
import type { SearchResult } from "~/domains/search";

export interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error?: string;
  onNavigate: () => void;
}

function resultPath(result: SearchResult): string {
  return result.heading ? `${result.path}#${result.heading.id}` : result.path;
}

export function SearchResults(props: SearchResultsProps) {
  const resultLabel = () =>
    `${props.results.length} result${props.results.length === 1 ? "" : "s"}`;

  return (
    <section class="search-results" aria-labelledby="search-result-count">
      <p id="search-result-count" class="search-result-count" aria-live="polite">
        {resultLabel()}
      </p>
      <Show when={props.loading}>
        <output class="search-loading">Loading the search index...</output>
      </Show>
      <Show when={props.error}>
        {(message) => (
          <p class="search-error" role="alert">
            {message()}
          </p>
        )}
      </Show>
      <Show when={!props.loading && !props.error && !props.query.trim()}>
        <p class="search-prompt">Enter a title, heading, or phrase to begin.</p>
      </Show>
      <Show
        when={!props.loading && !props.error && props.query.trim() && props.results.length === 0}
      >
        <p class="search-empty">No field notes match this search.</p>
      </Show>
      <Show when={props.results.length > 0}>
        <ol class="search-result-list">
          <For each={props.results}>
            {(result) => (
              <li class="search-result-item">
                <a href={resultPath(result)} onClick={props.onNavigate}>
                  <strong>{result.title}</strong>
                  <Show when={result.heading}>
                    {(heading) => <span>Matched heading: {heading().text}</span>}
                  </Show>
                  <small>{result.description}</small>
                </a>
              </li>
            )}
          </For>
        </ol>
      </Show>
    </section>
  );
}
