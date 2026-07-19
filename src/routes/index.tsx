import { Meta, Title } from "@solidjs/meta";
import { StaticReferenceRepository } from "~/domains/reference";
import { HomeView, ReferenceSiteShell } from "~/presentation";

const repository = new StaticReferenceRepository();

export default function HomePage() {
  const domains = repository.listDomains();
  const articles = domains.flatMap((domain) => repository.listArticles(domain.slug));

  return (
    <ReferenceSiteShell domains={domains}>
      <Title>Uma musume - Reference Document</Title>
      <Meta
        name="description"
        content="A searchable global reference for Umamusume banners, strategy, and mechanics."
      />
      <HomeView domains={domains} articles={articles} />
    </ReferenceSiteShell>
  );
}
