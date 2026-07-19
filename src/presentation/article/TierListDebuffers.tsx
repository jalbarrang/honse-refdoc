import { For } from "solid-js";
import type { TierListEntry } from "~/domains/reference";
import { TierListChip } from "./TierListChip";
import { debufferGroups } from "./tier-list-data";

export interface TierListDebuffersProps {
  groups: ReturnType<typeof debufferGroups>;
  onSelect: (entry: TierListEntry) => void;
}

export function TierListDebuffers(props: TierListDebuffersProps) {
  return (
    <div class="tier-list-debuffers">
      <For each={props.groups}>
        {(group) => (
          <section aria-label={`${group.type} debuffers`}>
            <h3>{group.type} debuffer</h3>
            <div class="tier-list-chips">
              <For each={group.items}>
                {(item) => (
                  <TierListChip
                    entry={item.entry}
                    detail={item.rating.magnitude}
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
