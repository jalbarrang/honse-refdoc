import { For, Show } from "solid-js";
import type { ReferenceHeading } from "~/domains/reference";

export interface TableOfContentsProps {
  headings: readonly ReferenceHeading[];
  title?: string;
}

export function TableOfContents(props: TableOfContentsProps) {
  return (
    <Show when={props.headings.length > 0}>
      <nav class="table-of-contents" aria-labelledby="contents-title">
        <p id="contents-title">{props.title ?? "On this page"}</p>
        <ol>
          <For each={props.headings}>
            {(heading) => (
              <li class={`toc-level-${heading.level}`}>
                <a href={`#${heading.id}`}>{heading.text}</a>
              </li>
            )}
          </For>
        </ol>
      </nav>
    </Show>
  );
}
