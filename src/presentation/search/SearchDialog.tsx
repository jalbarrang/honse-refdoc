import { createEffect, createMemo, createSignal } from "solid-js";
import type { ReferenceDomain } from "~/domains/reference";
import { searchReference, type SearchDocument } from "~/domains/search";
import { SearchControls } from "./SearchControls";
import { SearchResults } from "./SearchResults";

export interface SearchDialogProps {
  open: boolean;
  domains: readonly ReferenceDomain[];
  documents?: SearchDocument[];
  loading?: boolean;
  error?: string;
  onClose: () => void;
}

export function SearchDialog(props: SearchDialogProps) {
  const [dialog, setDialog] = createSignal<HTMLDialogElement>();
  const [query, setQuery] = createSignal("");
  const [domain, setDomain] = createSignal("");
  const results = createMemo(() =>
    searchReference(props.documents ?? [], {
      text: query(),
      domain: domain() || undefined,
    }),
  );

  createEffect(() => {
    const element = dialog();
    if (props.open && element && !element.open) element.showModal();
    if (!props.open && element?.open) element.close();
  });

  const closeDialog = () => {
    props.onClose();
  };

  return (
    <dialog
      ref={setDialog}
      class="search-dialog"
      aria-labelledby="search-dialog-title"
      onClose={(event) => {
        // The close event is queued async; if the dialog was reopened before it
        // ran (close then instantly reopen), ignore the stale event.
        if (props.open && !event.currentTarget.open) props.onClose();
      }}
    >
      <header class="search-dialog-header">
        <h2 id="search-dialog-title">Search the field guide</h2>
        <button class="search-dialog-close" type="button" onClick={closeDialog}>
          Close
        </button>
      </header>
      <SearchControls
        query={query()}
        domain={domain()}
        domains={props.domains}
        onQueryChange={setQuery}
        onDomainChange={setDomain}
      />
      <SearchResults
        query={query()}
        results={results()}
        loading={props.loading ?? false}
        error={props.error}
        onNavigate={closeDialog}
      />
    </dialog>
  );
}
