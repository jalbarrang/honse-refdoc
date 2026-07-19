import { Show } from "solid-js";

export interface SourceAttributionProps {
  sourceUrl?: string;
  sourceLabel?: string;
  authors?: string;
}

export function SourceAttribution(props: SourceAttributionProps) {
  return (
    <aside class="source-attribution" aria-labelledby="source-title">
      <p class="source-number" aria-hidden="true">
        SRC
      </p>
      <div>
        <h2 id="source-title">Source &amp; credit</h2>
        <p>
          Adapted from the community reference document by {props.authors ?? "Erzzy and Kireina"}.
          Shared under CC BY-NC; editorial ownership remains with its authors.
        </p>
        <Show when={props.sourceUrl}>
          {(url) => <a href={url()}>{props.sourceLabel ?? "Visit the original reference"}</a>}
        </Show>
      </div>
    </aside>
  );
}
