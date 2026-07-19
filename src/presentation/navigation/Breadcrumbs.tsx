import { For, Show } from "solid-js";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: readonly BreadcrumbItem[];
}

export function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <For each={props.items}>
          {(item) => (
            <li>
              <Show when={item.href} fallback={<span aria-current="page">{item.label}</span>}>
                {(href) => <a href={href()}>{item.label}</a>}
              </Show>
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
}
