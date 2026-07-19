import type { SearchDocument } from "../models";

let documentsPromise: Promise<SearchDocument[]> | undefined;

export function loadSearchDocuments(): Promise<SearchDocument[]> {
  documentsPromise ??= import("../../../generated/search-documents.json").then(
    ({ default: documents }) => documents,
  );

  return documentsPromise;
}
