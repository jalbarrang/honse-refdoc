export function normalizeBasePath(basePath: string | undefined): string {
  const trimmed = basePath?.trim().replace(/^\/+|\/+$/g, "") ?? "";

  return trimmed ? `/${trimmed}` : "";
}

export function toSitePath(path: string, basePath = import.meta.env.SERVER_BASE_URL): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;

  const normalizedBasePath = normalizeBasePath(basePath);
  if (!normalizedBasePath) return path;
  if (path === "/") return `${normalizedBasePath}/`;
  if (path === normalizedBasePath || path.startsWith(`${normalizedBasePath}/`)) return path;

  return `${normalizedBasePath}${path}`;
}

export function rewriteSiteUrls(html: string, basePath = import.meta.env.SERVER_BASE_URL): string {
  return html.replace(
    /\b(href|src)=(["'])(\/(?!\/)[^"']*)\2/g,
    (_match, attribute, quote, path) => {
      return `${attribute}=${quote}${toSitePath(path, basePath)}${quote}`;
    },
  );
}
