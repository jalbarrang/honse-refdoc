import { createEffect, createSignal, onCleanup, Show, type Accessor } from "solid-js";
import type { TierListEntry } from "~/domains/reference";
import { rewriteSiteUrls } from "~/shared/site-path";
import { displayName } from "./tier-list-data";

export interface TierListDialogProps {
  selected: Accessor<TierListEntry | undefined>;
  onClose: () => void;
}

export function TierListDialog(props: TierListDialogProps) {
  const [dialog, setDialog] = createSignal<HTMLDialogElement>();
  createEffect(() => {
    const element = dialog();
    if (props.selected() && element && !element.open) element.showModal();
    if (!props.selected() && element?.open) element.close();
  });
  createEffect(() => {
    const element = dialog();
    if (!element) return;
    const closeOnBackdrop = (event: MouseEvent) => {
      if (event.target === element) props.onClose();
    };
    element.addEventListener("click", closeOnBackdrop);
    onCleanup(() => element.removeEventListener("click", closeOnBackdrop));
  });

  return (
    <dialog
      ref={setDialog}
      class="tier-list-dialog"
      aria-labelledby="tier-list-dialog-title"
      onClose={props.onClose}
    >
      <Show when={props.selected()}>
        {(entry) => (
          <>
            <header>
              <div>
                <p>Uma review</p>
                <h2 id="tier-list-dialog-title">{displayName(entry())}</h2>
              </div>
              <button type="button" class="tier-list-dialog-close" onClick={props.onClose}>
                Close
              </button>
            </header>
            <div class="tier-list-dialog-body">
              <p class="tier-list-dialog-ratings">
                <span title="Gacha rarity">{entry().rarity}★</span>
                Posted ratings: {entry().rawRatings}
              </p>
              <div class="tier-list-review" innerHTML={rewriteSiteUrls(entry().reviewHtml)} />
              <a href={`#${entry().anchorId}`} onClick={props.onClose}>
                Jump to full review
              </a>
            </div>
          </>
        )}
      </Show>
    </dialog>
  );
}
