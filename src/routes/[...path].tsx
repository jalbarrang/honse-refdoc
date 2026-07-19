import { Meta, Title } from "@solidjs/meta";
import { createAsync, useParams } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { getArticle, StaticReferenceRepository } from "~/domains/reference";
import { ArticleView, DomainHubView, NotFoundView, ReferenceSiteShell } from "~/presentation";

const repository = new StaticReferenceRepository();
const licenseUrl = "https://creativecommons.org/licenses/by-nc/4.0/";

export default function ReferencePage() {
  const params = useParams<{ path: string }>();
  const path = () => `/${params.path}`;
  const article = createAsync(() => getArticle(repository, path()));
  const domainSlug = () => params.path.split("/")[0];
  const domains = repository.listDomains();
  const domain = () => domains.find((item) => item.slug === domainSlug());

  return (
    <ReferenceSiteShell domains={domains} activeDomain={domainSlug()}>
      <Suspense fallback={<p class="route-loading">Preparing the field notes...</p>}>
        <Show when={article()} fallback={<NotFoundView />}>
          {(current) => (
            <>
              <Title>{current().title} | Uma musume - Reference Document</Title>
              <Meta name="description" content={current().description} />
              <Show
                when={current().path === `/${domainSlug()}` && domain()}
                fallback={
                  <ArticleView
                    article={current()}
                    domain={domain()}
                    sourceUrl={licenseUrl}
                    sourceLabel="Read the CC BY-NC 4.0 license"
                  />
                }
              >
                {(activeDomain) => (
                  <DomainHubView
                    domain={activeDomain()}
                    articles={repository
                      .listArticles(activeDomain().slug)
                      .filter((item) => item.path !== current().path)}
                  />
                )}
              </Show>
            </>
          )}
        </Show>
      </Suspense>
    </ReferenceSiteShell>
  );
}
