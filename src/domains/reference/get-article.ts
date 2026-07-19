import type { ReferenceArticle } from "./models";
import type { ReferenceRepository } from "./reference-repository";

export async function getArticle(
  repository: ReferenceRepository,
  path: string,
): Promise<ReferenceArticle | undefined> {
  return await repository.getArticle(path);
}
