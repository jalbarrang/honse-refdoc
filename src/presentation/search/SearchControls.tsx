import { For } from "solid-js";
import type { ReferenceDomain } from "~/domains/reference";

export interface SearchControlsProps {
  query: string;
  domain: string;
  domains: readonly ReferenceDomain[];
  onQueryChange: (query: string) => void;
  onDomainChange: (domain: string) => void;
}

export function SearchControls(props: SearchControlsProps) {
  return (
    <search class="search-controls">
      <label class="search-query-label">
        <span>Search the field guide</span>
        <input
          id="reference-search-query"
          class="search-query-input"
          type="search"
          value={props.query}
          onInput={(event) => props.onQueryChange(event.currentTarget.value)}
          autocomplete="off"
          autofocus
        />
      </label>
      <label class="search-domain-label">
        <span>Domain</span>
        <select
          id="reference-search-domain"
          class="search-domain-select"
          value={props.domain}
          onChange={(event) => props.onDomainChange(event.currentTarget.value)}
        >
          <option value="">All six domains</option>
          <For each={props.domains}>
            {(domain) => <option value={domain.slug}>{domain.title}</option>}
          </For>
        </select>
      </label>
    </search>
  );
}
