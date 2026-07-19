import { createSignal, onCleanup, onMount, type ParentProps } from "solid-js";
import type { ReferenceDomain } from "~/domains/reference";
import type { SearchDocument } from "~/domains/search";
import { loadSearchDocuments } from "~/domains/search/infrastructure";
import { SearchDialog } from "../search/SearchDialog";
import { isEditableTarget, isSearchShortcut } from "../search/search-shortcuts";
import { SiteShell } from "./SiteShell";

export interface ReferenceSiteShellProps extends ParentProps {
  domains: readonly ReferenceDomain[];
  activeDomain?: string;
}

export function ReferenceSiteShell(props: ReferenceSiteShellProps) {
  const [searchOpen, setSearchOpen] = createSignal(false);
  const [documents, setDocuments] = createSignal<SearchDocument[]>();
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string>();
  let loadStarted = false;

  const openSearch = () => {
    setSearchOpen(true);
    if (loadStarted) return;

    loadStarted = true;
    setLoading(true);
    void loadSearchDocuments()
      .then(setDocuments)
      .catch(() => setError("The search index could not be loaded."))
      .finally(() => setLoading(false));
  };

  onMount(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target) || !isSearchShortcut(event)) return;
      event.preventDefault();
      openSearch();
    };

    document.addEventListener("keydown", handleShortcut);
    onCleanup(() => document.removeEventListener("keydown", handleShortcut));
  });

  return (
    <>
      <SiteShell
        domains={props.domains}
        activeDomain={props.activeDomain}
        onSearchOpen={openSearch}
      >
        {props.children}
      </SiteShell>
      <SearchDialog
        open={searchOpen()}
        domains={props.domains}
        documents={documents()}
        loading={loading()}
        error={error()}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
