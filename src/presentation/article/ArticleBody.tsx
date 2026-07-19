export interface ArticleBodyProps {
  html: string;
}

export function ArticleBody(props: ArticleBodyProps) {
  return <div class="article-body" innerHTML={props.html} />;
}
