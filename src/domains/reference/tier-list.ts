export type TierListAxis = "style" | "teamTrials" | "parent" | "debuffer";

export type RacingStyle = "Front Runner" | "Pace Chaser" | "Late Surger" | "End Closer";

export interface TierListRating {
  score: 1 | 2 | 3 | 4 | 5;
  raw: string;
}

export interface StyleRating extends TierListRating {
  style: RacingStyle;
}

export interface DebufferRating {
  type: "Speed" | "Stamina" | "Acceleration";
  magnitude: string;
  value: number;
  raw: string;
}

export interface TierListEntry {
  id: string;
  anchorId: string;
  name: string;
  variant?: string;
  rarity: 1 | 2 | 3;
  rawRatings: string;
  reviewHtml: string;
  styles: StyleRating[];
  teamTrials?: TierListRating;
  parent?: TierListRating;
  debuffers: DebufferRating[];
}

export interface TierListData {
  entries: TierListEntry[];
}
