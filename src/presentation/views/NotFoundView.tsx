import { toSitePath } from "~/shared/site-path";

export interface NotFoundViewProps {
  homeHref?: string;
}

export function NotFoundView(props: NotFoundViewProps) {
  return (
    <section class="not-found" aria-labelledby="not-found-title">
      <p class="error-code" aria-hidden="true">
        404
      </p>
      <div>
        <p class="article-kicker">Course notice</p>
        <h1 id="not-found-title">This trail leaves the course.</h1>
        <p>
          The requested field note could not be found. Return to the paddock and choose a marked
          route.
        </p>
        <a class="return-link" href={toSitePath(props.homeHref ?? "/")}>
          Return to the guide
        </a>
      </div>
    </section>
  );
}
