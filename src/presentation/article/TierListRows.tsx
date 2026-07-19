import { For } from "solid-js";
import type { TierListAxis, TierListEntry } from "~/domains/reference";
import { TierListChip } from "./TierListChip";
import { ratingDetail, TIER_LABELS, tierRows } from "./tier-list-data";

export interface TierListRowsProps {
  axis: Exclude<TierListAxis, "debuffer">;
  rows: ReturnType<typeof tierRows>;
  onSelect: (entry: TierListEntry) => void;
}

export function TierListRows(props: TierListRowsProps) {
  return (
    <div class="tier-list-rows">
      <For each={props.rows}>
        {(row) => (
          <section class="tier-list-row">
            <h3>
              <span>{row.score}</span>
              {TIER_LABELS[props.axis][row.score]}
            </h3>
            <div class="tier-list-chips">
              <For each={row.items}>
                {(item) => (
                  <TierListChip
                    entry={item.entry}
                    detail={ratingDetail(item, props.axis)}
                    raw={item.rating.raw}
                    onSelect={props.onSelect}
                  />
                )}
              </For>
            </div>
          </section>
        )}
      </For>
    </div>
  );
}
