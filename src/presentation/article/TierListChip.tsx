import type { TierListEntry } from "~/domains/reference";
import { displayName } from "./tier-list-data";

export interface TierListChipProps {
  entry: TierListEntry;
  detail?: string;
  raw?: string;
  onSelect: (entry: TierListEntry) => void;
}

export function TierListChip(props: TierListChipProps) {
  return (
    <button
      type="button"
      class="tier-list-chip"
      aria-haspopup="dialog"
      aria-label={`Open review for ${displayName(props.entry)}`}
      onClick={() => props.onSelect(props.entry)}
    >
      <span class="tier-list-chip-name">
        {props.entry.name}
        {props.entry.variant && <span class="tier-list-chip-variant"> {props.entry.variant}</span>}
      </span>
      <span class="tier-list-chip-meta">
        {props.detail && <span title={props.raw}>{props.detail}</span>}
        <span class="tier-list-chip-rarity" title="Gacha rarity">
          {props.entry.rarity}★
        </span>
      </span>
    </button>
  );
}
