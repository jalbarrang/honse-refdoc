import { createMemo, createSignal, Show } from "solid-js";
import type { TierListAxis, TierListData, TierListEntry } from "~/domains/reference";
import { TierListDebuffers } from "./TierListDebuffers";
import { TierListDialog } from "./TierListDialog";
import { TierListRows } from "./TierListRows";
import { TierListTabs } from "./TierListTabs";
import { debufferGroups, tierRows } from "./tier-list-data";

export interface TierListProps {
  tierList: TierListData;
}

export function TierList(props: TierListProps) {
  const [axis, setAxis] = createSignal<TierListAxis>("style");
  const [selected, setSelected] = createSignal<TierListEntry>();
  const rows = createMemo(() => {
    const currentAxis = axis();
    return currentAxis === "debuffer" ? [] : tierRows(props.tierList.entries, currentAxis);
  });
  const groups = createMemo(() => debufferGroups(props.tierList.entries));
  const closeDialog = () => setSelected(undefined);

  return (
    <>
      <section class="tier-list" aria-labelledby="tier-list-title">
        <details open>
          <summary>
            <span id="tier-list-title">Interactive tier list</span>
            <span>{props.tierList.entries.length} reviewed umas</span>
          </summary>
          <div class="tier-list-content">
            <p class="tier-list-intro">
              Switch the rating category, then choose an uma to read the review without leaving this
              page.
            </p>
            <TierListTabs axis={axis()} onChange={setAxis} />
            <div id="tier-list-panel" class="tier-list-panel" role="tabpanel">
              <Show
                when={axis() === "debuffer"}
                fallback={
                  <TierListRows
                    axis={axis() as Exclude<TierListAxis, "debuffer">}
                    rows={rows()}
                    onSelect={setSelected}
                  />
                }
              >
                <TierListDebuffers groups={groups()} onSelect={setSelected} />
              </Show>
            </div>
          </div>
        </details>
      </section>
      <TierListDialog selected={selected} onClose={closeDialog} />
    </>
  );
}
