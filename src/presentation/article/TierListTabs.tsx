import { For } from "solid-js";
import type { TierListAxis } from "~/domains/reference";
import { AXES } from "./tier-list-data";

export interface TierListTabsProps {
  axis: TierListAxis;
  onChange: (axis: TierListAxis) => void;
}

export function TierListTabs(props: TierListTabsProps) {
  const moveAxis = (currentAxis: TierListAxis, event: KeyboardEvent) => {
    const currentIndex = AXES.findIndex(({ id }) => id === currentAxis);
    const change =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : event.key === "Home"
            ? -currentIndex
            : event.key === "End"
              ? AXES.length - 1 - currentIndex
              : 0;
    if (change === 0) return;
    event.preventDefault();
    const next = AXES[(currentIndex + change + AXES.length) % AXES.length];
    props.onChange(next.id);
    queueMicrotask(() => document.getElementById(`tier-list-axis-${next.id}`)?.focus());
  };

  return (
    <div class="tier-list-tabs" role="tablist" aria-label="Rating category">
      <For each={AXES}>
        {(item) => (
          <button
            id={`tier-list-axis-${item.id}`}
            type="button"
            role="tab"
            aria-controls="tier-list-panel"
            aria-selected={props.axis === item.id}
            tabindex={props.axis === item.id ? 0 : -1}
            onClick={() => props.onChange(item.id)}
            onKeyDown={(event) => moveAxis(item.id, event)}
          >
            {item.label}
          </button>
        )}
      </For>
    </div>
  );
}
