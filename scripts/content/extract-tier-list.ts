import type {
  DebufferRating,
  RacingStyle,
  StyleRating,
  TierListData,
  TierListEntry,
  TierListRating,
} from "../../src/domains/reference/tier-list";

const REVIEW_HEADER = /<p><strong>([^<]+)<\/strong><br>Ratings:\s*([^<]+)<\/p>/g;
const SECTION_HEADING = /<h2 id="([123])-umas">/g;
const NEXT_HEADING = /<h[2-6]\b[^>]*>/g;
const RACING_STYLES: readonly RacingStyle[] = [
  "Front Runner",
  "Pace Chaser",
  "Late Surger",
  "End Closer",
];

interface ReviewMatch {
  index: number;
  end: number;
  label: string;
  rawRatings: string;
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitRatings(value: string): string[] {
  const tokens: string[] = [];
  let depth = 0;
  let start = 0;
  for (const [index, character] of [...value].entries()) {
    if (character === "(") depth++;
    if (character === ")") depth = Math.max(0, depth - 1);
    if (character === "," && depth === 0) {
      tokens.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  tokens.push(value.slice(start).trim());
  return tokens.filter(Boolean);
}

function scoreFrom(value: string): 1 | 2 | 3 | 4 | 5 | undefined {
  const match = /\b([1-5])(?:\+|~[1-5]|\?[1-5]\?)?/.exec(value);
  return match ? (Number(match[1]) as TierListRating["score"]) : undefined;
}

function scoresFrom(value: string): Array<1 | 2 | 3 | 4 | 5> {
  return [...value.matchAll(/\b([1-5])(?:\+|~[1-5]|\?[1-5]\?)?/g)].map(
    (match) => Number(match[1]) as TierListRating["score"],
  );
}

function stylesFrom(value: string): RacingStyle[] {
  if (/\bAnything\b/i.test(value)) return [...RACING_STYLES];
  const styles: RacingStyle[] = [];
  if (/\bFront Runner\b|\bFront\b|\bRunner\b/i.test(value)) styles.push("Front Runner");
  if (/\bPace Chaser\b/i.test(value) || /\bPace\b|\bLeader\b/i.test(value)) {
    styles.push("Pace Chaser");
  }
  if (/\bLate Surger\b/i.test(value) || /\bLate\b|\bBetweener\b/i.test(value)) {
    styles.push("Late Surger");
  }
  if (
    /\bEnd Closer\b/i.test(value) ||
    (!/\bPace Chaser\b/i.test(value) && /\b(?:End|Chaser)\b/i.test(value))
  ) {
    styles.push("End Closer");
  }
  return styles.length > 0 ? styles : [];
}

function parseRatings(
  rawRatings: string,
): Pick<TierListEntry, "styles" | "teamTrials" | "parent" | "debuffers"> {
  const styles = new Map<RacingStyle, StyleRating>();
  let teamTrials: TierListRating | undefined;
  let parent: TierListRating | undefined;
  const debuffers: DebufferRating[] = [];

  for (const token of splitRatings(rawRatings)) {
    if (/^(?:Team Trials|Stadium)\b/i.test(token)) {
      const scores = scoresFrom(token);
      const score = scores.length > 0 ? Math.max(...scores) : undefined;
      if (score) {
        teamTrials = {
          score: score as TierListRating["score"],
          raw: token,
        };
      } else {
        console.warn(`Unable to parse Team Trials rating: ${token}`);
      }
      continue;
    }

    if (/^Parent\b/i.test(token)) {
      const score = scoreFrom(token);
      if (score) parent = { score, raw: token };
      else console.warn(`Unable to parse Parent rating: ${token}`);
      continue;
    }

    const debuffer = /^(Speed|Stamina|Acceleration) Debuffer\s*\(([^)]+)\)$/i.exec(token);
    if (debuffer) {
      const value = Number.parseFloat(debuffer[2]);
      if (Number.isNaN(value)) {
        console.warn(`Unable to parse debuffer rating: ${token}`);
      } else {
        debuffers.push({
          type: (debuffer[1][0].toUpperCase() +
            debuffer[1].slice(1).toLowerCase()) as DebufferRating["type"],
          magnitude: debuffer[2],
          value: Math.abs(value),
          raw: token,
        });
      }
      continue;
    }

    const score = scoreFrom(token);
    if (!score) {
      console.warn(`Unable to parse rating: ${token}`);
      continue;
    }
    const styleNames = stylesFrom(token);
    if (styleNames.length === 0) {
      console.warn(`Unrecognized rating category: ${token}`);
      continue;
    }
    for (const style of styleNames) {
      const existing = styles.get(style);
      if (!existing || score > existing.score) styles.set(style, { style, score, raw: token });
    }
  }

  return {
    styles: [...styles.values()],
    teamTrials,
    parent,
    debuffers,
  };
}

function detailsFromLabel(
  label: string,
  rarity: 1 | 2 | 3,
): Pick<TierListEntry, "name" | "variant"> {
  const raritySuffix = new RegExp(`\\s*\\(${rarity}\\*\\)$`);
  const withoutRarity = label.replace(raritySuffix, "");
  const variant = /\s+\(([^()]+)\)$/.exec(withoutRarity);
  return {
    name: variant ? withoutRarity.slice(0, variant.index).trim() : withoutRarity.trim(),
    ...(variant ? { variant: variant[1] } : {}),
  };
}

function rarityFromLabel(label: string, fallback: 1 | 2 | 3): 1 | 2 | 3 {
  const match = /\(([123])\*\)$/.exec(label);
  return match ? (Number(match[1]) as 1 | 2 | 3) : fallback;
}

function sectionRarity(sectionHeadings: readonly RegExpMatchArray[], index: number): 1 | 2 | 3 {
  const previous = sectionHeadings.toReversed().find((heading) => (heading.index ?? 0) < index);
  return previous ? (Number(previous[1]) as 1 | 2 | 3) : 3;
}

function nextReviewBoundary(html: string, start: number, nextReview: number | undefined): number {
  NEXT_HEADING.lastIndex = start;
  const nextHeading = NEXT_HEADING.exec(html)?.index;
  return Math.min(nextReview ?? html.length, nextHeading ?? html.length);
}

export function extractTierList(html: string): { html: string; tierList?: TierListData } {
  const reviews: ReviewMatch[] = [...html.matchAll(REVIEW_HEADER)].map((match) => ({
    index: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
    label: match[1].trim(),
    rawRatings: match[2].trim(),
  }));
  if (reviews.length === 0) return { html };

  const sectionHeadings = [...html.matchAll(SECTION_HEADING)];
  const usedIds = new Set<string>();
  const entries: TierListEntry[] = reviews.map((review, index) => {
    const rarity = rarityFromLabel(review.label, sectionRarity(sectionHeadings, review.index));
    const details = detailsFromLabel(review.label, rarity);
    const baseId = `uma-${slugify(details.name)}${details.variant ? `-${slugify(details.variant)}` : ""}`;
    let anchorId = baseId;
    let suffix = 2;
    while (usedIds.has(anchorId)) anchorId = `${baseId}-${suffix++}`;
    usedIds.add(anchorId);

    return {
      id: anchorId,
      anchorId,
      ...details,
      rarity,
      rawRatings: review.rawRatings,
      reviewHtml: html
        .slice(review.end, nextReviewBoundary(html, review.end, reviews[index + 1]?.index))
        .trim(),
      ...parseRatings(review.rawRatings),
    };
  });

  let anchoredHtml = html;
  for (const [reviewIndex, reviewMatch] of reviews
    .map((item, itemIndex) => [itemIndex, item] as const)
    .toReversed()) {
    anchoredHtml =
      anchoredHtml.slice(0, reviewMatch.index) +
      anchoredHtml
        .slice(reviewMatch.index, reviewMatch.end)
        .replace("<p>", `<p id="${entries[reviewIndex].anchorId}">`) +
      anchoredHtml.slice(reviewMatch.end);
  }
  return { html: anchoredHtml, tierList: { entries } };
}
