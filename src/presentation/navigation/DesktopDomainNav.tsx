import { For } from "solid-js";
import type { ReferenceDomain } from "~/domains/reference";

export interface DesktopDomainNavProps {
  domains: readonly ReferenceDomain[];
  activeDomain?: string;
}

export function DesktopDomainNav(props: DesktopDomainNavProps) {
  return (
    <nav class="domain-rail" aria-label="Reference domains">
      <p class="rail-label">Course index</p>
      <ol>
        <For each={props.domains}>
          {(domain, index) => (
            <li>
              <a
                href={`/${domain.slug}`}
                aria-current={props.activeDomain === domain.slug ? "page" : undefined}
              >
                <span aria-hidden="true">{String(index() + 1).padStart(2, "0")}</span>
                <strong>{domain.title}</strong>
              </a>
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
}
