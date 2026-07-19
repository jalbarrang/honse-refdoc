import { For } from "solid-js";
import type { ReferenceDomain } from "~/domains/reference";
import { toSitePath } from "~/shared/site-path";

export interface MobileDomainNavProps {
  domains: readonly ReferenceDomain[];
  activeDomain?: string;
}

export function MobileDomainNav(props: MobileDomainNavProps) {
  return (
    <details class="mobile-nav">
      <summary>
        <span>Field guide</span>
        <svg aria-hidden="true" viewBox="0 0 16 16">
          <path d="m3 6 5 5 5-5" />
        </svg>
      </summary>
      <nav aria-label="Mobile reference domains">
        <a href={toSitePath("/")} aria-current={props.activeDomain ? undefined : "page"}>
          Starting gate
        </a>
        <For each={props.domains}>
          {(domain) => (
            <a
              href={toSitePath(`/${domain.slug}`)}
              aria-current={props.activeDomain === domain.slug ? "page" : undefined}
            >
              {domain.title}
            </a>
          )}
        </For>
      </nav>
    </details>
  );
}
