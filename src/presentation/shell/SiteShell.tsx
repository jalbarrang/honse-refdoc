import type { ParentProps } from "solid-js";
import type { ReferenceDomain } from "~/domains/reference";
import { DesktopDomainNav } from "../navigation/DesktopDomainNav";
import { MobileDomainNav } from "../navigation/MobileDomainNav";
import { SearchTrigger } from "../navigation/SearchTrigger";

export interface SiteShellProps extends ParentProps {
  domains: readonly ReferenceDomain[];
  activeDomain?: string;
  onSearchOpen?: () => void;
}

export function SiteShell(props: SiteShellProps) {
  return (
    <div id="top" class="site-shell">
      <a class="skip-link" href="#main-content">
        Skip to field guide
      </a>
      <header class="site-header">
        <a class="site-mark" href="/" aria-label="Uma Reference home">
          <span aria-hidden="true">U</span>
          <strong>Uma Refdoc</strong>
          <small>Trackside field guide</small>
        </a>
        <div class="header-actions">
          <SearchTrigger onOpen={props.onSearchOpen} />
          <MobileDomainNav domains={props.domains} activeDomain={props.activeDomain} />
        </div>
      </header>
      <div class="shell-grid">
        <DesktopDomainNav domains={props.domains} activeDomain={props.activeDomain} />
        <main id="main-content" tabindex="-1">
          {props.children}
        </main>
      </div>
      <footer class="site-footer">
        <p>
          <strong>Uma Reference</strong> / community guide by Erzzy, with terminology help from
          Kireina.
        </p>
        <div>
          <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a>
          <a href="#top">Back to top</a>
        </div>
      </footer>
    </div>
  );
}
