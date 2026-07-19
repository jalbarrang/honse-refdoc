import type {
  SearchDocument,
  SearchHeading,
  SearchMatch,
  SearchQuery,
  SearchResult,
} from "./models";

const DEFAULT_RESULT_LIMIT = 20;

interface Match {
  score: 1 | 2 | 3;
  kind: SearchMatch;
  heading?: SearchHeading;
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function findMatch(document: SearchDocument, text: string): Match | undefined {
  if (normalize(document.title) === text) return { score: 3, kind: "title" };

  const heading = document.headings.find((item) => normalize(item.text).includes(text));
  if (heading) return { score: 2, kind: "heading", heading };

  const body = normalize(`${document.title} ${document.description} ${document.body}`);
  if (body.includes(text)) return { score: 1, kind: "body" };

  return undefined;
}

export function searchReference(documents: SearchDocument[], query: SearchQuery): SearchResult[] {
  const text = normalize(query.text);
  if (!text) return [];

  const limit = Math.max(0, Math.floor(query.limit ?? DEFAULT_RESULT_LIMIT));

  return documents
    .filter((document) => !query.domain || document.domain === query.domain)
    .flatMap((document): SearchResult[] => {
      const match = findMatch(document, text);
      if (!match) return [];

      return [
        {
          path: document.path,
          domain: document.domain,
          title: document.title,
          description: document.description,
          score: match.score,
          match: match.kind,
          heading: match.heading,
        },
      ];
    })
    .toSorted(
      (left, right) =>
        right.score - left.score ||
        left.title.localeCompare(right.title) ||
        left.path.localeCompare(right.path),
    )
    .slice(0, limit);
}
