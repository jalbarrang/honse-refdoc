import { rewriteSiteUrls } from "~/shared/site-path";

export interface ArticleBodyProps {
  html: string;
}

export function ArticleBody(props: ArticleBodyProps) {
  return <div class="article-body" innerHTML={rewriteSiteUrls(props.html)} />;
}
