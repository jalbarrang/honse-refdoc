import type {
  DebufferRating,
  StyleRating,
  TierListAxis,
  TierListEntry,
  TierListRating,
} from "~/domains/reference";

export const AXES: ReadonlyArray<{ id: TierListAxis; label: string }> = [
  { id: "style", label: "CM Style" },
  { id: "teamTrials", label: "Team Trials" },
  { id: "parent", label: "Parent" },
  { id: "debuffer", label: "Debuffer" },
];

export const TIER_LABELS: Record<
  Exclude<TierListAxis, "debuffer">,
  Record<1 | 2 | 3 | 4 | 5, string>
> = {
  style: { 5: "Meta", 4: "Strong", 3: "Average", 2: "Usable", 1: "Pet Pick" },
  teamTrials: { 5: "4,800 pts", 4: "3,600 pts", 3: "2,400 pts", 2: "1,200 pts", 1: "Inconsistent" },
  parent: {
    5: "Best inherit",
    4: "Highly desirable",
    3: "0.25 speed",
    2: "0.15 speed",
    1: "Not worth buying",
  },
};

interface TierItem {
  entry: TierListEntry;
  rating: TierListRating;
  style?: StyleRating;
}

/* The row label already states the tier, so chips only carry what the raw
   token adds: the style that earned the score, a track/style qualifier, or an
   ambiguous score marker like "4+" or "2~3". Plain tokens get no detail. */
export function ratingDetail(
  item: TierItem,
  axis: Exclude<TierListAxis, "debuffer">,
): string | undefined {
  const raw = item.rating.raw;
  if (axis === "style" && item.style) {
    return /[+~?]/.test(raw) ? raw : item.style.style;
  }
  const stripped = raw.replace(/^(?:Team Trials|Stadium|Parent)\s*/i, "");
  if (stripped === String(item.rating.score)) return undefined;
  const qualifier = new RegExp(`^${item.rating.score} \\(([^)]+)\\)$`).exec(stripped);
  return qualifier ? qualifier[1] : stripped;
}

export function displayName(entry: TierListEntry): string {
  return entry.variant ? `${entry.name} — ${entry.variant}` : entry.name;
}

function bestStyle(entry: TierListEntry): StyleRating | undefined {
  return entry.styles.toSorted((left, right) => right.score - left.score)[0];
}

function ratingFor(
  entry: TierListEntry,
  axis: Exclude<TierListAxis, "debuffer">,
): TierItem | undefined {
  if (axis === "style") {
    const style = bestStyle(entry);
    return style ? { entry, rating: style, style } : undefined;
  }
  const rating = entry[axis];
  return rating ? { entry, rating } : undefined;
}

export function tierRows(entries: TierListEntry[], axis: Exclude<TierListAxis, "debuffer">) {
  return ([5, 4, 3, 2, 1] as const).flatMap((score) => {
    const items = entries
      .map((entry) => ratingFor(entry, axis))
      .filter((item): item is TierItem => item?.rating.score === score)
      .toSorted((left, right) => displayName(left.entry).localeCompare(displayName(right.entry)));
    return items.length > 0 ? [{ score, items }] : [];
  });
}

export function debufferGroups(entries: TierListEntry[]) {
  return (["Speed", "Stamina", "Acceleration"] as DebufferRating["type"][]).flatMap((type) => {
    const items = entries
      .flatMap((entry) =>
        entry.debuffers
          .filter((rating) => rating.type === type)
          .map((rating) => ({ entry, rating })),
      )
      .toSorted(
        (left, right) =>
          right.rating.value - left.rating.value ||
          displayName(left.entry).localeCompare(displayName(right.entry)),
      );
    return items.length > 0 ? [{ type, items }] : [];
  });
}
